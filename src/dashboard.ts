import "core-js/actual/array/filter";
import "core-js/actual/array/for-each";
import "core-js/actual/array/is-array";
import "core-js/actual/array/map";
import "core-js/actual/json/parse";
import "core-js/actual/object/keys";
import { HassEntity } from "home-assistant-js-websocket/dist/types";
import { BasicDashboardEntity } from "./entity";
import { BasicDashboardConfig } from "./types";

export class BasicDashboard {
  config: BasicDashboardConfig;
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
    this.request("GET", "config.json", undefined, (response) => {
      this.config = JSON.parse(response);
      Object.keys(this.config.floors || []).map((floor) => {
        const elem = elFloors.appendChild(document.createElement("div"));
        elem.appendChild(document.createTextNode(floor));
        elem.className = "box floor action";
        elem.addEventListener("click", () => this.switchFloor(floor));
      });
      this.switchFloor(Object.keys(this.config.floors || [])[0]);
    });
  }

  switchFloor = (floor: string) => {
    this.elEntities.innerHTML = "";
    this.floor = floor;
    const floorConfig = this.config.floors[this.floor];
    if (Array.isArray(floorConfig)) {
      floorConfig.forEach((config) =>
        new BasicDashboardEntity(this, config).refresh()
      );
    } else {
      this.refresh();
    }
  };

  refresh = () =>
    this.request("GET", "/api/states", undefined, (response) => {
      const floor = this.config.floors[this.floor];
      // date
      this.elStatus.innerHTML = new Date().toLocaleTimeString(undefined, {
        timeStyle: "medium",
      });
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
    });

  // https://developers.home-assistant.io/docs/api/rest/
  request = (
    method: string,
    url: string,
    body?: string,
    callback?: (response: string) => void,
    errorCallback?: (xhr: XMLHttpRequest) => void
  ) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, (this.config?.base || "") + url);
    xhr.setRequestHeader("Authorization", "Bearer " + this.config?.token);
    xhr.onreadystatechange = (evt) => {
      if (xhr.readyState == 4 /* XMLHttpRequest.DONE */) {
        switch (xhr.status) {
          case 200:
            callback && callback(xhr.responseText);
            break;
          default:
            errorCallback && errorCallback(xhr);
            console.error(xhr.responseText);
        }
      }
    };
    xhr.send(body);
  };

  throwException = (reason: string): never => {
    throw new Error(reason);
  };
}
