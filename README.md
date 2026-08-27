# ProjectMock

Turn project screenshots into polished device mockups.

ProjectMock is a browser-based mockup generator. Choose a template, upload your screenshots, and download a presentation-ready image: browser windows, laptops, desktops, phones, tablets, or multi-device layouts. Your screenshots stay pixel-accurate. The app only scales, positions, clips, and composites them.

It started as a way to present work on the Paruah Systems site without paying for a mockup service or building every frame in Photoshop.

## Why it exists

While building the Paruah Systems website, I needed a better way to show projects. The good mockup tools were paid or subscription-based. The free ones did not fit the workflow.

So I built one. ProjectMock began as an internal tool and grew into a dedicated generator.

## Features

- **Browser mockups:** Chrome, Safari, and minimal window chrome
- **Laptop and MacBook mockups:** Open laptops with lid, keyboard, trackpad, and hinge
- **Desktop and iMac mockups:** Large-screen presentations, including desk setups
- **Phone and tablet mockups:** Portrait, landscape, and multi-phone layouts
- **Multi-device compositions:** Laptop + phone, monitor + keyboard, and other combinations
- **Multi-image upload:** Pick every required screenshot at once; they are assigned to the right screens
- **Live preview:** The generate page shows the exact template you selected
- **Editor:** Change background, drag devices, adjust scale, position, rotation, and shadow
- **Switch templates:** Change mockup after upload without losing your screenshots
- **Export:** Download 3200 × 2000 as PNG, JPEG, or WebP

## How it works

```text
Choose a mockup
      ↓
Upload the screenshots that layout needs
      ↓
Generate
      ↓
Tweak layout if you want
      ↓
Download PNG, JPEG, or WebP
```

If a mockup needs three images, select all three in one file picker. They are assigned to the matching screens, and you can reorder or replace them before generating.

## Run locally

Requires Node 22 (see `.nvmrc`).

```bash
nvm use
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Built with

- Next.js
- React
- TypeScript
- Tailwind CSS

## The goal

ProjectMock is not a replacement for professional design software. It solves a simpler problem:

> I have a great project. I just want an easy way to present it beautifully.

Instead of drawing device frames, cropping screenshots, and adding shadows by hand, ProjectMock handles the presentation layer.

## Status

The core workflow is working. More templates and compositions may come later.

---

Built for Paruah Systems, with curiosity, code, and a little help from Cursor.
