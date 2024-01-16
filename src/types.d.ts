export type BasicDashboardConfig = {
  base: string;
  token: string;
  refresh?: number;
  floors: {
    [index: string]: BasicDashboardFloor;
  };
};

export type BasicDashboardFloor = BasicDashboardConfigEntity[] | string | null;

export type BasicDashboardConfigEntity = {
  entity_id: string;
  action?: string;
  attribute?: string;
  name?: string;
  unit_of_measurement?: string;
};
