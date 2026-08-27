"use client";

import { useEffect, useState } from "react";
import { Editor } from "@/components/Editor";
import { StylePicker } from "@/components/StylePicker";
import { UploadStep } from "@/components/UploadStep";
import { MOCKUP_MAP, screenshotCount } from "@/lib/catalog";
import {
  isSupportedImage,
  loadImageFile,
  loadImageFiles,
  revokeImage,
} from "@/lib/images";
import { settingsForStyle } from "@/lib/presets";
import type { AppStep, MockupSettings, UploadedImage } from "@/lib/types";

function emptySlots(count: number): (UploadedImage | null)[] {
  return Array.from({ length: Math.max(1, count) }, () => null);
}

export function App() {
  const [step, setStep] = useState<AppStep>("style");
  const [styleId, setStyleId] = useState<string | null>(null);
  const [settings, setSettings] = useState<MockupSettings | null>(null);
  const [images, setImages] = useState<(UploadedImage | null)[]>([null]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function neededCount(id: string | null) {
    if (!id) return 1;
    const preset = MOCKUP_MAP[id];
    return preset ? screenshotCount(preset) : 1;
  }

  function resizeImages(
    current: (UploadedImage | null)[],
    count: number,
  ) {
    const next = emptySlots(count);
    for (let i = 0; i < count; i += 1) next[i] = current[i] ?? null;
    current.slice(count).forEach((image) => revokeImage(image));
    return next;
  }

  async function replaceImage(slot: number, file: File) {
    setError("");
    try {
      const next = await loadImageFile(file);
      setImages((current) => {
        revokeImage(current[slot] ?? null);
        return current.map((image, i) => (i === slot ? next : image));
      });
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not load that image.",
      );
    }
  }

  async function addFiles(files: File[], mode: "replace" | "fill") {
    const needed = neededCount(styleId);
    setError("");
    setNotice("");
    const supported = files.filter(isSupportedImage);
    if (!supported.length) {
      setError("Please upload PNG, JPG, or WEBP images.");
      return;
    }
    try {
      if (mode === "replace") {
        if (supported.length > needed) {
          setNotice(
            `This mockup only uses ${needed} ${needed === 1 ? "image" : "images"}. Extra files were skipped.`,
          );
        }
        const loaded = await loadImageFiles(supported.slice(0, needed));
        setImages((current) => {
          current.forEach((image) => revokeImage(image));
          const next = emptySlots(needed);
          loaded.forEach((image, index) => {
            next[index] = image;
          });
          return next;
        });
        return;
      }

      const empties: number[] = [];
      images.forEach((image, index) => {
        if (!image && index < needed) empties.push(index);
      });
      if (!empties.length) {
        setNotice(`This mockup already has ${needed} images.`);
        return;
      }
      if (supported.length > empties.length) {
        setNotice(
          `This mockup only uses ${needed} ${needed === 1 ? "image" : "images"}. Extra files were skipped.`,
        );
      }
      const loaded = await loadImageFiles(supported.slice(0, empties.length));
      setImages((current) => {
        const next = [...current];
        loaded.forEach((image, index) => {
          const slot = empties[index];
          revokeImage(next[slot] ?? null);
          next[slot] = image;
        });
        return next;
      });
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not load those images.",
      );
    }
  }

  function reorderImages(from: number, to: number) {
    setImages((current) => {
      if (to < 0 || to >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item ?? null);
      return next;
    });
  }

  function chooseStyle(id: string) {
    setStyleId(id);
    setSettings(settingsForStyle(id));
    setError("");
    setNotice("");
    setImages((current) => resizeImages(current, neededCount(id)));
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") !== "1") return;
    const requested = params.get("style");
    const demoStyle =
      requested && requested in MOCKUP_MAP ? requested : "macbook-front";
    let cancelled = false;

    (async () => {
      try {
        const toFile = async (path: string, name: string) => {
          const blob = await fetch(path).then((res) => res.blob());
          return new File([blob], name, { type: "image/png" });
        };
        const [file1, file2] = await Promise.all([
          toFile("/samples/website-1.png", "website-1.png"),
          toFile("/samples/website-2.png", "website-2.png"),
        ]);
        const next1 = await loadImageFile(file1);
        const next2 = await loadImageFile(file2);
        if (cancelled) {
          revokeImage(next1);
          revokeImage(next2);
          return;
        }
        const count = neededCount(demoStyle);
        const next = emptySlots(count);
        next[0] = next1;
        if (count > 1) next[1] = next2;
        else revokeImage(next2);
        setImages(next);
        setStyleId(demoStyle);
        setSettings(settingsForStyle(demoStyle));
        setStep("editor");
      } catch {
        if (!cancelled) setStep("style");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const needed = neededCount(styleId);
  const canEdit =
    Boolean(styleId && settings) &&
    images.slice(0, needed).every(Boolean);

  return (
    <div className="min-h-full bg-[#F4F5F7] text-neutral-900">
      {step === "style" ? (
        <StylePicker
          selected={styleId}
          onSelect={chooseStyle}
          onContinue={() => {
            if (styleId) setStep("upload");
          }}
        />
      ) : null}

      {step === "upload" && styleId ? (
        <UploadStep
          styleId={styleId}
          images={images}
          error={error}
          notice={notice}
          onFiles={addFiles}
          onReplace={replaceImage}
          onReorder={reorderImages}
          onBack={() => setStep("style")}
          onGenerate={() => {
            if (!images.slice(0, needed).every(Boolean)) return;
            setSettings(settingsForStyle(styleId));
            setStep("editor");
          }}
        />
      ) : null}

      {step === "editor" && canEdit && styleId && settings ? (
        <Editor
          styleId={styleId}
          settings={settings}
          images={images}
          onSettings={setSettings}
          onChangeStyle={chooseStyle}
          onReset={() => setSettings(settingsForStyle(styleId))}
          onBack={() => setStep("upload")}
        />
      ) : null}
    </div>
  );
}
