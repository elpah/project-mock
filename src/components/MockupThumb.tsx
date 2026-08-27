import type { ReactNode } from "react";
import { isLaptopType, laptopGeometry, measureDevice, screenRect } from "@/lib/devices";
import { CANVAS_HEIGHT, CANVAS_WIDTH, type DeviceSlot, type MockupPreset } from "@/lib/types";

function DeviceSilhouette({ slot }: { slot: DeviceSlot }) {
  const size = measureDevice(slot.type, slot.width);
  const screen = screenRect(slot.type, slot.width);
  const cx = slot.x + size.w / 2;
  const cy = slot.y + size.h / 2;
  const skew = slot.skew ?? 0;
  const empty = "#D5DAE1";
  const metal = "#C9C9CE";
  const bezel = "#1A1A1A";
  const chrome = "#F4F4F6";

  let body: ReactNode = null;

  if (slot.type.startsWith("browser") || slot.type === "screen") {
    const bar = slot.type === "browser-safari" ? 64 : slot.type === "browser-minimal" ? 36 : slot.type === "screen" ? 0 : 52;
    body = (
      <>
        <rect width={size.w} height={size.h} rx={slot.type === "screen" ? 18 : 12} fill="#fff" />
        {bar ? <rect width={size.w} height={bar} fill={chrome} /> : null}
        {bar ? (
          <>
            <circle cx={18} cy={bar / 2} r={5} fill="#FF5F57" />
            <circle cx={32} cy={bar / 2} r={5} fill="#FEBC2E" />
            <circle cx={46} cy={bar / 2} r={5} fill="#28C840" />
          </>
        ) : null}
        <rect
          x={screen.x}
          y={screen.y}
          width={screen.w}
          height={screen.h}
          rx={Math.max(2, screen.r)}
          fill={empty}
        />
      </>
    );
  } else if (isLaptopType(slot.type)) {
    const geo = laptopGeometry(slot.type, slot.width);
    const lidH = geo.lidH;
    const hingeY = lidH - 3;
    body = (
      <>
        <polygon
          points={`${geo.offsetX + 8},${hingeY} ${geo.offsetX + slot.width - 8},${hingeY} ${geo.w - 6},${geo.h - 10} 6,${geo.h - 10}`}
          fill={slot.type === "macbook-pro" ? "#A8A8AE" : metal}
        />
        <polygon
          points={`${geo.offsetX + slot.width * 0.12},${hingeY + geo.deck * 0.14} ${geo.offsetX + slot.width * 0.88},${hingeY + geo.deck * 0.14} ${geo.offsetX + slot.width * 0.9},${hingeY + geo.deck * 0.58} ${geo.offsetX + slot.width * 0.1},${hingeY + geo.deck * 0.58}`}
          fill={slot.type === "macbook-pro" ? "#6E6E74" : "#B8B8C0"}
        />
        <polygon
          points={`${geo.w * 0.39},${hingeY + geo.deck * 0.7} ${geo.w * 0.61},${hingeY + geo.deck * 0.7} ${geo.w * 0.62},${hingeY + geo.deck * 0.9} ${geo.w * 0.38},${hingeY + geo.deck * 0.9}`}
          fill="#C4C4CA"
        />
        <rect
          x={geo.offsetX + slot.width * 0.08}
          y={hingeY - 5}
          width={slot.width * 0.84}
          height={12}
          rx={5}
          fill="#A8A8AE"
        />
        <rect x={geo.offsetX} width={slot.width} height={lidH} rx={14} fill={slot.type === "macbook-pro" ? "#A8A8AE" : metal} />
        <rect
          x={geo.offsetX + 4}
          y={4}
          width={slot.width - 8}
          height={lidH - geo.chin * 0.35}
          rx={10}
          fill={bezel}
        />
        <rect
          x={geo.offsetX + geo.bezel}
          y={geo.top}
          width={geo.screenW}
          height={geo.screenH}
          fill={empty}
        />
      </>
    );
  } else if (slot.type === "imac") {
    const bodyH = screen.y * 2 + screen.h + 46;
    body = (
      <>
        <rect width={size.w} height={bodyH} rx={16} fill="#E4E4E7" />
        <rect x={5} y={5} width={size.w - 10} height={screen.h + 10} rx={10} fill={bezel} />
        <rect x={screen.x} y={screen.y} width={screen.w} height={screen.h} fill={empty} />
        <rect x={size.w / 2 - 16} y={bodyH - 2} width={32} height={size.h - bodyH} fill="#D4D4D8" />
        <ellipse cx={size.w / 2} cy={size.h - 8} rx={70} ry={8} fill="#C4C4C8" />
      </>
    );
  } else if (slot.type === "monitor") {
    const bodyH = screen.y * 2 + screen.h + 8;
    body = (
      <>
        <rect width={size.w} height={bodyH} rx={8} fill={bezel} />
        <rect x={screen.x} y={screen.y} width={screen.w} height={screen.h} fill={empty} />
        <rect x={size.w / 2 - 10} y={bodyH} width={20} height={36} fill="#C8C8CC" />
        <ellipse cx={size.w / 2} cy={size.h - 8} rx={64} ry={7} fill="#C8C8CC" />
      </>
    );
  } else if (slot.type === "iphone" || slot.type === "android") {
    const r = slot.type === "iphone" ? slot.width * 0.16 : slot.width * 0.12;
    body = (
      <>
        <rect width={size.w} height={size.h} rx={r} fill={slot.type === "iphone" ? "#D0D0D5" : "#222"} />
        <rect
          x={screen.x}
          y={screen.y}
          width={screen.w}
          height={screen.h}
          rx={screen.r}
          fill={empty}
        />
        {slot.type === "iphone" ? (
          <rect
            x={size.w / 2 - slot.width * 0.14}
            y={screen.y + slot.width * 0.03}
            width={slot.width * 0.28}
            height={slot.width * 0.07}
            rx={slot.width * 0.035}
            fill="#111"
          />
        ) : (
          <circle cx={size.w / 2} cy={screen.y + slot.width * 0.05} r={slot.width * 0.022} fill="#111" />
        )}
      </>
    );
  } else {
    body = (
      <>
        <rect width={size.w} height={size.h} rx={18} fill={metal} />
        <rect
          x={screen.x}
          y={screen.y}
          width={screen.w}
          height={screen.h}
          rx={10}
          fill={empty}
        />
      </>
    );
  }

  return (
    <g
      transform={`translate(${cx} ${cy}) rotate(${slot.rotation}) skewX(${skew}) translate(${-size.w / 2} ${-size.h / 2})`}
    >
      {body}
    </g>
  );
}

export function MockupThumb({ preset }: { preset: MockupPreset }) {
  const desk =
    preset.environment === "desk" || preset.environment === "desk-dark";
  const dark =
    preset.environment === "studio-dark" || preset.environment === "desk-dark";
  const filterId = `${preset.id}-shadow`;

  return (
    <svg
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow
            dx="0"
            dy="18"
            stdDeviation="16"
            floodColor="#0f172a"
            floodOpacity={dark ? "0.45" : "0.16"}
          />
        </filter>
        {(preset.environment === "gradient" ||
          preset.environment === "studio-light") && (
          <linearGradient id={`${preset.id}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EEF2FF" />
            <stop offset="50%" stopColor={preset.background} />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>
        )}
      </defs>
      <rect
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        fill={
          preset.environment === "gradient" ||
          preset.environment === "studio-light"
            ? `url(#${preset.id}-bg)`
            : preset.background
        }
      />
      {desk ? (
        <rect
          y={690}
          width={CANVAS_WIDTH}
          height={310}
          fill={dark ? "#1A1A1C" : "#C8C2B8"}
        />
      ) : null}
      <g filter={`url(#${filterId})`}>
        {preset.devices.map((slot, index) => (
          <DeviceSilhouette key={`${preset.id}-${index}`} slot={slot} />
        ))}
      </g>
    </svg>
  );
}
