// config
export type BasicDashboardConfig = {
  /**
   * URL to Home Assistant
   * @default URL of HTTP server
   */
  base: string;
  /**
   * list of floors or tabs
   */
  floors: {
    /**
     * name of the floor or tab
     */
    [index: string]: BasicDashboardFloor;
  };
  locale?: Intl.LocalesArgument;
  /**
   * time in milliseconds for refreshing the entitites
   * @type integer
   * @default 1min
   */
  refresh?: number;
  /**
   * long living access token from user settings
   */
  token: string;
};

/**
 * array of elements to show
 */
export type BasicDashboardFloor = BasicDashboardConfigEntry[] | string | null;

export type BasicDashboardConfigEntry =
  | BasicDashboardConfigAction
  | BasicDashboardConfigEntity
  | BasicDashboardConfigHistory;

export type BasicDashboardConfigEntity = {
  /**
   * entity_id of the respective entity
   */
  entity_id: string;
  /**
   * attribute to show
   * @default state of entity
   */
  attribute?: string | string[];
  /**
   * name to show
   * @default name in Home Assistant
   */
  name?: string;
  /**
   * service to call on click
   */
  service?: string;
  /**
   * data to pass to service call
   */
  service_data: {};
  /**
   * unit of measurement
   */
  unit_of_measurement?: string;
};

export type BasicDashboardConfigChartElement = {
  chart: BasicDashboardConfigChartFull;
  /**
   * name to show
   */
  name?: string;
};

export type BasicDashboardConfigHistory = BasicDashboardConfigChartElement & {
  chart: BasicDashboardConfigChartBase;
  /**
   * entities to show
   */
  entities: (string | BasicDashboardConfigHistoryEntity)[];
};

export type BasicDashboardConfigHistoryEntity = {
  /**
   * attribute to show
   * @default state of entity
   */
  attribute?: string;
  /**
   * entity_id of the entity
   */
  entity_id: string;
};

/**
 * element for an action's response chart
 */
export type BasicDashboardConfigAction = BasicDashboardConfigChartElement & {
  /**
   * action to call
   */
  action: string;
  /**
   * data to pass to the action
   */
  action_data?: {};
};

/**
 * element for an entity's history chart
 */
export type BasicDashboardConfigChartBase = {
  /**
   * format of the x-axis
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#date-time_component_options
   */
  datetime_format?: Intl.DateTimeFormatOptions;
  /**
   * height of the chart in px
   */
  height?: number;
  /**
   * number of y-axis ticks
   * @default 3
   */
  ticks?: number;
  /**
   * width of the chart in px
   */
  width?: number;
};

/**
 * chart configuration
 */
export type BasicDashboardConfigChartFull = BasicDashboardConfigChartBase & {
  data: BasicDashboardChartConfigEntry[];
  /**
   * show an indicator for the current time
   * @default false
   */
  now?: boolean;
};

export type BasicDashboardChartConfigEntry = {
  /**
   * path in the action response to the data
   * the path should point to an array of data
   */
  data?: string[];
  /**
   * multiply the value with
   */
  factor?: number;
  /**
   * show the graph as stepline, like Home Assistant
   * @default false
   */
  stepline?: boolean;
  /**
   * path to the data of the x-axis
   */
  x: string | string[];
  /**
   * path to the data of the y-axis
   */
  y: string | string[];
};

// element
export interface BasicDashboardElement {
  refresh(): void;
  update({}): void;
  render(): void;
}
