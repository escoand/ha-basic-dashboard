import { BasicDashboardChartBase } from "./chart";
import { defaultRefreshInterval } from "./const";
import { BasicDashboard } from "./dashboard";
import { errorWrapper } from "./errors";
import {
  BasicDashboardConfigChartElement,
  BasicDashboardConfigHistory,
} from "./types";

export class BasicDashboardHistory extends BasicDashboardChartBase {
  private entities: string[];

  constructor(dashboard: BasicDashboard, config: BasicDashboardConfigHistory) {
    const entities: string[] = [];
    const chartConfig = Object.assign(
      {},
      config
    ) as BasicDashboardConfigChartElement;
    chartConfig.chart.data = config.entities.map((entity, idx) => {
      const isString = typeof entity == "string";
      entities.push(isString ? entity : entity.entity_id);
      return {
        data: [idx.toString()],
        stepline: true,
        x: "last_changed",
        y:
          !isString && entity.attribute
            ? ["attributes", entity.attribute]
            : "state",
      };
    });
    super(dashboard, chartConfig);
    this.entities = entities;
  }

  refresh = errorWrapper(() => {
    this.dashboard.request(
      "GET",
      "/api/history/period?minimal_response=true&significant_changes_only=true&filter_entity_id=" +
        this.entities.join(","),
      undefined,
      errorWrapper(this.update)
    );
    setTimeout(
      this.refresh,
      this.dashboard.config?.refresh || defaultRefreshInterval
    );
  });
}
