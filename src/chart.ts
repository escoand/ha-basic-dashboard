import {
  defaultGraphHeight,
  defaultGraphTicks,
  defaultGraphWidth,
} from "./const";
import { BasicDashboard } from "./dashboard";
import { errorWrapper } from "./errors";
import { parseIsoDate } from "./iso8601";
import {
  BasicDashboardChartConfigEntry,
  BasicDashboardConfigChartElement,
  BasicDashboardElement,
} from "./types";

type ChartPoint = {
  x: number;
  y: number;
};
type ChartData = {
  points: ChartPoint[];
  ticks: number[];
};
type ChartRange = {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
};

export abstract class BasicDashboardChartBase implements BasicDashboardElement {
  protected dashboard: BasicDashboard;
  protected config?: BasicDashboardConfigChartElement;
  protected data: {};
  protected element: HTMLElement;
  private svg: SVGSVGElement;
  private graphHeight: number;
  private graphWidth: number;

  constructor(
    dashboard: BasicDashboard,
    config: BasicDashboardConfigChartElement
  ) {
    this.dashboard = dashboard;
    this.config = config;
    this.element = this.dashboard.elEntities.appendChild(
      document.createElement("div")
    );
    this.element.className = "box chart";
    this.graphHeight = this.config?.chart?.height || defaultGraphHeight;
    this.graphWidth = this.config?.chart?.width || defaultGraphWidth;
  }

  abstract refresh();

  update = errorWrapper((data) => {
    this.data = JSON.parse(data);
    this.render();
  });

  render = errorWrapper(() => {
    if (!this.config) return;
    this.element.innerHTML = "";
    // name
    if (this.config?.name) {
      const name = this.element.appendChild(document.createElement("div"));
      name.className = "name";
      name.appendChild(document.createTextNode(this.config?.name));
    }

    if (this.config?.chart) {
      this.renderChart();
    }
  });

  protected renderChart() {
    this.svg = this.element.appendChild(
      document.createElementNS("http://www.w3.org/2000/svg", "svg")
    );
    this.svg.setAttribute("height", this.graphHeight.toString());
    this.svg.setAttribute("width", this.graphWidth.toString());
    this.svg.setAttribute(
      "viewBox",
      `0 0 ${this.graphWidth} ${this.graphHeight}`
    );

    const points = this.config?.chart.data.map(this.collectPoints);
    const range = this.calcRange(points || []);
    points?.forEach((_) => this.renderChartData(_, range));
  }

  dataAtPath = (data: any, path: string | string[] | undefined) => {
    if (typeof path === "string") {
      return data[path];
    } else if (Array.isArray(path)) {
      return path.reduce((data, key) => data[key], data) as [][];
    } else {
      return data;
    }
  };

  collectPoints = (entryCfg: BasicDashboardChartConfigEntry): ChartData => {
    const points: ChartPoint[] = [];
    const ticks: number[] = [];
    let prevY: number | undefined = undefined;

    this.dataAtPath(this.data, entryCfg.data).forEach((point, idx) => {
      const val = this.dataAtPath(point, entryCfg.x);
      const dateX = Date.parse(val) || parseIsoDate(val);
      const x = dateX || parseFloat(val) || idx;
      const y = this.dataAtPath(point, entryCfg.y) * (entryCfg.factor ?? 1);
      if (isNaN(y)) return;
      if (entryCfg.stepline && prevY !== undefined) {
        points.push({ x, y: prevY });
      }
      points.push({ x, y });
      if (dateX) ticks.push(dateX);
      prevY = y;
    });

    return { points, ticks };
  };

  calcRange = (data: ChartData[]): ChartRange => {
    let xs: number[] = [];
    let ys: number[] = [];

    data.forEach(({ points }) =>
      points.forEach(({ x, y }) => {
        xs.push(x);
        ys.push(y);
      })
    );

    return {
      minX: Math.min.apply(Math, xs),
      maxX: Math.max.apply(Math, xs),
      minY: Math.min.apply(Math, ys),
      maxY: Math.max.apply(Math, ys),
    };
  };

  renderChartData = (data: ChartData, range: ChartRange) => {
    const isEmpty = this.svg.childNodes.length == 0;
    const ticks = this.config?.chart.ticks || defaultGraphTicks;
    const scaleX = this.graphWidth / (range.maxX - range.minX);
    const scaleY = this.graphHeight / (range.maxY - range.minY);

    // now
    if (isEmpty && this.config?.chart.now) {
      const x = (Date.now() - range.minX) * scaleX;
      const now = this.svg.appendChild(
        document.createElementNS(this.svg.namespaceURI, "line")
      );
      now.setAttribute("x1", x.toFixed(2));
      now.setAttribute("y1", "0");
      now.setAttribute("x2", x.toFixed(2));
      now.setAttribute("y2", this.graphHeight.toFixed());
      now.setAttribute("class", "now");
    }

    // x-axis ticks
    if (isEmpty && ticks != 0) {
      let prevStr;
      data.ticks.forEach((x) => {
        const date = new Date(x);
        const str = this.config?.chart.datetime_format
          ? date.toLocaleTimeString(
              this.dashboard.config?.locale,
              this.config?.chart.datetime_format
            )
          : date.getHours().toFixed().padStart(2, "0");
        if (prevStr === str) {
          return;
        }
        const text = this.svg.appendChild(
          document.createElementNS(this.svg.namespaceURI, "text")
        );
        text.setAttribute("x", ((x - range.minX) * scaleX).toString());
        text.setAttribute("y", this.graphHeight.toFixed());
        text.setAttribute("alignment-baseline", "after-edge");
        text.setAttribute("class", "tick");
        text.appendChild(document.createTextNode(str));
        prevStr = str;
      });
    }

    // y-axis ticks
    if (isEmpty && ticks > 0) {
      const step = (range.maxY - range.minY) / (ticks - 1);
      for (let i = 0; i < ticks; i++) {
        const val = range.minY + i * step;
        const y = this.graphHeight - (val - range.minY) * scaleY;
        const align =
          i == 0 ? "after-edge" : i == ticks - 1 ? "before-edge" : "middle";
        const tick = this.svg.appendChild(
          document.createElementNS(this.svg.namespaceURI, "line")
        );
        tick.setAttribute("x1", "0");
        tick.setAttribute("y1", y.toFixed(2));
        tick.setAttribute("x2", this.graphWidth.toFixed());
        tick.setAttribute("y2", y.toFixed(2));
        tick.setAttribute("class", "tick");
        const text = this.svg.appendChild(
          document.createElementNS(this.svg.namespaceURI, "text")
        );
        text.setAttribute("x", "0");
        text.setAttribute("y", y.toFixed(2));
        text.setAttribute("alignment-baseline", align);
        text.appendChild(document.createTextNode(val.toFixed(1)));
        text.setAttribute("class", "tick");
      }
    }

    // data line
    this.svg
      .appendChild(document.createElementNS(this.svg.namespaceURI, "polyline"))
      .setAttribute(
        "points",
        data.points
          .map(
            ({ x, y }) =>
              `${(x - range.minX) * scaleX},${
                this.graphHeight - (y - range.minY) * scaleY
              }`
          )
          .join(" ")
      );
  };
}
