"use client";

import { useRef, useState } from "react";
import { MockupCanvas } from "@/components/MockupCanvas";
import { MOCKUP_MAP, screenshotCount, settingsFromPreset, shotLabels } from "@/lib/catalog";
import type { UploadedImage } from "@/lib/types";

type UploadStepProps = {
  styleId: string;
  images: (UploadedImage | null)[];
  error?: string;
  notice?: string;
  onFiles: (files: File[], mode: "replace" | "fill") => void;
  onReplace: (slot: number, file: File) => void;
  onReorder: (from: number, to: number) => void;
  onBack: () => void;
  onGenerate: () => void;
};

export function UploadStep({
  styleId,
  images,
  error,
  notice,
  onFiles,
  onReplace,
  onReorder,
  onBack,
  onGenerate,
}: UploadStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [replaceSlot, setReplaceSlot] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const preset = MOCKUP_MAP[styleId];
  const needed = preset ? screenshotCount(preset) : 1;
  const labels = preset ? shotLabels(preset) : ["Screenshot 1"];
  const filled = images.filter(Boolean).length;
  const remaining = Math.max(0, needed - filled);
  const ready = filled >= needed;
  const settings = preset ? settingsFromPreset(preset) : null;

  function takeFiles(list: FileList | File[] | null, mode: "replace" | "fill") {
    if (!list) return;
    const files = Array.from(list);
    if (files.length) onFiles(files, mode);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col px-5 py-10 sm:py-14">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm font-medium text-neutral-500 hover:text-neutral-900"
      >
        ← Back to mockups
      </button>

      <h1 className="font-serif mt-6 text-4xl text-neutral-950">
        {preset?.name ?? "Generate Mockup"}
      </h1>
      <p className="mt-3 max-w-2xl text-neutral-600">
        This is the mockup you selected. Upload{" "}
        {needed === 1 ? "1 screenshot" : `${needed} screenshots`} and it will stay
        in this exact frame, layout, and composition.
      </p>

      {settings && preset ? (
        <div className="mt-8">
          <MockupCanvas
            presetId={styleId}
            settings={settings}
            shots={images}
            interactive={false}
            caption={`${preset.name} · ${needed} ${needed === 1 ? "screen" : "screens"} · same template after generate`}
          />
        </div>
      ) : null}

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
        <p className="text-sm font-semibold text-neutral-950">
          This mockup requires {needed} {needed === 1 ? "image" : "images"}
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          {filled} / {needed} images selected
          {remaining > 0 ? ` · ${remaining} more needed` : ""}
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            takeFiles(event.dataTransfer.files, filled === 0 ? "replace" : "fill");
          }}
          className={`mt-5 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
            dragging
              ? "border-neutral-900 bg-neutral-100"
              : "border-neutral-200 bg-neutral-50 hover:border-neutral-400"
          }`}
        >
          <span className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white">
            {filled === 0
              ? `Upload ${needed} ${needed === 1 ? "Image" : "Images"}`
              : remaining > 0
                ? `Add remaining ${remaining}`
                : "Replace all images"}
          </span>
          <p className="mt-3 max-w-md text-sm text-neutral-500">
            Select {needed === 1 ? "the image" : `all ${needed} images at once`} in
            the file picker. PNG, JPG, or WEBP.
          </p>
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple={needed > 1}
          accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={(event) => {
            takeFiles(
              event.target.files,
              filled === 0 || remaining === 0 ? "replace" : "fill",
            );
            event.target.value = "";
          }}
        />
        <input
          ref={replaceRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file != null && replaceSlot != null) onReplace(replaceSlot, file);
            event.target.value = "";
            setReplaceSlot(null);
          }}
        />

        {notice ? (
          <p className="mt-4 text-sm text-amber-800">{notice}</p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        {needed > 0 ? (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: needed }, (_, index) => {
              const image = images[index] ?? null;
              return (
                <li
                  key={index}
                  className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
                >
                  <div className="aspect-[16/10] bg-neutral-100">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.url}
                        alt={labels[index]}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                        Empty
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3 py-2">
                    <p className="truncate text-xs font-medium text-neutral-700">
                      {labels[index]}
                    </p>
                    <div className="flex shrink-0 items-center gap-1">
                      {needed > 1 ? (
                        <>
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => onReorder(index, index - 1)}
                            className="rounded px-1.5 py-0.5 text-xs text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                          >
                            ←
                          </button>
                          <button
                            type="button"
                            disabled={index === needed - 1}
                            onClick={() => onReorder(index, index + 1)}
                            className="rounded px-1.5 py-0.5 text-xs text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                          >
                            →
                          </button>
                        </>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          setReplaceSlot(index);
                          replaceRef.current?.click();
                        }}
                        className="rounded px-1.5 py-0.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                      >
                        Replace
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>

      <button
        type="button"
        disabled={!ready}
        onClick={onGenerate}
        className="mt-10 self-center rounded-full bg-neutral-950 px-8 py-3 text-sm font-semibold text-white transition enabled:hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        Generate Mockup
      </button>
    </div>
  );
}
