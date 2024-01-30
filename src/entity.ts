import "core-js/actual/array/includes";
import "core-js/actual/json/parse";
import { HassEntity } from "home-assistant-js-websocket/dist/types";
import { BasicDashboard } from "./dashboard";
import { errorWrapper } from "./errors";
import { getActionIcon, getEntityIcon, iconViewbox } from "./icons";
import { BasicDashboardConfigEntity } from "./types";

const refreshInterval = 60 * 1000;
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
    if (!this.element) clearTimeout(this.refreshToken);
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
    wrapper.className = "state";
    // attribute
    if (this.config?.attribute) {
      (Array.isArray(this.config.attribute)
        ? this.config.attribute
        : [this.config.attribute]
      ).forEach((attr) => this.renderState(wrapper, attr));
    }
    // icon
    else if (icon) {
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
      this.renderState(wrapper);
    }
    // clickable
    if (this.config?.service) {
      this.element.className += " action";
      this.element.addEventListener("click", this.onClick);
    }
  });

  renderState = errorWrapper((parent: HTMLElement, attr?: string) => {
    const elem = parent.appendChild(document.createElement("span"));

    function inner(state: string, unit?: string) {
      elem.appendChild(document.createTextNode(state));
      if (unit) {
        elem.appendChild(document.createTextNode(unit));
      }
    }

    attr
      ? inner(
          this.entity.attributes[attr],
          this.config?.unit_of_measurement ||
            this.entity.attributes[attr + "_unit"]
        )
      : inner(this.entity.state, this.entity.attributes.unit_of_measurement);
    parent.appendChild(document.createTextNode(" "));
  });

  actionFeedback = errorWrapper((action: string) => {
    setTimeout(this.refresh, actionTimeout);
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
      "/api/services/" + this.config?.service?.replace(".", "/"),
      JSON.stringify(this.config?.service_data),
      () => this.actionFeedback("success"),
      () => this.actionFeedback("failure")
    );
  });
}
