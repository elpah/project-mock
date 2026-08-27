export const CANVAS_WIDTH = 1600;
export const CANVAS_HEIGHT = 1000;
export const EXPORT_PIXEL_RATIO = 2;
export const PHONE_ASPECT = 9 / 19.5;
export const TABLET_PORTRAIT_ASPECT = 3 / 4;
export const TABLET_LANDSCAPE_ASPECT = 4 / 3;
export const DISPLAY_ASPECT = 16 / 10;

export type CategoryId =
  | "all"
  | "browsers"
  | "laptops"
  | "desktops"
  | "phones"
  | "tablets"
  | "combos"
  | "creative"
  | "mobile";

export type DeviceType =
  | "screen"
  | "browser-chrome"
  | "browser-safari"
  | "browser-minimal"
  | "laptop"
  | "macbook"
  | "macbook-pro"
  | "macbook-air"
  | "imac"
  | "monitor"
  | "iphone"
  | "android"
  | "tablet-portrait"
  | "tablet-landscape";

export type Environment =
  | "studio-light"
  | "studio-dark"
  | "gray"
  | "white"
  | "apple"
  | "editorial"
  | "gradient"
  | "desk"
  | "desk-dark";

export type UploadedImage = {
  file: File;
  url: string;
  element: HTMLImageElement;
  width: number;
  height: number;
};

export type DeviceSlot = {
  type: DeviceType;
  shot: 0 | 1 | 2;
  x: number;
  y: number;
  width: number;
  rotation: number;
  shadow: number;
  skew?: number;
};

export type DeviceSettings = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  shadowIntensity: number;
};

export type MockupPreset = {
  id: string;
  name: string;
  description: string;
  category: Exclude<CategoryId, "all">;
  environment: Environment;
  background: string;
  devices: DeviceSlot[];
};

export type MockupSettings = {
  background: string;
  deviceOrder: number[];
  devices: DeviceSettings[];
};

export type AppStep = "style" | "upload" | "editor";

export type ShotList = Array<UploadedImage | null | undefined>;
