import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Conway's Game of Life - Disco Edition",
  description: "An interactive Conway's Game of Life simulation on a 3D disco floor using Three.js with glowing neon cells",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["Conway's Game of Life", "cellular automaton", "disco", "Three.js", "3D", "interactive", "simulation", "neon"],
  robots: "index, follow",
  metadataBase: new URL("https://conways-game-of-life-disco.vercel.app"),
  openGraph: {
    title: "Conway's Game of Life - Disco Edition",
    description: "An interactive 3D cellular automaton simulation with disco effects",
    type: "website",
    images: [
      {
        url: "/env-map.jpg",
        width: 1200,
        height: 630,
        alt: "Conway's Game of Life - Disco Edition",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="w-full min-h-screen bg-black">{children}</main>
      </body>
    </html>
  );
}
