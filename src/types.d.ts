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
  attribute?: string | string[];
  name?: string;
  service?: string,
  service_data: {string:string},
  unit_of_measurement?: string;
};
