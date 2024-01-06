declare module "*.svg" {
  const content: string;
  export default content;
}

type BasicDashboardConfig = {
  token?: string;
  floors?: {
    [index: string]: string[];
  };
};
declare module "BasicDashboardConfig" {
  export default BasicDashboardConfig;
}

type HomeAssistantStates = {
  entity_id: string;
  state: string;
  attributes: {
    editable: boolean;
    id: string;
    latitude: number;
    longitude: number;
    gps_accuracy: number;
    source: string;
    user_id: string;
    device_trackers: [string];
    icon: string;
    friendly_name: string;
  };
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    parent_id: string | null;
    user_id: string | null;
  };
}[];

declare module "HomeAssistantStates" {
  export default HomeAssistantStates;
}
