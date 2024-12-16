import "./polyfill";

import { BasicDashboard } from "./dashboard";
import { errorHandler, errorWrapper } from "./errors";

addEventListener("error", errorHandler);
addEventListener(
  "load",
  errorWrapper(() => new BasicDashboard())
);
