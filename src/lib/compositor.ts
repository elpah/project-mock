import { MOCKUP_MAP } from "./catalog";
import { drawDeskAccessories, drawDevice, measureDevice, roundedRect } from "./devices";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  EXPORT_PIXEL_RATIO,
  type MockupPreset,
  type MockupSettings,
  type ShotList,
} from "./types";

export { CANVAS_HEIGHT, CANVAS_WIDTH, EXPORT_PIXEL_RATIO };

export type LayerLayout = {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

function drawEnvironment(
  ctx: CanvasRenderingContext2D,
  preset: MockupPreset,
  background: string,
) {
  if (
    preset.environment === "gradient" ||
    preset.environment === "studio-light"
  ) {
    const g = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    g.addColorStop(0, "#EEF2FF");
    g.addColorStop(0.5, background);
    g.addColorStop(1, "#F8FAFC");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    return;
  }

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (preset.environment === "studio-dark" || preset.environment === "desk-dark") {
    const v = ctx.createRadialGradient(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT * 0.4,
      80,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT * 0.45,
      900,
    );
    v.addColorStop(0, "rgba(255,255,255,0.04)");
    v.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  if (preset.environment === "desk" || preset.environment === "desk-dark") {
    const y = 690;
    const g = ctx.createLinearGradient(0, y, 0, CANVAS_HEIGHT);
    if (preset.environment === "desk-dark") {
      g.addColorStop(0, "#2A2A2E");
      g.addColorStop(1, "#1A1A1C");
    } else {
      g.addColorStop(0, "#D8D2C8");
      g.addColorStop(1, "#C4BDB2");
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, y, CANVAS_WIDTH, CANVAS_HEIGHT - y);
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, y, CANVAS_WIDTH, 3);
  }
}

export function getLayerLayouts(
  preset: MockupPreset,
  settings: MockupSettings,
): LayerLayout[] {
  return settings.devices.map((device, index) => {
    const slot = preset.devices[index];
    if (!slot) {
      return { index, x: device.x, y: device.y, width: 0, height: 0, rotation: device.rotation };
    }
    const width = slot.width * device.scale;
    const size = measureDevice(slot.type, width);
    return {
      index,
      x: device.x,
      y: device.y,
      width: size.w,
      height: size.h,
      rotation: device.rotation,
    };
  });
}

export function renderMockup(
  ctx: CanvasRenderingContext2D,
  options: {
    presetId: string;
    settings: MockupSettings;
    shots: ShotList;
    selected?: number | null;
    pixelRatio?: number;
  },
) {
  const preset = MOCKUP_MAP[options.presetId];
  if (!preset) return;
  const ratio = Math.max(1, options.pixelRatio ?? 1);
  const dark =
    preset.environment === "studio-dark" || preset.environment === "desk-dark";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, CANVAS_WIDTH * ratio, CANVAS_HEIGHT * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  drawEnvironment(ctx, preset, options.settings.background);

  const layouts = getLayerLayouts(preset, options.settings);

  for (const index of options.settings.deviceOrder) {
    const slot = preset.devices[index];
    const device = options.settings.devices[index];
    const layout = layouts[index];
    if (!slot || !device || !layout) continue;
    const first = options.shots.find((shot) => shot)?.element ?? null;
    const image = options.shots[slot.shot]?.element ?? first;
    const width = slot.width * device.scale;

    ctx.save();
    ctx.translate(layout.x + layout.width / 2, layout.y + layout.height / 2);
    ctx.rotate((device.rotation * Math.PI) / 180);
    if (slot.skew) {
      ctx.transform(1, 0, Math.tan((slot.skew * Math.PI) / 180), 1, 0, 0);
    }
    ctx.translate(-layout.width / 2, -layout.height / 2);
    ctx.globalAlpha = 1;
    drawDevice(
      ctx,
      slot.type,
      width,
      image,
      ratio,
      dark,
      device.shadowIntensity,
    );
    if (options.selected === index) {
      ctx.strokeStyle = dark
        ? "rgba(255,255,255,0.92)"
        : "rgba(17,17,17,0.9)";
      ctx.lineWidth = 2.5;
      roundedRect(ctx, 0, 0, layout.width, layout.height, 12);
      ctx.stroke();
    }
    ctx.restore();
  }

  const primary = preset.devices[0]?.type;
  if (
    (preset.environment === "desk" || preset.environment === "desk-dark") &&
    (primary === "imac" || primary === "monitor")
  ) {
    drawDeskAccessories(ctx, dark);
  }
}

export function hitTestLayer(px: number, py: number, layout: LayerLayout) {
  const cx = layout.x + layout.width / 2;
  const cy = layout.y + layout.height / 2;
  const angle = (-layout.rotation * Math.PI) / 180;
  const dx = px - cx;
  const dy = py - cy;
  const lx = dx * Math.cos(angle) - dy * Math.sin(angle);
  const ly = dx * Math.sin(angle) + dy * Math.cos(angle);
  return Math.abs(lx) <= layout.width / 2 && Math.abs(ly) <= layout.height / 2;
}

export function pickLayer(
  px: number,
  py: number,
  layouts: LayerLayout[],
  order: number[],
) {
  for (let i = order.length - 1; i >= 0; i -= 1) {
    const layout = layouts[order[i]];
    if (layout && hitTestLayer(px, py, layout)) return layout.index;
  }
  return null;
}

export type ExportFormat = "png" | "jpeg" | "webp";

const EXPORT_FORMATS: Record<
  ExportFormat,
  { type: string; quality: number; extension: "png" | "jpg" | "webp" }
> = {
  png: { type: "image/png", quality: 1, extension: "png" },
  jpeg: { type: "image/jpeg", quality: 0.95, extension: "jpg" },
  webp: { type: "image/webp", quality: 0.8, extension: "webp" },
};

function encodeCanvas(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

export async function exportMockup(options: {
  presetId: string;
  settings: MockupSettings;
  shots: ShotList;
  format?: ExportFormat;
}) {
  const format = options.format ?? "png";
  const spec = EXPORT_FORMATS[format];
  const ratio = EXPORT_PIXEL_RATIO;
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH * ratio;
  canvas.height = CANVAS_HEIGHT * ratio;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Could not create export canvas.");
  renderMockup(ctx, { ...options, selected: null, pixelRatio: ratio });

  const blob = await encodeCanvas(canvas, spec.type, spec.quality);
  if (blob && blob.size > 0 && (!blob.type || blob.type === spec.type)) {
    return { blob, extension: spec.extension };
  }
  throw new Error(
    `Could not export as ${format.toUpperCase()}. Try PNG or JPEG.`,
  );
}
