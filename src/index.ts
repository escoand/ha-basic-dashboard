import "core-js/actual/array/filter";
import "core-js/actual/array/find";
import "core-js/actual/array/for-each";
import "core-js/actual/array/includes";
import "core-js/actual/array/is-array";
import "core-js/actual/array/map";
import "core-js/actual/array/some";
import "core-js/actual/json/parse";
import "core-js/actual/object/keys";
import { HassEntity } from "home-assistant-js-websocket/dist/types";
import { getIcon } from "./icons";
import { BasicDashboardConfig, BasicDashboardConfigEntity } from "./types";

const refreshInterval = 5 * 60 * 1000;
const actionRefreshTimeouts = [1 * 1000, 20 * 1000];

class BasicDashboard {
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
    callback?: (response: string) => void
  ) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, (this.config?.base || "") + url);
    xhr.setRequestHeader("Authorization", "Bearer " + this.config?.token);
    xhr.onreadystatechange = (evt) => {
      if (xhr.readyState == 4 /* XMLHttpRequest.DONE */) {
        switch (xhr.status) {
          case 200:
            if (callback) {
              callback(xhr.responseText);
            }
            break;
          default:
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

class BasicDashboardEntity {
  private dashboard: BasicDashboard;
  private config?: BasicDashboardConfigEntity;
  private entity: HassEntity;
  private refreshToken: number;
  private element: HTMLElement;

  constructor(dashboard: BasicDashboard, config?: BasicDashboardConfigEntity) {
    this.dashboard = dashboard;
    this.config = config;
    this.element = this.dashboard.elEntities.appendChild(
      document.createElement("div")
    );
    this.element.className = "box entity";
    this.element.id = this.config?.entity_id as string;
    this.element.addEventListener("DOMNodeRemoved", () =>
      clearTimeout(this.refreshToken)
    );
  }

  refresh = () => {
    this.dashboard.request(
      "GET",
      "/api/states/" + (this.entity?.entity_id || this.config?.entity_id),
      undefined,
      (response) => this.update(JSON.parse(response))
    );
    this.refreshToken = setTimeout(this.refresh, refreshInterval);
  };

  update = (entity: HassEntity) => {
    this.entity = entity;
    this.render();
  };

  render = () => {
    if (!this.entity) return;
    this.element.id = this.entity.entity_id;
    this.element.innerHTML = "";
    this.element.className = "box entity";
    // name
    const name = this.element.appendChild(document.createElement("div"));
    name.className = "name";
    name.appendChild(
      document.createTextNode(
        this.config?.name ||
          this.entity.attributes?.friendly_name ||
          this.entity.entity_id
      )
    );
    // state
    const icon = getIcon(this.entity);
    const state = this.element.appendChild(document.createElement("div"));
    const attributes = this.entity.attributes;
    state.className = "state";
    // attribute
    if (this.config?.attribute) {
      const unitAttribute = this.config.attribute + "_unit";
      state.appendChild(
        document.createTextNode(attributes[this.config.attribute])
      );
      state.appendChild(document.createTextNode(" "));
      if (this.config?.unit_of_measurement) {
        state.appendChild(
          document.createTextNode(this.config?.unit_of_measurement)
        );
      } else if (unitAttribute in attributes) {
        state.appendChild(document.createTextNode(attributes[unitAttribute]));
      }
    }
    // icon
    else if (icon) {
      state.setAttribute("title", this.entity.state);
      const svg = state.appendChild(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      );
      svg.setAttribute("viewBox", "0 0 24 24");
      svg
        .appendChild(document.createElementNS(svg.namespaceURI, "path"))
        .setAttribute("d", icon);
    }
    // state
    else {
      state.appendChild(document.createTextNode(this.entity.state));
      state.appendChild(document.createTextNode(" "));
      if (this.config?.unit_of_measurement) {
        state.appendChild(
          document.createTextNode(this.config?.unit_of_measurement)
        );
      } else if (attributes.unit_of_measurement) {
        state.appendChild(
          document.createTextNode(attributes.unit_of_measurement)
        );
      }
    }
    // clickable
    if (this.config?.action) {
      this.element.className += " action";
      this.element.addEventListener("click", this.onClick);
    }
  };

  onClick = (event: Event) => {
    event.stopPropagation();
    this.dashboard.request(
      "POST",
      "/api/services/" + this.config?.action?.replace(".", "/"),
      '{"entity_id":"' + this.entity.entity_id + '"}',
      () =>
        actionRefreshTimeouts.forEach((timeout) =>
          setTimeout(this.refresh, timeout)
        )
    );
  };
}

// catch errors
console.error = (reason: ErrorEvent | string) => {
  const msg = (reason as ErrorEvent).message || (reason as string);
  const container = document.getElementById("message");
  if (container) {
    const elem = container.appendChild(document.createElement("pre"));
    elem.appendChild(document.createTextNode(msg));
    setTimeout(() => elem.parentElement?.removeChild(elem), 10 * 1000);
  } else {
    alert(msg);
  }
};
addEventListener("error", console.error);

// load app
addEventListener("load", () => new BasicDashboard());
