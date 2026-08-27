import { MOCKUP_MAP, settingsFromPreset } from "./catalog";
import type { MockupSettings } from "./types";

export function settingsForStyle(id: string): MockupSettings {
  const preset = MOCKUP_MAP[id];
  if (!preset) {
    return { background: "#E9EDF1", deviceOrder: [], devices: [] };
  }
  return settingsFromPreset(preset);
}
