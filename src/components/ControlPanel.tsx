"use client";

import { deviceLabels } from "@/lib/catalog";
import type { DeviceSettings, MockupPreset, MockupSettings } from "@/lib/types";

type ControlPanelProps = {
  preset: MockupPreset;
  settings: MockupSettings;
  selected: number;
  onSelect: (index: number) => void;
  onBackground: (value: string) => void;
  onDeviceChange: (index: number, patch: Partial<DeviceSettings>) => void;
  onBringToFront: () => void;
  onReset: () => void;
};

const BACKGROUNDS = [
  { label: "White", value: "#F5F5F7" },
  { label: "Gray", value: "#E9EDF1" },
  { label: "Warm", value: "#F3F0EA" },
  { label: "Soft", value: "#EEF2F7" },
  { label: "Dark", value: "#141416" },
];

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="block">
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span className="text-neutral-700">{label}</span>
        <span className="tabular-nums text-neutral-500">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-neutral-900"
      />
    </div>
  );
}

export function ControlPanel({
  preset,
  settings,
  selected,
  onSelect,
  onBackground,
  onDeviceChange,
  onBringToFront,
  onReset,
}: ControlPanelProps) {
  const device = settings.devices[selected];
  const labels = deviceLabels(preset);
  const tabs = settings.devices.map((_, index) => index);
  const front = settings.deviceOrder[settings.deviceOrder.length - 1];

  if (!device) return null;

  return (
    <aside className="flex w-full flex-col gap-4 lg:max-h-[calc(100vh-9rem)] lg:w-[320px] lg:shrink-0 lg:overflow-y-auto lg:pr-1">
      <section className="rounded-2xl border border-neutral-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-950">
          Background
        </h3>
        <div className="mb-3 flex flex-wrap gap-2">
          {BACKGROUNDS.map((swatch) => (
            <button
              key={swatch.value}
              type="button"
              title={swatch.label}
              onClick={() => onBackground(swatch.value)}
              className={`h-7 w-7 rounded-full border ${
                settings.background.toUpperCase() === swatch.value.toUpperCase()
                  ? "border-neutral-950 ring-2 ring-neutral-900/20"
                  : "border-neutral-200"
              }`}
              style={{ background: swatch.value }}
            />
          ))}
        </div>
        <label className="flex items-center gap-3">
          <input
            type="color"
            value={settings.background}
            onChange={(event) => onBackground(event.target.value)}
            className="h-10 w-10 cursor-pointer rounded-lg border border-neutral-200 bg-white p-1"
          />
          <input
            type="text"
            value={settings.background}
            onChange={(event) => onBackground(event.target.value)}
            className="h-10 flex-1 rounded-lg border border-neutral-200 px-3 font-mono text-sm uppercase text-neutral-800"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-neutral-900 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-950">
          Edit device
        </h3>
        {tabs.length > 1 ? (
          <div
            className={`mb-4 grid gap-1 rounded-xl bg-neutral-100 p-1 ${
              tabs.length === 3 ? "grid-cols-3" : "grid-cols-2"
            }`}
          >
            {tabs.map((index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelect(index)}
                className={`truncate rounded-lg px-2 py-2 text-xs font-medium ${
                  selected === index
                    ? "bg-white text-neutral-950 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {labels[index]}
              </button>
            ))}
          </div>
        ) : null}
        <p className="mb-3 text-xs text-neutral-500">{labels[selected]}</p>

        <div className="flex flex-col gap-3">
          <Slider
            label="Scale"
            value={device.scale}
            min={0.4}
            max={1.6}
            step={0.01}
            display={`${Math.round(device.scale * 100)}%`}
            onChange={(scale) => onDeviceChange(selected, { scale })}
          />
          <Slider
            label="X position"
            value={device.x}
            min={-200}
            max={1400}
            step={1}
            display={`${Math.round(device.x)}`}
            onChange={(x) => onDeviceChange(selected, { x })}
          />
          <Slider
            label="Y position"
            value={device.y}
            min={-200}
            max={800}
            step={1}
            display={`${Math.round(device.y)}`}
            onChange={(y) => onDeviceChange(selected, { y })}
          />
          <Slider
            label="Rotation"
            value={device.rotation}
            min={-40}
            max={40}
            step={0.5}
            display={`${device.rotation.toFixed(1)}°`}
            onChange={(rotation) => onDeviceChange(selected, { rotation })}
          />
          <Slider
            label="Shadow intensity"
            value={device.shadowIntensity}
            min={0}
            max={2}
            step={0.01}
            display={`${Math.round(device.shadowIntensity * 100)}%`}
            onChange={(shadowIntensity) =>
              onDeviceChange(selected, { shadowIntensity })
            }
          />
        </div>
      </section>

      {tabs.length > 1 ? (
        <section className="rounded-2xl border border-neutral-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-950">
            Layer order
          </h3>
          <p className="mb-3 text-sm text-neutral-500">
            {labels[front]} is in front.
          </p>
          <button
            type="button"
            onClick={onBringToFront}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
          >
            Bring selected to front
          </button>
        </section>
      ) : null}

      <button
        type="button"
        onClick={onReset}
        className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
      >
        Reset Layout
      </button>
    </aside>
  );
}
