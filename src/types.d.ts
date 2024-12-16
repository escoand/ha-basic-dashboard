// config
export type BasicDashboardConfig = {
  base: string;
  token: string;
  refresh?: number;
  floors: {
    [index: string]: BasicDashboardFloor;
  };
};

export type BasicDashboardFloor = BasicDashboardConfigEntry[] | string | null;

export type BasicDashboardConfigEntry =
  | BasicDashboardConfigEntity
  | BasicDashboardConfigAction;

export type BasicDashboardConfigEntity = {
  entity_id: string;
  attribute?: string | string[];
  name?: string;
  service?: string;
  service_data: { string: string };
  unit_of_measurement?: string;
};

export type BasicDashboardConfigAction = {
  action: string;
  chart?: BasicDashboardChart;
  name?: string;
};

// charts config
export type BasicDashboardChart = {
  data: BasicDashboardChartEntry[];
  height?: number;
  ticks?: number;
  now?: boolean;
  width?: number;
};

export type BasicDashboardChartEntry = {
  data: string[];
  factor?: number;
  stepline?: boolean;
  x: string;
  y: string;
};

// element
export interface BasicDashboardElement {
  refresh(): void;
  update({}): void;
  render(): void;
}
