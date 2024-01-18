import "core-js/actual/array/includes";
import "core-js/actual/json/parse";
import { HassEntity } from "home-assistant-js-websocket/dist/types";
import { BasicDashboard } from "./dashboard";
import { errorWrapper } from "./errors";
import { getActionIcon, getEntityIcon, iconViewbox } from "./icons";
import { BasicDashboardConfigEntity } from "./types";

const refreshInterval = 5 * 60 * 1000;
const actionTimeout = 3 * 1000;

export class BasicDashboardEntity {
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
    this.element.addEventListener(
      "DOMNodeRemoved",
      errorWrapper(() => clearTimeout(this.refreshToken))
    );
  }

  refresh = errorWrapper(() => {
    this.dashboard.request(
      "GET",
      "/api/states/" + (this.entity?.entity_id || this.config?.entity_id),
      undefined,
      errorWrapper((response) => this.update(JSON.parse(response)))
    );
    this.refreshToken = setTimeout(
      this.refresh,
      this.dashboard.config.refresh || refreshInterval
    );
  });

  update = errorWrapper((entity: HassEntity) => {
    this.entity = entity;
    this.render();
  });

  render = errorWrapper(() => {
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
    const icon = getEntityIcon(this.entity);
    const wrapper = this.element.appendChild(document.createElement("div"));
    const state = wrapper.appendChild(document.createElement("span"));
    const attributes = this.entity.attributes;
    wrapper.className = "state";
    // attribute
    if (this.config?.attribute) {
      const unitAttribute = this.config.attribute + "_unit";
      state.appendChild(document.createTextNode(" "));
      /*if (["last_triggered"].includes(this.config.attribute)) {
              state.appendChild(
                document.createTextNode(
                  new Date(attributes[this.config.attribute]).toLocaleString(
                    undefined,
                    {
                      dateStyle: "short",
                      timeStyle: "medium",
                    }
                  )
                )
              );
            } else*/ {
        state.appendChild(
          document.createTextNode(attributes[this.config.attribute])
        );
      }
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
      wrapper.innerHTML = "";
      wrapper.setAttribute("title", this.entity.state);
      const svg = wrapper.appendChild(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      );
      svg.setAttribute("viewBox", iconViewbox);
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
  });

  actionFeedback = errorWrapper((action: string) => {
    setInterval(this.refresh, actionTimeout);
    const icon = getActionIcon(action);
    if (!icon) return;
    const svg = this.element.appendChild(
      document.createElementNS("http://www.w3.org/2000/svg", "svg")
    );
    svg.setAttribute("class", "action");
    svg.setAttribute("viewBox", iconViewbox);
    svg
      .appendChild(document.createElementNS(svg.namespaceURI, "path"))
      .setAttribute("d", icon);
  });

  onClick = errorWrapper((event: Event) => {
    event.stopPropagation();
    this.dashboard.request(
      "POST",
      "/api/services/" + this.config?.action?.replace(".", "/"),
      '{"entity_id":"' + this.entity.entity_id + '"}',
      () => this.actionFeedback("success"),
      () => this.actionFeedback("failure")
    );
  });
}
