import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BootIntro from "@/components/intro/BootIntro";
import { site } from "@/lib/content";
import { SITE_URL } from "@/lib/url";

// JetBrains Mono (OFL), self-hosted from src/assets/fonts so builds never
// depend on reaching Google Fonts.
const mono = localFont({
  variable: "--font-jetbrains",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  src: [
    { path: "../assets/fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/jetbrains-mono-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../assets/fonts/jetbrains-mono-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
});

const description =
  "Wire Lion is a student-led electrical & computer engineering club at UCCS. Hands-on circuits, Arduino, soldering, digital systems and Verilog, for every skill level.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} · UCCS`,
    template: `%s · ${site.shortName}`,
  },
  description,
  applicationName: site.name,
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} · UCCS`,
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#07090D",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint:
 *  1. applies the saved theme (no flash of the wrong theme), and
 *  2. decides whether the boot intro plays, so the overlay is removed by CSS
 *     (`html.no-intro`) before anything is drawn when it shouldn't.
 */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('wl-theme');if(t==='black'||t==='cream')d.setAttribute('data-theme',t)}catch(e){}var q=location.search,force=/[?&]intro=1(&|$)/.test(q),dbg=/[?&]introDebug=1(&|$)/.test(q),seen=false,rm=false;try{seen=sessionStorage.getItem('wl-intro-seen')==='1'}catch(e){}try{rm=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}if(dbg){d.classList.add('intro-on','intro-debug')}else if(seen&&!force){d.classList.add('no-intro')}else{d.classList.add('intro-on');if(rm)d.classList.add('intro-rm')}if(d.classList.contains('intro-on')){var l=document.createElement('link');l.rel='preload';l.as='image';l.href='/brand/lion-head.png';document.head.appendChild(l)}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="cream" className={mono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <noscript>
          <style>{`#boot{display:none!important}html,body{overflow:auto!important}[data-lion-mark]{opacity:1!important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-3 focus:text-bg"
        >
          Skip to content
        </a>
        <BootIntro />
        <div className="flex min-h-screen flex-col">
          <Header wordmark={site.wordmark} />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
        </div>
        <div className="bezel" aria-hidden="true" />
      </body>
    </html>
  );
}
