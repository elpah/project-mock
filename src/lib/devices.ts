import {
  CANVAS_WIDTH,
  DISPLAY_ASPECT,
  PHONE_ASPECT,
  TABLET_LANDSCAPE_ASPECT,
  TABLET_PORTRAIT_ASPECT,
  type DeviceType,
} from "./types";

export function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export type LaptopKind = "laptop" | "macbook" | "macbook-pro" | "macbook-air";

export function isLaptopType(type: DeviceType): type is LaptopKind {
  return (
    type === "laptop" ||
    type === "macbook" ||
    type === "macbook-pro" ||
    type === "macbook-air"
  );
}

export function laptopGeometry(type: LaptopKind, width: number) {
  const air = type === "macbook-air";
  const pro = type === "macbook-pro";
  const generic = type === "laptop";
  const bezel = air
    ? width * 0.016
    : pro
      ? width * 0.024
      : generic
        ? width * 0.03
        : width * 0.02;
  const top = bezel;
  const chin = air
    ? width * 0.03
    : pro
      ? width * 0.042
      : generic
        ? width * 0.048
        : width * 0.034;
  const screenW = width - bezel * 2;
  const screenH = screenW / DISPLAY_ASPECT;
  const lidH = top + screenH + chin;
  const deck = air ? width * 0.34 : generic ? width * 0.4 : width * 0.36;
  const flare = generic ? width * 0.075 : width * 0.058;
  return {
    bezel,
    top,
    chin,
    screenW,
    screenH,
    lidH,
    deck,
    flare,
    w: width + flare * 2,
    h: lidH + deck,
    offsetX: flare,
  };
}

export function measureDevice(type: DeviceType, width: number) {
  switch (type) {
    case "screen":
      return { w: width, h: width / DISPLAY_ASPECT };
    case "browser-chrome":
      return { w: width, h: 52 + (width - 4) / DISPLAY_ASPECT };
    case "browser-safari":
      return { w: width, h: 64 + (width - 4) / DISPLAY_ASPECT };
    case "browser-minimal":
      return { w: width, h: 36 + (width - 4) / DISPLAY_ASPECT };
    case "laptop":
    case "macbook":
    case "macbook-pro":
    case "macbook-air": {
      const size = laptopGeometry(type, width);
      return { w: size.w, h: size.h };
    }
    case "imac": {
      const screenH = (width - 16) / DISPLAY_ASPECT + 54;
      return { w: width, h: screenH + 86 };
    }
    case "monitor": {
      const screenH = (width - 14) / DISPLAY_ASPECT + 18;
      return { w: width, h: screenH + 78 };
    }
    case "iphone":
    case "android":
      return { w: width, h: width / PHONE_ASPECT };
    case "tablet-portrait":
      return { w: width, h: width / TABLET_PORTRAIT_ASPECT };
    case "tablet-landscape":
      return { w: width, h: width / TABLET_LANDSCAPE_ASPECT };
  }
}

export function screenRect(type: DeviceType, width: number) {
  switch (type) {
    case "screen": {
      const { h } = measureDevice(type, width);
      return { x: 0, y: 0, w: width, h, r: 18 };
    }
    case "browser-chrome":
      return { x: 2, y: 52, w: width - 4, h: (width - 4) / DISPLAY_ASPECT, r: 0 };
    case "browser-safari":
      return { x: 2, y: 64, w: width - 4, h: (width - 4) / DISPLAY_ASPECT, r: 0 };
    case "browser-minimal":
      return { x: 2, y: 36, w: width - 4, h: (width - 4) / DISPLAY_ASPECT, r: 2 };
    case "laptop":
    case "macbook":
    case "macbook-pro":
    case "macbook-air": {
      const geo = laptopGeometry(type, width);
      return {
        x: geo.offsetX + geo.bezel,
        y: geo.top,
        w: geo.screenW,
        h: geo.screenH,
        r: Math.max(3, width * 0.006),
      };
    }
    case "imac": {
      const inset = 8;
      const screenW = width - inset * 2;
      const screenH = screenW / DISPLAY_ASPECT;
      return { x: inset, y: inset, w: screenW, h: screenH, r: 4 };
    }
    case "monitor": {
      const inset = 7;
      const screenW = width - inset * 2;
      const screenH = screenW / DISPLAY_ASPECT;
      return { x: inset, y: inset, w: screenW, h: screenH, r: 3 };
    }
    case "iphone": {
      const bezel = width * 0.042;
      return {
        x: bezel,
        y: bezel,
        w: width - bezel * 2,
        h: width / PHONE_ASPECT - bezel * 2,
        r: width * 0.12,
      };
    }
    case "android": {
      const bezel = width * 0.036;
      return {
        x: bezel,
        y: bezel,
        w: width - bezel * 2,
        h: width / PHONE_ASPECT - bezel * 2,
        r: width * 0.08,
      };
    }
    case "tablet-portrait": {
      const bezel = width * 0.04;
      return {
        x: bezel,
        y: bezel,
        w: width - bezel * 2,
        h: width / TABLET_PORTRAIT_ASPECT - bezel * 2,
        r: 10,
      };
    }
    case "tablet-landscape": {
      const bezel = width * 0.028;
      return {
        x: bezel,
        y: bezel,
        w: width - bezel * 2,
        h: width / TABLET_LANDSCAPE_ASPECT - bezel * 2,
        r: 10,
      };
    }
  }
}

function trafficLights(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const colors = ["#FF5F57", "#FEBC2E", "#28C840"];
  colors.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(x + i * 14, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });
}

function drawCoverTop(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dw: number,
  dh: number,
) {
  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;
  const targetAspect = dw / dh;
  let sx = 0;
  let sw = srcW;
  let sh = srcH;
  if (srcW / srcH < targetAspect) sh = srcW / targetAspect;
  else {
    sw = srcH * targetAspect;
    sx = (srcW - sw) / 2;
  }
  ctx.imageSmoothingEnabled = sw < dw || sh < dh ? false : true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, 0, sw, sh, 0, 0, dw, dh);
}

function clippedScreen(
  img: HTMLImageElement | null,
  w: number,
  h: number,
  r: number,
  pixelRatio: number,
) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w * pixelRatio));
  canvas.height = Math.max(1, Math.round(h * pixelRatio));
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  roundedRect(ctx, 0, 0, canvas.width, canvas.height, r * pixelRatio);
  ctx.clip();
  if (img) drawCoverTop(ctx, img, canvas.width, canvas.height);
  else {
    ctx.fillStyle = "#D7DCE2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  return canvas;
}

function paintScreen(
  ctx: CanvasRenderingContext2D,
  shot: HTMLCanvasElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(shot, x, y, w, h);
  ctx.restore();
}

function shadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  intensity: number,
) {
  ctx.save();
  ctx.shadowColor = `rgba(15, 23, 42, ${0.16 * intensity})`;
  ctx.shadowBlur = 48 * intensity;
  ctx.shadowOffsetX = 4 * intensity;
  ctx.shadowOffsetY = 26 * intensity;
  roundedRect(ctx, x, y, w, h, r);
  ctx.fillStyle = "rgba(15,23,42,0.04)";
  ctx.fill();
  ctx.shadowColor = `rgba(0,0,0,${0.14 * intensity})`;
  ctx.shadowBlur = 22 * intensity;
  ctx.shadowOffsetY = 12 * intensity;
  ctx.fill();
  ctx.restore();
}

function drawBrowser(
  ctx: CanvasRenderingContext2D,
  type: "browser-chrome" | "browser-safari" | "browser-minimal",
  width: number,
  image: HTMLImageElement | null,
  pixelRatio: number,
  dark: boolean,
  intensity: number,
) {
  const { h } = measureDevice(type, width);
  const screen = screenRect(type, width);
  const radius = type === "browser-minimal" ? 14 : 12;
  const bar = dark ? "#2A2A2E" : type === "browser-safari" ? "#E8E8ED" : "#F1F3F4";
  const win = dark ? "#1C1C1F" : "#FFFFFF";

  shadow(ctx, 0, 0, width, h, radius, intensity);
  roundedRect(ctx, 0, 0, width, h, radius);
  ctx.fillStyle = win;
  ctx.fill();
  ctx.fillStyle = bar;
  ctx.fillRect(0, 0, width, screen.y);
  trafficLights(ctx, 18, type === "browser-safari" ? 18 : 16);

  if (type === "browser-chrome") {
    roundedRect(ctx, 78, 8, 160, 28, 8);
    ctx.fillStyle = dark ? "#1C1C1F" : "#FFFFFF";
    ctx.fill();
    roundedRect(ctx, 250, 12, width - 280, 22, 11);
    ctx.fillStyle = dark ? "#3A3A40" : "#FFFFFF";
    ctx.fill();
  }
  if (type === "browser-safari") {
    roundedRect(ctx, width / 2 - 160, 32, 320, 24, 12);
    ctx.fillStyle = dark ? "#3A3A40" : "#FFFFFF";
    ctx.fill();
  }
  if (type === "browser-minimal") {
    roundedRect(ctx, 78, 10, width - 120, 16, 8);
    ctx.fillStyle = dark ? "#3A3A40" : "#FFFFFF";
    ctx.fill();
  }

  const shot = clippedScreen(image, screen.w, screen.h, screen.r, pixelRatio);
  paintScreen(ctx, shot, screen.x, screen.y, screen.w, screen.h);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function laptopPalette(type: LaptopKind) {
  if (type === "macbook-air") {
    return {
      metal: "#DCDCE1",
      metalDark: "#C4C4CA",
      bezel: "#141416",
      keys: "#E8E8EE",
      well: "#C8C8D0",
      pad: "#D2D2D8",
      hinge: "#B8B8BE",
    };
  }
  if (type === "macbook-pro") {
    return {
      metal: "#A8A8AE",
      metalDark: "#8E8E94",
      bezel: "#0C0C0E",
      keys: "#3A3A40",
      well: "#6E6E74",
      pad: "#7A7A80",
      hinge: "#7A7A80",
    };
  }
  if (type === "laptop") {
    return {
      metal: "#B4B8C0",
      metalDark: "#8F949C",
      bezel: "#1A1C20",
      keys: "#2E3238",
      well: "#7A8088",
      pad: "#9AA0A8",
      hinge: "#6A7078",
    };
  }
  return {
    metal: "#C9C9CE",
    metalDark: "#B0B0B6",
    bezel: "#161618",
    keys: "#E4E4EA",
    well: "#B8B8C0",
    pad: "#C4C4CA",
    hinge: "#A8A8AE",
  };
}

function drawLaptop(
  ctx: CanvasRenderingContext2D,
  type: LaptopKind,
  width: number,
  image: HTMLImageElement | null,
  pixelRatio: number,
  intensity: number,
) {
  const geo = laptopGeometry(type, width);
    const pal = laptopPalette(type);
  const { offsetX, lidH, deck, w, h, bezel, top, screenW, screenH, chin } =
    geo;
  const hingeY = lidH - 3;
  const frontY = h;

  ctx.save();
  ctx.shadowColor = `rgba(15, 23, 42, ${0.22 * intensity})`;
  ctx.shadowBlur = 42 * intensity;
  ctx.shadowOffsetY = 28 * intensity;
  ctx.beginPath();
  ctx.ellipse(w / 2, h - 8, w * 0.42, deck * 0.16, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(15,23,42,0.18)";
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.moveTo(offsetX + 8, hingeY);
  ctx.lineTo(offsetX + width - 8, hingeY);
  ctx.lineTo(w - 6, frontY - 10);
  ctx.quadraticCurveTo(w / 2, frontY + 8, 6, frontY - 10);
  ctx.closePath();
  const deckGrad = ctx.createLinearGradient(0, hingeY, 0, frontY);
  deckGrad.addColorStop(0, pal.metalDark);
  deckGrad.addColorStop(0.35, pal.metal);
  deckGrad.addColorStop(1, pal.metalDark);
  ctx.fillStyle = deckGrad;
  ctx.fill();

  const wellTop = 0.12;
  const wellBot = 0.62;
  const wellSide = 0.07;
  const wellLeft0 = lerp(offsetX, 0, wellTop) + width * wellSide;
  const wellRight0 = lerp(offsetX + width, w, wellTop) - width * wellSide;
  const wellLeft1 = lerp(offsetX, 0, wellBot) + width * wellSide * 1.15;
  const wellRight1 = lerp(offsetX + width, w, wellBot) - width * wellSide * 1.15;
  const wellY0 = hingeY + deck * wellTop;
  const wellY1 = hingeY + deck * wellBot;
  ctx.beginPath();
  ctx.moveTo(wellLeft0, wellY0);
  ctx.lineTo(wellRight0, wellY0);
  ctx.lineTo(wellRight1, wellY1);
  ctx.lineTo(wellLeft1, wellY1);
  ctx.closePath();
  ctx.fillStyle = pal.well;
  ctx.fill();

  const rows = 5;
  const cols = 14;
  for (let row = 0; row < rows; row += 1) {
    const v0 = wellTop + (row / rows) * (wellBot - wellTop);
    const v1 = wellTop + ((row + 0.78) / rows) * (wellBot - wellTop);
    const count = row === rows - 1 ? 5 : cols;
    for (let col = 0; col < count; col += 1) {
      const gap = 0.012;
      let u0: number;
      let u1: number;
      if (row === rows - 1) {
        const widths = [0.12, 0.1, 0.46, 0.1, 0.12];
        let start = 0.04;
        for (let i = 0; i < col; i += 1) start += widths[i] + 0.02;
        u0 = start;
        u1 = start + widths[col];
      } else {
        const usable = 1 - gap * (cols + 1);
        u0 = gap + (col / cols) * usable + col * gap;
        u1 = u0 + usable / cols;
      }
      const l0 = lerp(wellLeft0, wellLeft1, (v0 - wellTop) / (wellBot - wellTop));
      const r0 = lerp(wellRight0, wellRight1, (v0 - wellTop) / (wellBot - wellTop));
      const l1 = lerp(wellLeft0, wellLeft1, (v1 - wellTop) / (wellBot - wellTop));
      const r1 = lerp(wellRight0, wellRight1, (v1 - wellTop) / (wellBot - wellTop));
      const x00 = lerp(l0, r0, u0);
      const x01 = lerp(l0, r0, u1);
      const x10 = lerp(l1, r1, u0);
      const x11 = lerp(l1, r1, u1);
      const y0 = hingeY + deck * v0;
      const y1 = hingeY + deck * v1;
      ctx.beginPath();
      ctx.moveTo(x00, y0);
      ctx.lineTo(x01, y0);
      ctx.lineTo(x11, y1);
      ctx.lineTo(x10, y1);
      ctx.closePath();
      ctx.fillStyle = pal.keys;
      ctx.fill();
    }
  }

  const padTop = 0.7;
  const padBot = 0.9;
  const padW = 0.22;
  const pl0 = lerp(offsetX, 0, padTop) + (lerp(width, w, padTop) - width * padW) / 2;
  const pr0 = pl0 + lerp(width, w, padTop) * padW;
  const pl1 = lerp(offsetX, 0, padBot) + (lerp(width, w, padBot) - width * padW) / 2;
  const pr1 = pl1 + lerp(width, w, padBot) * padW;
  ctx.beginPath();
  ctx.moveTo(pl0, hingeY + deck * padTop);
  ctx.lineTo(pr0, hingeY + deck * padTop);
  ctx.lineTo(pr1, hingeY + deck * padBot);
  ctx.lineTo(pl1, hingeY + deck * padBot);
  ctx.closePath();
  ctx.fillStyle = pal.pad;
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();

  roundedRect(ctx, offsetX + width * 0.08, hingeY - 5, width * 0.84, 12, 5);
  ctx.fillStyle = pal.hinge;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(offsetX + width * 0.08, hingeY + 1, 7, 8, 0, 0, Math.PI * 2);
  ctx.ellipse(offsetX + width * 0.92, hingeY + 1, 7, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  const lidR = type === "macbook-air" ? 16 : 14;
  shadow(ctx, offsetX, 0, width, lidH, lidR, intensity * 0.55);
  roundedRect(ctx, offsetX, 0, width, lidH, lidR);
  const lidGrad = ctx.createLinearGradient(offsetX, 0, offsetX + width, 0);
  lidGrad.addColorStop(0, pal.metalDark);
  lidGrad.addColorStop(0.45, pal.metal);
  lidGrad.addColorStop(1, pal.metalDark);
  ctx.fillStyle = lidGrad;
  ctx.fill();

  roundedRect(
    ctx,
    offsetX + 4,
    4,
    width - 8,
    lidH - chin * 0.35,
    lidR - 4,
  );
  ctx.fillStyle = pal.bezel;
  ctx.fill();

  const shot = clippedScreen(image, screenW, screenH, Math.max(3, width * 0.006), pixelRatio);
  paintScreen(ctx, shot, offsetX + bezel, top, screenW, screenH);

  ctx.beginPath();
  ctx.arc(offsetX + width / 2, Math.max(7, top * 0.55), Math.max(2.2, width * 0.0045), 0, Math.PI * 2);
  ctx.fillStyle = "#2A2A2E";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(offsetX + width / 2, Math.max(7, top * 0.55), Math.max(1, width * 0.002), 0, Math.PI * 2);
  ctx.fillStyle = "#5A6A7A";
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(offsetX + width - 5, 10, 4, lidH - 24);
}

function drawImac(
  ctx: CanvasRenderingContext2D,
  width: number,
  image: HTMLImageElement | null,
  pixelRatio: number,
  intensity: number,
) {
  const { h } = measureDevice("imac", width);
  const screen = screenRect("imac", width);
  const chin = 46;
  const bodyH = screen.y * 2 + screen.h + chin;
  shadow(ctx, 0, 0, width, bodyH, 18, intensity);
  roundedRect(ctx, 0, 0, width, bodyH, 18);
  ctx.fillStyle = "#E4E4E7";
  ctx.fill();
  roundedRect(ctx, 5, 5, width - 10, screen.h + 10, 12);
  ctx.fillStyle = "#111";
  ctx.fill();
  const shot = clippedScreen(image, screen.w, screen.h, screen.r, pixelRatio);
  paintScreen(ctx, shot, screen.x, screen.y, screen.w, screen.h);
  ctx.fillStyle = "#D4D4D8";
  ctx.fillRect(width / 2 - 18, bodyH - 2, 36, 42);
  ctx.beginPath();
  ctx.ellipse(width / 2, h - 10, 78, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#C4C4C8";
  ctx.fill();
}

function drawMonitor(
  ctx: CanvasRenderingContext2D,
  width: number,
  image: HTMLImageElement | null,
  pixelRatio: number,
  intensity: number,
) {
  const { h } = measureDevice("monitor", width);
  const screen = screenRect("monitor", width);
  const bodyH = screen.y * 2 + screen.h + 8;
  shadow(ctx, 0, 0, width, bodyH, 10, intensity);
  roundedRect(ctx, 0, 0, width, bodyH, 10);
  ctx.fillStyle = "#1C1C1C";
  ctx.fill();
  const shot = clippedScreen(image, screen.w, screen.h, screen.r, pixelRatio);
  paintScreen(ctx, shot, screen.x, screen.y, screen.w, screen.h);
  ctx.fillStyle = "#C8C8CC";
  ctx.fillRect(width / 2 - 12, bodyH, 24, 40);
  ctx.beginPath();
  ctx.ellipse(width / 2, h - 8, 70, 8, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawPhone(
  ctx: CanvasRenderingContext2D,
  type: "iphone" | "android",
  width: number,
  image: HTMLImageElement | null,
  pixelRatio: number,
  intensity: number,
) {
  const { h } = measureDevice(type, width);
  const screen = screenRect(type, width);
  const radius = type === "iphone" ? width * 0.16 : width * 0.12;
  shadow(ctx, 0, 0, width, h, radius, intensity);
  roundedRect(ctx, 0, 0, width, h, radius);
  if (type === "iphone") {
    const metal = ctx.createLinearGradient(0, 0, width, 0);
    metal.addColorStop(0, "#8E8E93");
    metal.addColorStop(0.35, "#E8E8ED");
    metal.addColorStop(0.65, "#F4F4F6");
    metal.addColorStop(1, "#8A8A90");
    ctx.fillStyle = metal;
  } else {
    ctx.fillStyle = "#1C1C1F";
  }
  ctx.fill();
  roundedRect(ctx, 2.5, 2.5, width - 5, h - 5, radius - 2);
  ctx.fillStyle = "#0B0B0D";
  ctx.fill();
  const shot = clippedScreen(image, screen.w, screen.h, screen.r, pixelRatio);
  paintScreen(ctx, shot, screen.x, screen.y, screen.w, screen.h);
  if (type === "iphone") {
    const islandW = width * 0.28;
    const islandH = width * 0.072;
    roundedRect(
      ctx,
      (width - islandW) / 2,
      screen.y + width * 0.028,
      islandW,
      islandH,
      islandH / 2,
    );
    ctx.fillStyle = "#050505";
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(width / 2, screen.y + width * 0.05, width * 0.022, 0, Math.PI * 2);
    ctx.fillStyle = "#111";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width / 2, screen.y + width * 0.05, width * 0.01, 0, Math.PI * 2);
    ctx.fillStyle = "#2A4A6A";
    ctx.fill();
  }
}

function drawTablet(
  ctx: CanvasRenderingContext2D,
  type: "tablet-portrait" | "tablet-landscape",
  width: number,
  image: HTMLImageElement | null,
  pixelRatio: number,
  intensity: number,
) {
  const { h } = measureDevice(type, width);
  const screen = screenRect(type, width);
  const radius = 22;
  shadow(ctx, 0, 0, width, h, radius, intensity);
  roundedRect(ctx, 0, 0, width, h, radius);
  ctx.fillStyle = "#C8C8CD";
  ctx.fill();
  roundedRect(ctx, 3, 3, width - 6, h - 6, radius - 3);
  ctx.fillStyle = "#111";
  ctx.fill();
  const shot = clippedScreen(image, screen.w, screen.h, screen.r, pixelRatio);
  paintScreen(ctx, shot, screen.x, screen.y, screen.w, screen.h);
  ctx.beginPath();
  ctx.arc(
    type === "tablet-landscape" ? width * 0.04 : width / 2,
    type === "tablet-landscape" ? h / 2 : h * 0.035,
    4,
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = "#2A2A2A";
  ctx.fill();
}

function drawScreen(
  ctx: CanvasRenderingContext2D,
  width: number,
  image: HTMLImageElement | null,
  pixelRatio: number,
  intensity: number,
) {
  const { h } = measureDevice("screen", width);
  shadow(ctx, 0, 0, width, h, 22, intensity);
  const shot = clippedScreen(image, width, h, 22, pixelRatio);
  paintScreen(ctx, shot, 0, 0, width, h);
}

export function drawDeskAccessories(
  ctx: CanvasRenderingContext2D,
  dark: boolean,
) {
  const keyboardW = 430;
  const keyboardH = 132;
  const x = (CANVAS_WIDTH - keyboardW) / 2 - 40;
  const y = 838;
  const metal = dark ? "#3A3A40" : "#E6E6EA";
  const keys = dark ? "#2A2A30" : "#F4F4F6";

  ctx.save();
  ctx.shadowColor = "rgba(15,23,42,0.18)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  roundedRect(ctx, x, y, keyboardW, keyboardH, 14);
  ctx.fillStyle = metal;
  ctx.fill();
  ctx.restore();

  roundedRect(ctx, x + 14, y + 14, keyboardW - 28, keyboardH - 42, 8);
  ctx.fillStyle = keys;
  ctx.fill();
  roundedRect(ctx, x + keyboardW * 0.28, y + keyboardH - 22, keyboardW * 0.44, 10, 4);
  ctx.fillStyle = dark ? "#4A4A52" : "#D8D8DE";
  ctx.fill();

  const mx = x + keyboardW + 48;
  const my = y + 28;
  ctx.save();
  ctx.shadowColor = "rgba(15,23,42,0.16)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 6;
  ctx.beginPath();
  ctx.ellipse(mx, my + 36, 22, 34, 0.15, 0, Math.PI * 2);
  ctx.fillStyle = dark ? "#3A3A40" : "#E8E8EC";
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.ellipse(mx, my + 18, 8, 10, 0.15, 0, Math.PI * 2);
  ctx.fillStyle = dark ? "#2A2A30" : "#D0D0D6";
  ctx.fill();
}

export function drawDevice(
  ctx: CanvasRenderingContext2D,
  type: DeviceType,
  width: number,
  image: HTMLImageElement | null,
  pixelRatio: number,
  darkStudio: boolean,
  intensity = 1,
) {
  switch (type) {
    case "screen":
      return drawScreen(ctx, width, image, pixelRatio, intensity);
    case "browser-chrome":
    case "browser-safari":
    case "browser-minimal":
      return drawBrowser(ctx, type, width, image, pixelRatio, darkStudio, intensity);
    case "laptop":
    case "macbook":
    case "macbook-pro":
    case "macbook-air":
      return drawLaptop(ctx, type, width, image, pixelRatio, intensity);
    case "imac":
      return drawImac(ctx, width, image, pixelRatio, intensity);
    case "monitor":
      return drawMonitor(ctx, width, image, pixelRatio, intensity);
    case "iphone":
    case "android":
      return drawPhone(ctx, type, width, image, pixelRatio, intensity);
    case "tablet-portrait":
    case "tablet-landscape":
      return drawTablet(ctx, type, width, image, pixelRatio, intensity);
  }
}
