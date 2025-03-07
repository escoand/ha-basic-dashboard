import {
  mdiAccount,
  mdiAccountArrowRight,
  mdiAirFilter,
  mdiAirHumidifier,
  mdiAirHumidifierOff,
  mdiAlert,
  mdiAlertCircle,
  mdiAlertDecagramOutline,
  mdiAppleSafari,
  mdiArrowCollapseHorizontal,
  mdiArrowDownBox,
  mdiArrowSplitVertical,
  mdiArrowUpBox,
  mdiAudioVideo,
  mdiAudioVideoOff,
  mdiBattery,
  mdiBatteryAlert,
  mdiBatteryCharging,
  mdiBatteryOutline,
  mdiBell,
  mdiBlindsHorizontal,
  mdiBlindsHorizontalClosed,
  mdiBrightness5,
  mdiBrightness7,
  mdiBullhorn,
  mdiButtonPointer,
  mdiCalendar,
  mdiCalendarClock,
  mdiCast,
  mdiCastConnected,
  mdiCastOff,
  mdiChartSankey,
  mdiChatSleep,
  mdiCheckCircle,
  mdiCheckCircleOutline,
  mdiCheckDecagram,
  mdiCheckNetworkOutline,
  mdiCheckboxMarkedCircle,
  mdiCircle,
  mdiCircleSlice8,
  mdiClipboardList,
  mdiClock,
  mdiCloseCircleOutline,
  mdiCloseNetworkOutline,
  mdiCloudUpload,
  mdiCog,
  mdiCommentAlert,
  mdiCounter,
  mdiCropPortrait,
  mdiCurtains,
  mdiCurtainsClosed,
  mdiDoorClosed,
  mdiDoorOpen,
  mdiFan,
  mdiFanOff,
  mdiFire,
  mdiFlower,
  mdiFormTextbox,
  mdiFormatListBulleted,
  mdiGarage,
  mdiGarageOpen,
  mdiGate,
  mdiGateArrowRight,
  mdiGateOpen,
  mdiGoogleAssistant,
  mdiGoogleCirclesCommunities,
  mdiHome,
  mdiHomeAssistant,
  mdiHomeAutomation,
  mdiHomeOutline,
  mdiImage,
  mdiImageFilterFrames,
  mdiLightbulb,
  mdiLock,
  mdiLockAlert,
  mdiLockClock,
  mdiLockOpen,
  mdiMailbox,
  mdiMapMarkerRadius,
  mdiMeterGas,
  mdiMicrophoneMessage,
  mdiMotionSensor,
  mdiMotionSensorOff,
  mdiMusicNote,
  mdiMusicNoteOff,
  mdiPackage,
  mdiPackageUp,
  mdiPalette,
  mdiPipeValve,
  mdiPlay,
  mdiPowerPlug,
  mdiPowerPlugOff,
  mdiRadioboxBlank,
  mdiRayVertex,
  mdiRemote,
  mdiRobot,
  mdiRobotConfused,
  mdiRobotMower,
  mdiRobotOff,
  mdiRobotVacuum,
  mdiRollerShade,
  mdiRollerShadeClosed,
  mdiScriptText,
  mdiSmokeDetector,
  mdiSmokeDetectorAlert,
  mdiSmokeDetectorVariant,
  mdiSmokeDetectorVariantAlert,
  mdiSnowflake,
  mdiSpeaker,
  mdiSpeakerMessage,
  mdiSpeakerOff,
  mdiSpeakerPause,
  mdiSpeakerPlay,
  mdiSquare,
  mdiSquareOutline,
  mdiStop,
  mdiSwapHorizontal,
  mdiTelevision,
  mdiTelevisionOff,
  mdiTelevisionPause,
  mdiTelevisionPlay,
  mdiThermometer,
  mdiThermostat,
  mdiTimerOutline,
  mdiToggleSwitch,
  mdiToggleSwitchOffOutline,
  mdiVibrate,
  mdiVideo,
  mdiVideoOff,
  mdiWater,
  mdiWaterBoiler,
  mdiWaterBoilerOff,
  mdiWaterOff,
  mdiWeatherNight,
  mdiWeatherPartlyCloudy,
  mdiWhiteBalanceSunny,
  mdiWindowClosed,
  mdiWindowOpen,
  mdiWindowShutter,
  mdiWindowShutterOpen,
} from "@mdi/js";
import { HassEntity } from "home-assistant-js-websocket/dist/types";

export const iconViewbox = "0 0 24 24";

const actionIcons = {
  failure: mdiAlertDecagramOutline,
  success: mdiCheckDecagram,
};

// based on https://github.com/home-assistant/frontend/blob/dev/src/common/entity/domain_icon.ts
const circles = {
  off: mdiCheckCircle,
  on: mdiAlertCircle,
};
const icons = {
  air_quality: mdiAirFilter,
  // alarm_control_panel is specific
  alert: mdiAlert,
  automation: {
    unavailable: mdiRobotConfused,
    off: mdiRobotOff,
    default: mdiRobot,
  },
  battery: { off: mdiBatteryAlert, on: mdiBattery },
  binary_sensor: {
    battery: {
      off: mdiBattery,
      on: mdiBatteryOutline,
    },
    battery_charging: {
      off: mdiBattery,
      on: mdiBatteryCharging,
    },
    carbon_monoxide: {
      off: mdiSmokeDetector,
      on: mdiSmokeDetectorAlert,
    },
    cold: {
      off: mdiThermometer,
      on: mdiSnowflake,
    },
    connectivity: {
      off: mdiCloseNetworkOutline,
      on: mdiCheckNetworkOutline,
    },
    door: {
      off: mdiDoorClosed,
      on: mdiDoorOpen,
    },
    garage_door: {
      off: mdiGarage,
      on: mdiGarageOpen,
    },
    gas: circles,
    heat: {
      off: mdiThermometer,
      on: mdiFire,
    },
    light: {
      off: mdiBrightness5,
      on: mdiBrightness7,
    },
    lock: {
      off: mdiLock,
      on: mdiLockOpen,
    },
    moisture: {
      off: mdiWaterOff,
      on: mdiWater,
    },
    motion: {
      off: mdiMotionSensorOff,
      on: mdiMotionSensor,
    },
    occupancy: {
      off: mdiHomeOutline,
      on: mdiHome,
    },
    opening: {
      off: mdiSquare,
      on: mdiSquareOutline,
    },
    power: {
      off: mdiPowerPlugOff,
      on: mdiPowerPlug,
    },
    problem: circles,
    presence: {
      off: mdiHomeOutline,
      on: mdiHome,
    },
    plug: {
      off: mdiPowerPlugOff,
      on: mdiPowerPlug,
    },
    running: {
      off: mdiStop,
      on: mdiPlay,
    },
    safety: circles,
    smoke: {
      off: mdiSmokeDetectorVariant,
      on: mdiSmokeDetectorVariantAlert,
    },
    sound: {
      off: mdiMusicNoteOff,
      on: mdiMusicNote,
    },
    tamper: circles,
    update: {
      off: mdiPackage,
      on: mdiPackageUp,
    },
    vibration: {
      off: mdiCropPortrait,
      on: mdiVibrate,
    },
    window: {
      off: mdiWindowClosed,
      on: mdiWindowOpen,
    },
    off: mdiRadioboxBlank,
    on: mdiCheckboxMarkedCircle,
  },
  // button is specific
  calendar: mdiCalendar,
  camera: { off: mdiVideoOff, default: mdiVideo },
  climate: mdiThermostat,
  cover: {
    garage: {
      opening: mdiArrowUpBox,
      closing: mdiArrowDownBox,
      closed: mdiGarage,
      default: mdiGarageOpen,
    },
    gate: {
      opening: mdiGateArrowRight,
      closing: mdiGateArrowRight,
      closed: mdiGate,
      default: mdiGateOpen,
    },
    door: { open: mdiDoorOpen, default: mdiDoorClosed },
    damper: { open: mdiCircle, default: mdiCircleSlice8 },
    shutter: {
      opening: mdiArrowUpBox,
      closing: mdiArrowDownBox,
      closed: mdiWindowShutter,
      default: mdiWindowShutterOpen,
    },
    curtain: {
      opening: mdiArrowSplitVertical,
      closing: mdiArrowCollapseHorizontal,
      closed: mdiCurtainsClosed,
      default: mdiCurtains,
    },
    blind: {
      opening: mdiArrowUpBox,
      closing: mdiArrowDownBox,
      closed: mdiBlindsHorizontalClosed,
      default: mdiBlindsHorizontal,
    },
    shade: {
      opening: mdiArrowUpBox,
      closing: mdiArrowDownBox,
      closed: mdiRollerShadeClosed,
      default: mdiRollerShade,
    },
    window: {
      opening: mdiArrowUpBox,
      closing: mdiArrowDownBox,
      closed: mdiWindowClosed,
      default: mdiWindowOpen,
    },
  },
  configurator: mdiCog,
  conversation: mdiMicrophoneMessage,
  counter: mdiCounter,
  datetime: mdiCalendarClock,
  date: mdiCalendar,
  demo: mdiHomeAssistant,
  device_tracker: { not_home: mdiAccountArrowRight, default: mdiAccount },
  // event
  fan: { off: mdiFanOff, default: mdiFan },
  google_assistant: mdiGoogleAssistant,
  group: mdiGoogleCirclesCommunities,
  homeassistant: mdiHomeAssistant,
  homekit: mdiHomeAutomation,
  humidifier: { off: mdiAirHumidifierOff, default: mdiAirHumidifier },
  image: mdiImage,
  image_processing: mdiImageFilterFrames,
  input_boolean: { on: mdiCheckCircleOutline, default: mdiCloseCircleOutline },
  input_button: mdiButtonPointer,
  // input_datetime is specific
  input_datetime: mdiCalendarClock,
  input_number: mdiRayVertex,
  input_select: mdiFormatListBulleted,
  input_text: mdiFormTextbox,
  lawn_mower: mdiRobotMower,
  light: mdiLightbulb,
  lock: {
    unlocked: mdiLockOpen,
    jammed: mdiLockAlert,
    locking: mdiLockClock,
    unlocking: mdiLockClock,
    default: mdiLock,
  },
  mailbox: mdiMailbox,
  media_player: {
    speaker: {
      playing: mdiSpeakerPlay,
      paused: mdiSpeakerPause,
      off: mdiSpeakerOff,
      default: mdiSpeaker,
    },
    tv: {
      playing: mdiTelevisionPlay,
      paused: mdiTelevisionPause,
      off: mdiTelevisionOff,
      default: mdiTelevision,
    },
    receiver: {
      off: mdiAudioVideoOff,
      default: mdiAudioVideo,
    },
    default: {
      playing: mdiCastConnected,
      paused: mdiCastConnected,
      off: mdiCastOff,
      default: mdiCast,
    },
  },
  notify: mdiCommentAlert,
  // number is specific
  number: mdiRayVertex,
  persistent_notification: mdiBell,
  person: { not_home: mdiAccountArrowRight, default: mdiAccount },
  plant: mdiFlower,
  proximity: mdiAppleSafari,
  remote: mdiRemote,
  scene: mdiPalette,
  schedule: mdiCalendarClock,
  script: mdiScriptText,
  select: mdiFormatListBulleted,
  // sensor is specific
  // sensor: mdiEye,
  simple_alarm: mdiBell,
  siren: mdiBullhorn,
  stt: mdiMicrophoneMessage,
  sun: { above_horizon: mdiWhiteBalanceSunny, default: mdiWeatherNight },
  switch: {
    outlet: { on: mdiPowerPlug, default: mdiPowerPlugOff },
    //switch: { on: mdiToggleSwitchVariant, default: mdiToggleSwitchVariantOff },
    //default: mdiToggleSwitchVariant,
    switch: { on: mdiToggleSwitch, default: mdiToggleSwitchOffOutline },
    on: mdiToggleSwitch,
    default: mdiToggleSwitchOffOutline,
  },
  switch_as_x: mdiSwapHorizontal,
  text: mdiFormTextbox,
  threshold: mdiChartSankey,
  todo: mdiClipboardList,
  time: mdiClock,
  timer: mdiTimerOutline,
  tts: mdiSpeakerMessage,
  updater: mdiCloudUpload,
  update: { on: mdiPackageUp, default: mdiPackage },
  vacuum: mdiRobotVacuum,
  valve: { water: mdiPipeValve, gas: mdiMeterGas, default: mdiPipeValve },
  wake_word: mdiChatSleep,
  water_heater: { off: mdiWaterBoilerOff, default: mdiWaterBoiler },
  // weather is specific
  weather: mdiWeatherPartlyCloudy,
  zone: mdiMapMarkerRadius,
};

const isString = (value) =>
  typeof value === "string" || value instanceof String;
const isNumber = (value) => !isNaN(parseFloat(value)) && isFinite(value);

const getIconInner = (icons, state: string) =>
  !isNumber(state) &&
  ((icons?.hasOwnProperty(state) && icons[state]) ||
    (icons?.default?.hasOwnProperty(state) && icons.default[state]) ||
    icons?.default);

export const getActionIcon = (action: string) => actionIcons[action];

export const getEntityIcon = (entity: HassEntity): string => {
  const domain = entity.entity_id.split(".")[0];

  return (
    // device_class based
    (entity.attributes.device_class &&
      getIconInner(
        icons[domain]?.[entity.attributes.device_class],
        entity.state
      )) ||
    getIconInner(icons[domain]?.default, entity.state) ||
    // state based
    getIconInner(icons[domain], entity.state) ||
    // domain based
    (isString(icons[domain]) && icons[domain])
  );
};
