import "core-js/actual/array/includes";
import "core-js/actual/json/parse";
import { BasicDashboard } from "./dashboard";
import { errorWrapper } from "./errors";
import { BasicDashboardConfigAction, BasicDashboardElement } from "./types";

const refreshInterval = 10 * 60 * 1000;
const defaultGraphHeight = 52;
const defaultGraphTicks = 3;
const defaultGraphWidth = 135;

export class BasicDashboardAction implements BasicDashboardElement {
  private dashboard: BasicDashboard;
  private config?: BasicDashboardConfigAction;
  private data: {};
  private refreshToken: number;
  private element: HTMLElement;

  constructor(dashboard: BasicDashboard, config?: BasicDashboardConfigAction) {
    this.dashboard = dashboard;
    this.config = config;
    this.element = this.dashboard.elEntities.appendChild(
      document.createElement("div")
    );
    this.element.className = "box chart";
  }

  refresh = errorWrapper(() => {
    this.dashboard.request(
      "POST",
      "/api/services/" +
        this.config?.action.replace(".", "/") +
        "?return_response",
      undefined,
      errorWrapper(this.update)
    );
    this.refreshToken = setTimeout(
      this.refresh,
      this.dashboard.config.refresh || refreshInterval
    );
  });

  update = errorWrapper((data) => {
    this.data = JSON.parse(data);
    this.render();
  });

  render = errorWrapper(() => {
    if (!this.config) return;
    this.element.id = this.config?.action;
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

  private renderChart = () => {
    if (!this.config?.chart) {
      return;
    }
    const graphHeight = this.config?.chart?.height || defaultGraphHeight;
    const graphWidth = this.config?.chart?.width || defaultGraphWidth;

    const svg = this.element.appendChild(
      document.createElementNS("http://www.w3.org/2000/svg", "svg")
    );
    svg.setAttribute("height", graphHeight.toString());
    svg.setAttribute("width", graphWidth.toString());
    svg.setAttribute("viewBox", `0 0 ${graphWidth} ${graphHeight}`);

    // response data
    const points: number[][] = [];
    let data = this.data;
    this.config.chart.data.forEach((key) => (data = data[key]));
    const dataArr = data as [][];
    let minX = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let minY = Number.MAX_VALUE;
    let maxY = Number.MIN_VALUE;
    for (let i = 0; i < dataArr.length; i++) {
      const x = Date.parse(dataArr[i][this.config.chart.x]);
      const y = dataArr[i][this.config.chart.y] * 100;
      minX = x < minX ? x : minX;
      maxX = x > maxX ? x : maxX;
      minY = y < minY ? y : minY;
      maxY = y > maxY ? y : maxY;
      points.push([x, y]);
    }
    const scaleY = graphHeight / (maxY - minY);
    const scaleX = graphWidth / (maxX - minX);
    const line = svg.appendChild(
      document.createElementNS("http://www.w3.org/2000/svg", "polyline")
    );
    line.setAttribute(
      "points",
      points
        .map(
          ([x, y]) =>
            `${(x - minX) * scaleX},${graphHeight - (y - minY) * scaleY}`
        )
        .join(" ")
    );

    // now
    if (this.config.chart.now) {
      const x = (Date.now() - minX) * scaleX;
      const now = svg.appendChild(
        document.createElementNS(svg.namespaceURI, "line")
      );
      now.setAttribute("x1", x.toFixed(2));
      now.setAttribute("y1", "0");
      now.setAttribute("x2", x.toFixed(2));
      now.setAttribute("y2", graphHeight.toFixed());
      now.setAttribute("class", "now");
    }

    // ticks
    const ticks = this.config.chart.ticks || defaultGraphTicks;
    const step = (maxY - minY) / (ticks - 1);
    for (let i = 0; i < ticks; i++) {
      const val = minY + i * step;
      const y = graphHeight - (val - minY) * scaleY;
      const align =
        i == 0 ? "after-edge" : i == ticks - 1 ? "before-edge" : "middle";
      const tick = svg.appendChild(
        document.createElementNS(svg.namespaceURI, "line")
      );
      tick.setAttribute("x1", "0");
      tick.setAttribute("y1", y.toFixed(2));
      tick.setAttribute("x2", graphWidth.toFixed());
      tick.setAttribute("y2", y.toFixed(2));
      tick.setAttribute("class", "tick");
      const text = svg.appendChild(
        document.createElementNS(svg.namespaceURI, "text")
      );
      text.setAttribute("x", "0");
      text.setAttribute("y", y.toFixed(2));
      text.setAttribute("alignment-baseline", align);
      text.appendChild(document.createTextNode(val.toFixed(1)));
      text.setAttribute("class", "tick");
    }
  };
}
