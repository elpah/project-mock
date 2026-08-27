"use client";

import dynamic from "next/dynamic";
import { MOCKUP_MAP } from "@/lib/catalog";

const MockupBrowser = dynamic(
  () =>
    import("@/components/MockupBrowser").then((module) => module.MockupBrowser),
  {
    ssr: false,
    loading: () => <div className="h-[640px] rounded-3xl bg-white/60" />,
  },
);

type StylePickerProps = {
  selected: string | null;
  onSelect: (id: string) => void;
  onContinue: () => void;
};

export function StylePicker({
  selected,
  onSelect,
  onContinue,
}: StylePickerProps) {
  const current = selected ? MOCKUP_MAP[selected] : null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
        Mockup Generator
      </p>
      <h1 className="font-serif mt-4 max-w-3xl text-center text-4xl leading-tight text-neutral-950 sm:text-5xl">
        Place your project in a professional device presentation.
      </h1>
      <p className="mt-4 max-w-2xl text-center text-base leading-relaxed text-neutral-600">
        Choose a browser, laptop, desktop, phone, tablet, or multi-device layout.
        Your screenshot stays pixel-accurate. The frame is only the presentation.
      </p>

      <div className="mt-10 w-full">
        <MockupBrowser selected={selected} onSelect={onSelect} />
      </div>

      <div className="sticky bottom-4 z-20 mt-10 flex w-full justify-center">
        <button
          type="button"
          disabled={!selected}
          onClick={onContinue}
          className="rounded-full bg-neutral-950 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-neutral-900/20 transition enabled:hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none"
        >
          {current ? `Continue with ${current.name}` : "Select a mockup"}
        </button>
      </div>
    </div>
  );
}
