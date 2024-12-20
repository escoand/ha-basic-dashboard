import { HassEntity } from "home-assistant-js-websocket";
import { BasicDashboardAction } from "./action";
import { BasicDashboardEntity } from "./entity";
import { errorWrapper } from "./errors";
import { BasicDashboardConfig, BasicDashboardConfigEntry } from "./types";
import { defaultRequestTimout } from "./const";
import { BasicDashboardHistory } from "./history";

export class BasicDashboard {
  config: BasicDashboardConfig | undefined;
  private floor: string;
  elEntities: HTMLElement;
  private elStatus: HTMLElement;

  constructor() {
    // containers
    const elFloors =
      document.getElementById("floors") ??
      this.throwException("unable to find floors element");
    this.elEntities =
      document.getElementById("entities") ??
      this.throwException("unable to find entities element");
    this.elStatus =
      document.getElementById("status") ??
      this.throwException("unable to find status element");
    // config
    this.request(
      "GET",
      "config.json",
      undefined,
      errorWrapper((response) => {
        this.config = JSON.parse(response);
        Object.keys(this.config?.floors || []).map((floor) => {
          const elem = elFloors.appendChild(document.createElement("div"));
          elem.appendChild(document.createTextNode(floor));
          elem.className = "box floor action";
          elem.addEventListener("click", () => this.switchFloor(floor));
        });
        this.switchFloor(Object.keys(this.config?.floors || [])[0]);
      })
    );
  }

  switchFloor = errorWrapper((floor: string) => {
    this.elEntities.innerHTML = "";
    this.floor = floor;
    const floorConfig = this.config?.floors[this.floor];
    if (Array.isArray(floorConfig)) {
      floorConfig.forEach(this.createElement);
    } else {
      this.refresh();
    }
  });

  refresh = errorWrapper(() =>
    this.request(
      "GET",
      "/api/states",
      undefined,
      errorWrapper((response) => {
        const floor = this.config?.floors[this.floor];
        // data
        const entities = JSON.parse(response) as HassEntity[];
        entities
          .filter(
            (entity) =>
              // nothing defined
              floor === null ||
              // regex
              ((typeof floor === "string" || floor instanceof String) &&
                new RegExp(floor as string).test(entity.entity_id))
          )
          .forEach((entity) => {
            new BasicDashboardEntity(this).update(entity);
          });
      })
    )
  );

  // https://developers.home-assistant.io/docs/api/rest/
  request = errorWrapper(
    (
      method: string,
      url: string,
      body?: string,
      callback?: (response: string) => void,
      errorCallback?: (xhr: XMLHttpRequest) => void
    ) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = defaultRequestTimout;
      xhr.open(method, (this.config?.base || "") + url);
      xhr.setRequestHeader("Authorization", "Bearer " + this.config?.token);
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 /* XMLHttpRequest.DONE */) {
          // date
          this.elStatus.innerHTML = new Date().toLocaleTimeString(
            this.config?.locale,
            { timeStyle: "medium" }
          );
          switch (xhr.status) {
            case 200:
              callback && callback(xhr.responseText);
              break;
            default:
              xhr.dispatchEvent(new Event("error"));
          }
        }
      };
      xhr.addEventListener("error", () => {
        errorCallback && errorCallback(xhr);
        console.error(xhr.responseText);
      });
      xhr.send(body);
    }
  );

  createElement = (config: BasicDashboardConfigEntry) => {
    if ("entity_id" in config) {
      new BasicDashboardEntity(this, config).refresh();
    } else if ("entities" in config) {
      new BasicDashboardHistory(this, config).refresh();
    } else if ("action" in config) {
      new BasicDashboardAction(this, config).refresh();
    } else {
      console.log("unknown config entry");
    }
  };

  throwException = (reason: string): never => {
    throw new Error(reason);
  };
}
