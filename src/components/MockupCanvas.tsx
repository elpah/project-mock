"use client";

import { useEffect, useRef } from "react";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  getLayerLayouts,
  pickLayer,
  renderMockup,
} from "@/lib/compositor";
import { MOCKUP_MAP } from "@/lib/catalog";
import type { DeviceSettings, MockupSettings, ShotList } from "@/lib/types";

type MockupCanvasProps = {
  presetId: string;
  settings: MockupSettings;
  shots: ShotList;
  selected?: number | null;
  interactive?: boolean;
  caption?: string;
  onSelect?: (index: number) => void;
  onDeviceChange?: (index: number, patch: Partial<DeviceSettings>) => void;
};

function canvasPoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * CANVAS_WIDTH,
    y: ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
  };
}

export function MockupCanvas({
  presetId,
  settings,
  shots,
  selected = null,
  interactive = true,
  caption,
  onSelect,
  onDeviceChange,
}: MockupCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{
    index: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const preset = MOCKUP_MAP[presetId];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(CANVAS_WIDTH * dpr);
    canvas.height = Math.round(CANVAS_HEIGHT * dpr);
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    renderMockup(ctx, {
      settings,
      presetId,
      shots,
      selected,
      pixelRatio: dpr,
    });
  }, [settings, presetId, shots, selected]);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <canvas
        ref={canvasRef}
        className={`block h-auto w-full ${
          interactive ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
        onPointerDown={
          interactive && onSelect && onDeviceChange
            ? (event) => {
                const canvas = canvasRef.current;
                if (!canvas || !preset) return;
                const point = canvasPoint(canvas, event.clientX, event.clientY);
                const layouts = getLayerLayouts(preset, settings);
                const index = pickLayer(
                  point.x,
                  point.y,
                  layouts,
                  settings.deviceOrder,
                );
                if (index == null) return;
                const layout = layouts[index];
                if (!layout) return;
                onSelect(index);
                dragRef.current = {
                  index,
                  offsetX: point.x - layout.x,
                  offsetY: point.y - layout.y,
                };
                canvas.setPointerCapture(event.pointerId);
              }
            : undefined
        }
        onPointerMove={
          interactive && onDeviceChange
            ? (event) => {
                const drag = dragRef.current;
                const canvas = canvasRef.current;
                if (!drag || !canvas || event.buttons === 0) return;
                const point = canvasPoint(canvas, event.clientX, event.clientY);
                onDeviceChange(drag.index, {
                  x: point.x - drag.offsetX,
                  y: point.y - drag.offsetY,
                });
              }
            : undefined
        }
        onPointerUp={
          interactive
            ? (event) => {
                dragRef.current = null;
                const canvas = canvasRef.current;
                if (canvas?.hasPointerCapture(event.pointerId)) {
                  canvas.releasePointerCapture(event.pointerId);
                }
              }
            : undefined
        }
        onPointerCancel={
          interactive
            ? (event) => {
                dragRef.current = null;
                const canvas = canvasRef.current;
                if (canvas?.hasPointerCapture(event.pointerId)) {
                  canvas.releasePointerCapture(event.pointerId);
                }
              }
            : undefined
        }
      />
      <p className="border-t border-neutral-100 px-4 py-2 text-center text-xs text-neutral-500">
        {caption ??
          `${preset?.name ?? "Mockup"} · 3200 × 2000${
            interactive ? " · Drag a device to reposition" : ""
          }`}
      </p>
    </div>
  );
}
