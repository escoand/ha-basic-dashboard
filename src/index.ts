import { BasicDashboard } from "./dashboard";

const errorTimeout = 10 * 1000;

// catch errors
console.error = (reason: ErrorEvent | string) => {
  const msg = (reason as ErrorEvent).message || (reason as string);
  const container = document.getElementById("message");
  if (container) {
    const elem = container.appendChild(document.createElement("pre"));
    elem.appendChild(document.createTextNode(msg));
    setTimeout(() => elem.parentElement?.removeChild(elem), errorTimeout);
  } else {
    alert(msg);
  }
};
addEventListener("error", console.error);

// load app
addEventListener("load", () => new BasicDashboard());
