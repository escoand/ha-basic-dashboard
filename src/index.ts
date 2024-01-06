import icon_sensor_on from "../node_modules/@mdi/svg/svg/check-circle.svg";
import icon_sensor_off from "../node_modules/@mdi/svg/svg/circle-outline.svg";
import icon_toggle_on from "../node_modules/@mdi/svg/svg/toggle-switch.svg";
import icon_toggle_off from "../node_modules/@mdi/svg/svg/toggle-switch-off-outline.svg";
import icon_alert from "../node_modules/@mdi/svg/svg/alert-outline.svg";
import icon_cover_open from "../node_modules/@mdi/svg/svg/garage-open.svg";
import icon_cover_closed from "../node_modules/@mdi/svg/svg/garage.svg";
import icon_cover_opening from "../node_modules/@mdi/svg/svg/arrow-up-box.svg";
import icon_cover_closing from "../node_modules/@mdi/svg/svg/arrow-down-box.svg";

const binaries = {
  on: icon_sensor_on,
  off: icon_sensor_off,
};
const toggles = {
  off: icon_toggle_off,
  on: icon_toggle_on,
  unavailable: icon_alert,
};

const icons: { [index: string]: any } = {
  binary_sensor: binaries,
  climate: toggles,
  cover: {
    open: icon_cover_open,
    opening: icon_cover_opening,
    closed: icon_cover_closed,
    closing: icon_cover_closing,
    editable: true,
  },
  switch: { ...toggles, editable: true },
  update: toggles,
};

class BasicDashboard {
  config: BasicDashboardConfig = {};
  currentFloor: string = "not_existing";

  constructor() {
    const container = document.getElementById("floors");
    if (!container) return;
    // config
    this.request("GET", "config.json", undefined, (xhr) => {
      this.config = JSON.parse(xhr.responseText);
      Object.keys(this.config.floors || []).map((floor) => {
        const elem = container.appendChild(document.createElement("div"));
        elem.append(floor);
        elem.className = "floor";
        elem.style.cursor = "pointer";
        elem.addEventListener("click", () => {
          this.currentFloor = floor;
          this.loadStates();
        });
      });
      // start update cycle
      this.currentFloor = Object.keys(this.config.floors || [])[0];
      setInterval(this.loadStates, 10 * 1000);
      this.loadStates();
    });
  }

  filterEntity = (floor: string, entity_id: string) => {
    const isRegex = /^\/.*\/$/;
    return (
      // nothing defined
      this.config.floors?.[floor] === null ||
      // fixed entity_id
      this.config.floors?.[floor]?.includes(entity_id) ||
      // regex
      this.config.floors?.[floor]?.some(
        (_) =>
          isRegex.test(_) &&
          new RegExp(_.substring(1, _.length - 1)).test(entity_id)
      )
    );
  };

  loadStates = (entity_id?: string) => {
    const container = document.getElementById("entities");
    if (!container) return;
    this.request(
      "GET",
      "/api/states" + (entity_id ? "/" + entity_id : ""),
      undefined,
      (xhr) => {
        // date
        const date = document.getElementById("date");
        if (date) {
          date.innerHTML = new Date().toLocaleTimeString(undefined, {
            timeStyle: "medium",
          });
        }
        // update
        if (entity_id) {
          this.updateState(JSON.parse(xhr.responseText));
        }
        // entities
        else {
          container.innerHTML = "";
          JSON.parse(xhr.responseText)
            ?.filter((entity) =>
              this.filterEntity(this.currentFloor, entity.entity_id)
            )
            .map(this.updateState);
        }
      }
    );
  };

  updateState = (entity) => {
    const container = document.getElementById("entities");
    if (!container) return;
    const elem =
      document.getElementById(entity.entity_id) ||
      container.appendChild(document.createElement("div"));
    elem.innerHTML = "";
    elem.id = entity.entity_id;
    elem.className = "entity";
    // name
    const name = elem.appendChild(document.createElement("div"));
    name.className = "name";
    name.appendChild(
      document.createTextNode(
        entity.attributes?.friendly_name || entity.entity_id
      )
    );
    // state
    const domain = entity.entity_id.split(".")[0];
    const state = elem.appendChild(document.createElement("div"));
    state.className = "state";
    // icon
    if (domain in icons && entity.state in icons[domain]) {
      state.setAttribute("title", JSON.stringify(entity));
      state.innerHTML = icons[domain][entity.state];
    }
    // text
    else {
      state.append(entity.state);
    }
    // clickable
    if (icons[domain]?.editable) {
      elem.style.cursor = "pointer";
      elem.addEventListener("click", () => this.toggleState(entity.entity_id));
    }
  };

  toggleState = (entity_id) => {
    this.request(
      "POST",
      "/api/services/homeassistant/toggle",
      JSON.stringify({ entity_id }),
      () => setTimeout(() => this.loadStates(entity_id), 1000)
    );
  };

  error = (reason) => {
    const container = document.getElementById("entities");
    if (container) {
      container.innerHTML = "<div><pre>" + reason + "</pre></div>";
    } else {
      alert(reason);
    }
  };

  request = (method, url, body?, callback?) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Authorization", "Bearer " + this.config.token);
    xhr.onreadystatechange = (evt) => {
      if (xhr.readyState !== XMLHttpRequest.DONE || xhr.status != 200) return;
      callback(xhr);
    };
    xhr.send(body);
  };
}

addEventListener("load", () => new BasicDashboard());
