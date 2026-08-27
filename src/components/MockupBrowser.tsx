"use client";

import { useMemo, useState } from "react";
import { MockupThumb } from "@/components/MockupThumb";
import { CATEGORIES, mockupsForCategory, screenshotCount } from "@/lib/catalog";
import type { CategoryId, MockupPreset } from "@/lib/types";

type MockupBrowserProps = {
  selected: string | null;
  onSelect: (id: string) => void;
  compact?: boolean;
};

function MockupCard({
  preset,
  selected,
  onSelect,
}: {
  preset: MockupPreset;
  selected: boolean;
  onSelect: () => void;
}) {
  const shots = screenshotCount(preset);
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition ${
        selected
          ? "border-neutral-900 ring-2 ring-neutral-900"
          : "border-neutral-200 hover:border-neutral-400"
      }`}
    >
      <div className="relative aspect-[8/5] overflow-hidden bg-[#E9EDF1]">
        <MockupThumb preset={preset} />
      </div>
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-neutral-950">
            {preset.name}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-neutral-500">
            {preset.description}
          </p>
        </div>
        <span className="mt-0.5 shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-500">
          {shots === 1 ? "1 shot" : `${shots} shots`}
        </span>
      </div>
    </button>
  );
}

export function MockupBrowser({
  selected,
  onSelect,
  compact = false,
}: MockupBrowserProps) {
  const [category, setCategory] = useState<CategoryId>("all");

  const groups = useMemo(() => {
    const cats = CATEGORIES.filter(
      (item) => item.id !== "all" && item.id !== "mobile",
    );
    if (category === "all") {
      return cats.map((item) => ({
        ...item,
        items: mockupsForCategory(item.id),
      }));
    }
    if (category === "mobile") {
      return cats
        .filter((item) => item.id === "phones" || item.id === "tablets")
        .map((item) => ({
          ...item,
          items: mockupsForCategory(item.id),
        }));
    }
    const current = cats.find((item) => item.id === category);
    return current
      ? [
          {
            ...current,
            items: mockupsForCategory(current.id),
          },
        ]
      : [];
  }, [category]);

  return (
    <div className="w-full">
      <div
        className="sticky top-0 z-10 -mx-1 flex gap-2 overflow-x-auto bg-[#F4F5F7]/90 px-1 py-3 backdrop-blur"
      >
        {CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              category === item.id
                ? "bg-neutral-950 text-white"
                : "bg-white text-neutral-600 ring-1 ring-neutral-200 hover:text-neutral-950"
            }`}
          >
            {item.label}
            <span className="ml-1.5 text-xs opacity-60">
              {mockupsForCategory(item.id).length}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-10">
        {groups.map((group) => (
          <section key={group.id}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {group.label}
            </h2>
            <div
              className={`mt-4 grid gap-4 ${
                compact
                  ? "sm:grid-cols-2 xl:grid-cols-3"
                  : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {group.items.map((preset) => (
                <MockupCard
                  key={preset.id}
                  preset={preset}
                  selected={selected === preset.id}
                  onSelect={() => onSelect(preset.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
