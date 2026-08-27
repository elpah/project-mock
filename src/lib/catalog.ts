import type {
  CategoryId,
  DeviceSlot,
  DeviceType,
  Environment,
  MockupPreset,
} from "./types";

function d(
  type: DeviceType,
  shot: 0 | 1 | 2,
  x: number,
  y: number,
  width: number,
  rotation = 0,
  shadow = 1,
  skew = 0,
): DeviceSlot {
  return { type, shot, x, y, width, rotation, shadow, skew };
}

function mock(
  id: string,
  name: string,
  description: string,
  category: MockupPreset["category"],
  environment: Environment,
  background: string,
  devices: DeviceSlot[],
): MockupPreset {
  return { id, name, description, category, environment, background, devices };
}

const GRAY = "#E9EDF1";
const WHITE = "#F5F5F7";
const WARM = "#F3F0EA";
const SOFT = "#EEF2F7";

export const MOCKUPS: MockupPreset[] = [
  mock("chrome-front", "Chrome Front", "Full Chrome window on a clean studio background.", "browsers", "gray", GRAY, [
    d("browser-chrome", 0, 160, 70, 1280),
  ]),
  mock("safari-front", "Safari Front", "Safari window with a centered address pill.", "browsers", "apple", WHITE, [
    d("browser-safari", 0, 170, 80, 1260),
  ]),
  mock("browser-minimal", "Minimal Browser", "Thin window chrome, maximum screen.", "browsers", "white", WHITE, [
    d("browser-minimal", 0, 180, 90, 1240),
  ]),
  mock("chrome-float", "Floating Chrome", "Browser lifted with a large soft shadow.", "browsers", "gray", GRAY, [
    d("browser-chrome", 0, 200, 90, 1200, 0, 1.35),
  ]),
  mock("chrome-tilt", "Angled Chrome", "Browser window with a slight tilt.", "browsers", "gray", GRAY, [
    d("browser-chrome", 0, 180, 80, 1220, -6, 1.1),
  ]),
  mock("chrome-perspective", "Perspective Chrome", "Subtle 3D perspective on a studio backdrop.", "browsers", "studio-light", SOFT, [
    d("browser-chrome", 0, 220, 90, 1160, 0, 1.2, -8),
  ]),
  mock("safari-dark", "Safari Studio", "Safari window on a clean studio background.", "browsers", "apple", WHITE, [
    d("browser-safari", 0, 180, 90, 1240, 0, 1.3),
  ]),
  mock("dual-chrome", "Layered Browsers", "Two Chrome windows overlapped.", "browsers", "gray", GRAY, [
    d("browser-chrome", 0, 80, 60, 980, -7, 0.9),
    d("browser-chrome", 1, 520, 180, 980, 6, 1.15),
  ]),
  mock("triple-windows", "Window Stack", "Three browser windows at different depths.", "browsers", "editorial", WARM, [
    d("browser-minimal", 0, 70, 50, 820, -8, 0.7),
    d("browser-chrome", 1, 390, 140, 860, 3, 0.95),
    d("browser-safari", 2, 780, 250, 740, 8, 1.2),
  ]),
  mock("chrome-editorial", "Editorial Browser", "Single window on a warm agency background.", "browsers", "editorial", WARM, [
    d("browser-minimal", 0, 200, 100, 1200, -3, 1.1),
  ]),

  mock("laptop-front", "Laptop Front", "Generic modern laptop, opened at 90°, straight-on.", "laptops", "gray", GRAY, [
    d("laptop", 0, 360, 40, 820),
  ]),
  mock("macbook-front", "MacBook", "MacBook-style laptop with keyboard and trackpad.", "laptops", "apple", WHITE, [
    d("macbook", 0, 350, 32, 840),
  ]),
  mock("macbook-pro", "MacBook Pro", "Space-gray Pro-style laptop, opened at 90°.", "laptops", "apple", WHITE, [
    d("macbook-pro", 0, 330, 22, 880),
  ]),
  mock("macbook-air", "MacBook Air", "Thinner Air-style laptop with a light chassis.", "laptops", "apple", WHITE, [
    d("macbook-air", 0, 360, 40, 820),
  ]),
  mock("laptop-angle", "Laptop Angle", "Laptop rotated slightly in space.", "laptops", "gray", GRAY, [
    d("macbook", 0, 340, 36, 820, -7, 1.15),
  ]),
  mock("laptop-float", "Floating Laptop", "Laptop lifted with a deep shadow.", "laptops", "studio-light", SOFT, [
    d("macbook", 0, 350, 28, 820, 4, 1.45),
  ]),
  mock("laptop-desk", "Laptop on Desk", "Laptop resting on a studio desk.", "laptops", "desk", GRAY, [
    d("macbook", 0, 350, 18, 820, 0, 0.85),
  ]),
  mock("laptop-perspective", "Laptop Perspective", "Slight 3D perspective.", "laptops", "gray", GRAY, [
    d("macbook", 0, 360, 36, 800, 0, 1.2, -10),
  ]),
  mock("laptop-dark", "Laptop Studio", "MacBook on a clean studio background.", "laptops", "apple", WHITE, [
    d("macbook", 0, 350, 36, 820, 0, 1.35),
  ]),
  mock("laptop-editorial", "Editorial Laptop", "Warm paper-like portfolio backdrop.", "laptops", "editorial", WARM, [
    d("macbook-air", 0, 350, 44, 820, -4, 1.1),
  ]),

  mock("imac-front", "iMac", "iMac-style all-in-one, straight-on.", "desktops", "apple", WHITE, [
    d("imac", 0, 360, 20, 880),
  ]),
  mock("monitor-front", "Studio Monitor", "Large professional monitor.", "desktops", "gray", GRAY, [
    d("monitor", 0, 340, 40, 920),
  ]),
  mock("monitor-pro", "Pro Display", "Oversized desktop monitor.", "desktops", "studio-light", SOFT, [
    d("monitor", 0, 280, 20, 1040),
  ]),
  mock("imac-angle", "iMac Angle", "Desktop with a slight rotation.", "desktops", "apple", WHITE, [
    d("imac", 0, 340, 20, 900, -5, 1.15),
  ]),
  mock("monitor-perspective", "Monitor Perspective", "Monitor with a 3D tilt.", "desktops", "gray", GRAY, [
    d("monitor", 0, 360, 40, 900, 0, 1.2, -7),
  ]),
  mock("imac-desk", "iMac on Desk", "Desktop setup on a clean desk.", "desktops", "desk", GRAY, [
    d("imac", 0, 360, 10, 880, 0, 0.8),
  ]),
  mock("monitor-desk", "Monitor Desk Setup", "Monitor sitting on a studio surface.", "desktops", "desk", GRAY, [
    d("monitor", 0, 340, 20, 920, 0, 0.8),
  ]),
  mock("imac-float", "Floating iMac", "Minimal floating desktop.", "desktops", "white", WHITE, [
    d("imac", 0, 360, 20, 880, 0, 1.4),
  ]),
  mock("dual-monitor", "Dual Monitors", "Two monitors side by side.", "desktops", "studio-light", SOFT, [
    d("monitor", 0, 60, 80, 740, -4, 1.1),
    d("monitor", 1, 800, 80, 740, 4, 1.1),
  ]),
  mock("imac-dark", "iMac Studio", "Premium desktop presentation on a light backdrop.", "desktops", "apple", WHITE, [
    d("imac", 0, 360, 20, 880, 0, 1.3),
  ]),

  mock("iphone-front", "iPhone Front", "Modern iPhone-style device, straight-on.", "phones", "apple", WHITE, [
    d("iphone", 0, 632, 70, 336),
  ]),
  mock("android-front", "Android Phone", "Android-style smartphone.", "phones", "gray", GRAY, [
    d("android", 0, 628, 70, 344),
  ]),
  mock("phone-generic", "Smartphone", "Generic modern phone.", "phones", "gray", GRAY, [
    d("iphone", 0, 636, 80, 328),
  ]),
  mock("phone-angle", "Phone Angle", "Smartphone rotated in space.", "phones", "gray", GRAY, [
    d("iphone", 0, 600, 70, 340, -12, 1.2),
  ]),
  mock("dual-phones", "Two Phones", "A pair of phones, slightly overlapped.", "phones", "gray", GRAY, [
    d("iphone", 0, 430, 90, 310, -4, 0.95),
    d("iphone", 1, 860, 110, 310, 5, 1.15),
  ]),
  mock("phone-fan", "Three-Phone Fan", "Three phones fanned out.", "phones", "gray", GRAY, [
    d("iphone", 0, 268, 160, 300, 13, 0.95),
    d("iphone", 1, 650, 100, 300, 1, 1.05),
    d("iphone", 2, 1032, 150, 300, -12, 1.2),
  ]),
  mock("two-phones-upright", "Upright Pair", "Two phones, almost straight.", "phones", "gray", GRAY, [
    d("iphone", 0, 430, 90, 320, -1.5, 1),
    d("iphone", 1, 850, 110, 320, 1.5, 1.1),
  ]),
  mock("two-phones-tilt", "Tilted Pair", "Two phones, same clockwise tilt.", "phones", "gray", GRAY, [
    d("iphone", 0, 360, 50, 310, 21, 1),
    d("iphone", 1, 760, 180, 310, 21, 1.2),
  ]),
  mock("phones-dark", "Phone Pair Studio", "Two phones on a clean studio background.", "phones", "gray", GRAY, [
    d("iphone", 0, 420, 90, 320, -8, 1.2),
    d("iphone", 1, 860, 120, 320, 8, 1.3),
  ]),

  mock("ipad-portrait", "iPad Portrait", "Tablet standing in portrait.", "tablets", "apple", WHITE, [
    d("tablet-portrait", 0, 560, 40, 480),
  ]),
  mock("ipad-landscape", "iPad Landscape", "Tablet in landscape.", "tablets", "apple", WHITE, [
    d("tablet-landscape", 0, 340, 80, 920),
  ]),
  mock("tablet-angle", "Tablet Angle", "Tablet rotated slightly.", "tablets", "gray", GRAY, [
    d("tablet-portrait", 0, 540, 40, 500, -8, 1.15),
  ]),
  mock("tablet-float", "Floating Tablet", "Tablet lifted off a studio floor.", "tablets", "studio-light", SOFT, [
    d("tablet-landscape", 0, 360, 90, 880, 4, 1.4),
  ]),
  mock("tablet-dark", "Tablet Studio", "Landscape tablet on a clean studio background.", "tablets", "apple", WHITE, [
    d("tablet-landscape", 0, 360, 90, 880, 0, 1.3),
  ]),

  mock("macbook-iphone", "MacBook + iPhone", "Laptop with a phone beside it.", "combos", "apple", WHITE, [
    d("macbook", 0, 70, 90, 700, -4, 1),
    d("iphone", 1, 1080, 140, 280, 8, 1.25),
  ]),
  mock("laptop-phone-float", "Laptop + Floating Phone", "Laptop in front, phone hovering beside.", "combos", "gray", GRAY, [
    d("macbook", 0, 90, 100, 680, 0, 1),
    d("iphone", 1, 1120, 80, 260, 12, 1.4),
  ]),
  mock("imac-macbook", "iMac + MacBook", "Desktop with a laptop in front.", "combos", "apple", WHITE, [
    d("imac", 0, 430, 10, 740, 0, 0.9),
    d("macbook-air", 1, 90, 470, 520, -6, 1.2),
  ]),
  mock("monitor-phone", "Monitor + Phone", "Large display with a phone overlay.", "combos", "gray", GRAY, [
    d("monitor", 0, 140, 40, 980, 0, 1),
    d("iphone", 1, 1160, 220, 270, 6, 1.3),
  ]),
  mock("laptop-tablet-phone", "Full Device Stack", "Laptop, tablet, and phone together.", "combos", "studio-light", SOFT, [
    d("macbook", 0, 40, 90, 640, -5, 0.95),
    d("tablet-portrait", 1, 720, 80, 360, 4, 1.05),
    d("iphone", 2, 1160, 180, 250, 10, 1.3),
  ]),
  mock("imac-phone", "iMac + Phone", "Desktop with a floating phone.", "combos", "apple", WHITE, [
    d("imac", 0, 180, 30, 860, 0, 1),
    d("iphone", 1, 1180, 200, 260, 8, 1.25),
  ]),
  mock("laptop-tablet", "Laptop + Tablet", "Laptop with a landscape tablet.", "combos", "gray", GRAY, [
    d("macbook", 0, 40, 70, 680, -3, 1),
    d("tablet-landscape", 1, 860, 280, 680, 6, 1.2),
  ]),
  mock("hero-desktop-phone", "Hero Monitor + Phone", "Oversized monitor with a small phone.", "combos", "studio-light", SOFT, [
    d("monitor", 0, 80, 30, 1100, 0, 1.1),
    d("iphone", 1, 1220, 280, 240, 7, 1.4),
  ]),

  mock("screens-opposite", "Opposite Screens", "Two floating website panels.", "creative", "gray", GRAY, [
    d("screen", 0, 90, 140, 680, -6, 1),
    d("screen", 1, 830, 360, 680, 6, 1),
  ]),
  mock("screens-diagonal", "Diagonal Screens", "Two screens, same tilt, overlapping.", "creative", "gray", GRAY, [
    d("screen", 0, 90, 40, 760, -12, 1),
    d("screen", 1, 540, 280, 760, -12, 1.15),
  ]),
  mock("floating-depth", "Floating Depth", "Three screens at different depths.", "creative", "studio-light", SOFT, [
    d("screen", 0, 80, 80, 620, -8, 0.7),
    d("screen", 1, 480, 180, 680, 3, 1),
    d("screen", 2, 900, 80, 560, 10, 1.3),
  ]),
  mock("device-collage", "Device Collage", "Browser, laptop, and phone clustered.", "creative", "editorial", WARM, [
    d("browser-minimal", 0, 60, 40, 900, -6, 0.85),
    d("macbook-air", 1, 560, 340, 540, 5, 1.1),
    d("iphone", 2, 1220, 120, 240, 12, 1.3),
  ]),
  mock("isometric-laptop", "Isometric Laptop", "Laptop with a stronger perspective.", "creative", "gradient", SOFT, [
    d("macbook", 0, 380, 24, 760, 0, 1.25, -16),
  ]),
  mock("glass-browser", "Glass Studio Browser", "Browser on a soft gradient.", "creative", "gradient", SOFT, [
    d("browser-safari", 0, 180, 80, 1240, -3, 1.2),
  ]),
  mock("dark-hero-imac", "Hero iMac", "Large desktop presentation on a studio desk.", "creative", "desk", GRAY, [
    d("imac", 0, 340, 10, 920, 0, 1.35),
  ]),
  mock("apple-white", "Apple White", "Ultra-minimal white MacBook.", "creative", "apple", WHITE, [
    d("macbook", 0, 350, 32, 840, 0, 1.15),
  ]),
  mock("saas-hero", "SaaS Hero", "Large Chrome window, product-landing style.", "creative", "gradient", SOFT, [
    d("browser-chrome", 0, 140, 50, 1320, 0, 1.25),
  ]),
  mock("agency-spread", "Agency Spread", "Laptop hero with a phone and tablet.", "creative", "editorial", WARM, [
    d("macbook", 0, 240, 28, 760, -3, 1),
    d("tablet-portrait", 1, 40, 280, 300, -12, 0.9),
    d("iphone", 2, 1240, 180, 250, 10, 1.3),
  ]),
  mock("tablet-phone", "Tablet + Phone", "Portrait tablet with a phone beside it.", "combos", "gray", GRAY, [
    d("tablet-portrait", 0, 360, 40, 500, -4, 1),
    d("iphone", 1, 980, 180, 280, 8, 1.25),
  ]),
  mock("ipad-iphone", "iPad + iPhone", "Apple tablet and phone, side by side.", "combos", "apple", WHITE, [
    d("tablet-portrait", 0, 340, 40, 520),
    d("iphone", 1, 980, 160, 280, 6, 1.2),
  ]),
  mock("monitor-keyboard", "Monitor + Keyboard", "Desktop, keyboard, and mouse on a desk.", "desktops", "desk", GRAY, [
    d("monitor", 0, 340, 10, 920, 0, 0.85),
  ]),
  mock("workstation", "Workstation", "Dual monitors with a laptop in front.", "desktops", "studio-light", SOFT, [
    d("monitor", 0, 40, 30, 700, -5, 0.95),
    d("monitor", 1, 860, 30, 700, 5, 0.95),
    d("macbook-air", 2, 480, 500, 560, 0, 1.2),
  ]),
  mock("chrome-macbook", "Browser + Laptop", "Chrome window floating over a MacBook.", "combos", "studio-light", SOFT, [
    d("macbook", 0, 360, 340, 700, 0, 0.9),
    d("browser-chrome", 1, 220, 40, 1160, -3, 1.25),
  ]),
  mock("hero-phone", "Hero iPhone", "Oversized phone, portfolio-cover style.", "phones", "apple", WHITE, [
    d("iphone", 0, 580, 20, 440),
  ]),
  mock("phone-editorial", "Editorial Phone", "Single phone on a warm agency backdrop.", "phones", "editorial", WARM, [
    d("iphone", 0, 600, 40, 400, -6, 1.2),
  ]),
  mock("floating-phones", "Floating Phones", "Three phones at different depths.", "creative", "studio-light", SOFT, [
    d("iphone", 0, 220, 140, 280, -10, 0.75),
    d("iphone", 1, 660, 60, 300, 2, 1.05),
    d("iphone", 2, 1080, 160, 260, 12, 1.3),
  ]),
  mock("minimal-monitor", "Minimal Monitor", "Floating display, no desk.", "desktops", "white", WHITE, [
    d("monitor", 0, 340, 60, 920, 0, 1.4),
  ]),
  mock("browser-desk", "Browser on Desk", "Full Chrome window resting on a studio desk.", "browsers", "desk", GRAY, [
    d("browser-chrome", 0, 180, 40, 1240, 0, 0.9),
  ]),
];

export const MOCKUP_MAP: Record<string, MockupPreset> = Object.fromEntries(
  MOCKUPS.map((item) => [item.id, item]),
);

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "browsers", label: "Browsers" },
  { id: "laptops", label: "Laptops" },
  { id: "desktops", label: "Desktop" },
  { id: "mobile", label: "Mobile" },
  { id: "phones", label: "Phones" },
  { id: "tablets", label: "Tablets" },
  { id: "combos", label: "Device Combos" },
  { id: "creative", label: "Creative" },
];

export const DEVICE_NAMES: Record<DeviceType, string> = {
  screen: "Screen",
  "browser-chrome": "Chrome",
  "browser-safari": "Safari",
  "browser-minimal": "Browser",
  laptop: "Laptop",
  macbook: "MacBook",
  "macbook-pro": "MacBook Pro",
  "macbook-air": "MacBook Air",
  imac: "iMac",
  monitor: "Monitor",
  iphone: "iPhone",
  android: "Android",
  "tablet-portrait": "iPad",
  "tablet-landscape": "Tablet",
};

export function mockupsForCategory(id: CategoryId) {
  if (id === "all") return MOCKUPS;
  if (id === "mobile") {
    return MOCKUPS.filter(
      (item) => item.category === "phones" || item.category === "tablets",
    );
  }
  return MOCKUPS.filter((item) => item.category === id);
}

export function deviceLabels(preset: MockupPreset) {
  const totals: Partial<Record<DeviceType, number>> = {};
  const seen: Partial<Record<DeviceType, number>> = {};
  for (const device of preset.devices) {
    totals[device.type] = (totals[device.type] ?? 0) + 1;
  }
  return preset.devices.map((device) => {
    const name = DEVICE_NAMES[device.type];
    if ((totals[device.type] ?? 1) < 2) return name;
    seen[device.type] = (seen[device.type] ?? 0) + 1;
    return `${name} ${seen[device.type]}`;
  });
}

export function shotLabels(preset: MockupPreset) {
  const count = screenshotCount(preset);
  return Array.from({ length: count }, (_, index) => {
    const names = [
      ...new Set(
        preset.devices
          .filter((device) => device.shot === index)
          .map((device) => DEVICE_NAMES[device.type]),
      ),
    ];
    return names.length
      ? `Screenshot ${index + 1}: ${names.join(" + ")}`
      : `Screenshot ${index + 1}`;
  });
}

export function screenshotCount(preset: MockupPreset) {
  return Math.max(...preset.devices.map((device) => device.shot)) + 1;
}

export function settingsFromPreset(preset: MockupPreset) {
  return {
    background: preset.background,
    deviceOrder: preset.devices.map((_, index) => index),
    devices: preset.devices.map((device) => ({
      x: device.x,
      y: device.y,
      scale: 1,
      rotation: device.rotation,
      shadowIntensity: device.shadow,
    })),
  };
}
