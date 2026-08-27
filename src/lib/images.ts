import type { UploadedImage } from "./types";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const ALLOWED_EXTENSIONS = /\.(png|jpe?g|webp)$/i;

export function isSupportedImage(file: File): boolean {
  if (ALLOWED_TYPES.has(file.type)) return true;
  return ALLOWED_EXTENSIONS.test(file.name);
}

export function loadImageFile(file: File): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    if (!isSupportedImage(file)) {
      reject(new Error("Please upload a PNG, JPG, or WEBP image."));
      return;
    }

    const url = URL.createObjectURL(file);
    const element = new Image();
    element.decoding = "sync";
    element.onload = async () => {
      try {
        await element.decode();
      } catch {
        // decode() can reject on some browsers; the bitmap is still usable.
      }
      resolve({
        file,
        url,
        element,
        width: element.naturalWidth,
        height: element.naturalHeight,
      });
    };
    element.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image. Try another file."));
    };
    element.src = url;
  });
}

export async function loadImageFiles(files: File[]) {
  return Promise.all(files.map((file) => loadImageFile(file)));
}

export function revokeImage(image: UploadedImage | null) {
  if (image) URL.revokeObjectURL(image.url);
}
