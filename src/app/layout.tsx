import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "ProjectMock",
  description:
    "Place project screenshots into professional browser, laptop, desktop, phone, and tablet mockups.",
  icons: {
    icon: [
      {
        url: "/Favicon/abacktools-favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/Favicon/abacktools-favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/Favicon/abacktools-favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        url: "/Favicon/abacktools-favicon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/Favicon/abacktools-favicon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: {
      url: "/Favicon/abacktools-favicon-180x180.png",
      sizes: "180x180",
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F4F5F7] font-sans text-neutral-900">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
