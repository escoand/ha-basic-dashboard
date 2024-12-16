// config
export type BasicDashboardConfig = {
  base: string;
  floors: {
    [index: string]: BasicDashboardFloor;
  };
  locale?: Intl.LocalesArgument;
  refresh?: number;
  token: string;
};

export type BasicDashboardFloor = BasicDashboardConfigEntry[] | string | null;

export type BasicDashboardConfigEntry =
  | BasicDashboardConfigAction
  | BasicDashboardConfigEntity
  | BasicDashboardConfigHistory;

export type BasicDashboardConfigEntity = {
  entity_id: string;
  attribute?: string | string[];
  name?: string;
  service?: string;
  service_data: {};
  unit_of_measurement?: string;
};

export type BasicDashboardConfigChartElement = {
  chart: BasicDashboardConfigChartFull;
  name?: string;
};

export type BasicDashboardConfigHistory = BasicDashboardConfigChartElement & {
  chart: BasicDashboardConfigChartBase;
  entities: (string | BasicDashboardConfigHistoryEntity)[];
};
export type BasicDashboardConfigHistoryEntity = {
  attribute?: string;
  entity_id: string;
};

export type BasicDashboardConfigAction = BasicDashboardConfigChartElement & {
  action: string;
  action_data?: {};
};

// charts config
export type BasicDashboardConfigChartBase = {
  datetime_format?: Intl.DateTimeFormatOptions;
  height?: number;
  ticks?: number;
  width?: number;
};

export type BasicDashboardConfigChartFull = BasicDashboardConfigChartBase & {
  data: BasicDashboardChartConfigEntry[];
  now?: boolean;
};

export type BasicDashboardChartConfigEntry = {
  data?: string[];
  factor?: number;
  stepline?: boolean;
  x: string | string[];
  y: string | string[];
};

// element
export interface BasicDashboardElement {
  refresh(): void;
  update({}): void;
  render(): void;
}
