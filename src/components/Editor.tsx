"use client";

import { useState } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { MockupBrowser } from "@/components/MockupBrowser";
import { MockupCanvas } from "@/components/MockupCanvas";
import { MOCKUP_MAP } from "@/lib/catalog";
import { exportMockup, type ExportFormat } from "@/lib/compositor";
import { measureDevice } from "@/lib/devices";
import type {
  DeviceSettings,
  MockupSettings,
  UploadedImage,
} from "@/lib/types";

const EXPORT_FORMATS = [
  { id: "png", label: "PNG" },
  { id: "jpeg", label: "JPEG" },
  { id: "webp", label: "WebP" },
] as const;

type EditorProps = {
  styleId: string;
  settings: MockupSettings;
  images: (UploadedImage | null)[];
  onSettings: (settings: MockupSettings) => void;
  onChangeStyle: (id: string) => void;
  onReset: () => void;
  onBack: () => void;
};

export function Editor({
  styleId,
  settings,
  images,
  onSettings,
  onChangeStyle,
  onReset,
  onBack,
}: EditorProps) {
  const [selected, setSelected] = useState(0);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [switching, setSwitching] = useState(false);
  const preset = MOCKUP_MAP[styleId];
  const activeSelected =
    selected >= 0 && selected < settings.devices.length ? selected : 0;

  function updateDevice(index: number, patch: Partial<DeviceSettings>) {
    const current = settings.devices[index];
    const slot = preset?.devices[index];
    if (!current || !slot) return;
    let next = { ...current, ...patch };

    if (patch.scale != null && patch.x == null && patch.y == null) {
      const oldSize = measureDevice(slot.type, slot.width * current.scale);
      const newSize = measureDevice(slot.type, slot.width * patch.scale);
      next = {
        ...next,
        x: current.x + (oldSize.w - newSize.w) / 2,
        y: current.y + (oldSize.h - newSize.h) / 2,
      };
    }

    onSettings({
      ...settings,
      devices: settings.devices.map((device, i) =>
        i === index ? next : device,
      ),
    });
  }

  async function downloadImage() {
    setExporting(true);
    setExportError("");
    try {
      const { blob, extension } = await exportMockup({
        settings,
        presetId: styleId,
        shots: images,
        format: exportFormat,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mockup-${styleId}.${extension}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : "Could not export the image.",
      );
    } finally {
      setExporting(false);
    }
  }

  if (!preset) return null;

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-neutral-500">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-neutral-900"
            >
              ← Change screenshots
            </button>
            <span className="text-neutral-300">/</span>
            <button
              type="button"
              onClick={() => setSwitching(true)}
              className="hover:text-neutral-900"
            >
              Change mockup
            </button>
          </div>
          <h1 className="font-serif mt-2 text-3xl text-neutral-950">
            {preset.name}
          </h1>
          <p className="text-sm text-neutral-500">{preset.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full border border-neutral-200 bg-white p-1">
            {EXPORT_FORMATS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setExportFormat(option.id)}
                className={`rounded-full px-3 py-2 text-sm font-medium ${
                  exportFormat === option.id
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={downloadImage}
            disabled={exporting}
            className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
          >
            {exporting
              ? "Preparing…"
              : `Download ${EXPORT_FORMATS.find((option) => option.id === exportFormat)?.label}`}
          </button>
        </div>
      </div>

      {exportError ? (
        <p className="text-sm text-red-600">{exportError}</p>
      ) : null}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <MockupCanvas
            presetId={styleId}
            settings={settings}
            shots={images}
            selected={activeSelected}
            onSelect={setSelected}
            onDeviceChange={updateDevice}
          />
        </div>
        <ControlPanel
          preset={preset}
          settings={settings}
          selected={activeSelected}
          onSelect={setSelected}
          onBackground={(background) => onSettings({ ...settings, background })}
          onDeviceChange={updateDevice}
          onBringToFront={() => {
            const rest = settings.deviceOrder.filter(
              (index) => index !== activeSelected,
            );
            onSettings({
              ...settings,
              deviceOrder: [...rest, activeSelected],
            });
          }}
          onReset={onReset}
        />
      </div>

      {switching ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#F4F5F7]">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-neutral-500">
                Switch mockup
              </p>
              <h2 className="font-serif text-2xl text-neutral-950">
                Your screenshots stay in place
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setSwitching(false)}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
            >
              Close
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-10">
            <div className="mx-auto max-w-7xl">
              <MockupBrowser
                selected={styleId}
                compact
                onSelect={(id) => {
                  onChangeStyle(id);
                  setSelected(0);
                  setSwitching(false);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
