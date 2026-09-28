import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Space_Grotesk, Plus_Jakarta_Sans, Fraunces, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://awa.ai"),
  title: {
    default: "AWA.AI — Cinematic AI Blueprints, Prompts & Web Templates",
    template: "%s | AWA.AI",
  },
  description: "Browse curated, production-tested AI prompts, cinematic website blueprints, and models for Midjourney, Claude, v0, and FLUX.",
  keywords: ["AI prompts", "Midjourney prompts", "v0 templates", "AI website blueprints", "Claude 3.7", "AI Studio", "Next.js templates"],
  authors: [{ name: "AWA.AI Team" }],
  openGraph: {
    title: "AWA.AI — Cinematic AI Blueprints, Prompts & Web Templates",
    description: "Browse curated, production-tested AI prompts and panoramic capsule blueprints for designers and developers.",
    url: "https://awa.ai",
    siteName: "AWA.AI",
    images: [
      {
        url: "/cyber_dashboard.jpg",
        width: 1200,
        height: 630,
        alt: "AWA.AI Cinematic Blueprint Suite",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AWA.AI — Cinematic AI Blueprints",
    description: "Curated AI prompts, panoramic website blueprints & design telemetry.",
    images: ["/cyber_dashboard.jpg"],
  },
  icons: {
    icon: "/awa-logo.svg",
    shortcut: "/awa-logo.svg",
    apple: "/awa-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var t = localStorage.getItem("awa_theme") || "dark";
                document.documentElement.classList.remove("dark", "light");
                document.documentElement.classList.add(t);
                document.documentElement.style.colorScheme = t;
              } catch (e) {}
            })();`,
          }}
        />
        <link rel="icon" type="image/svg+xml" href="/awa-logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${plusJakartaSans.variable} ${fraunces.variable} ${ibmPlexMono.variable} antialiased min-h-screen flex flex-col justify-between bg-page-bg text-page-text transition-colors duration-300`}
      >
        <ThemeProvider>
          <AuthProvider>
            <div>
              <Header />
              {children}
            </div>
            <Footer />
            <ThemeToggle />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
