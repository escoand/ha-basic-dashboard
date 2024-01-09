type BasicDashboardConfig = {
  base: string;
  token: string;
  floors: {
    [index: string]: BasicDashboardFloor;
  };
};

type BasicDashboardFloor = BasicDashboardConfigEntity[] | string | null;

type BasicDashboardConfigEntity = {
  entity_id: string;
  action?: string;
  attribute?: string;
  name?: string;
  unit_of_measurement?: string;
};
