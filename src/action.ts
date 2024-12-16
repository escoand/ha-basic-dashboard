import { BasicDashboardChartBase } from "./chart";
import { defaultRefreshInterval } from "./const";
import { errorWrapper } from "./errors";
import { BasicDashboardConfigAction } from "./types";

export class BasicDashboardAction extends BasicDashboardChartBase {
  refresh = errorWrapper(() => {
    const config = this.config as BasicDashboardConfigAction;
    this.dashboard.request(
      "POST",
      "/api/services/" + config.action.replace(".", "/") + "?return_response",
      JSON.stringify(config.action_data),
      errorWrapper(this.update)
    );
    setTimeout(
      this.refresh,
      this.dashboard.config?.refresh || defaultRefreshInterval
    );
  });
}
