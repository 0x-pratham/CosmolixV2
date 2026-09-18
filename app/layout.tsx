import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer"; 
import Preloader from "@/components/preloader/Preloader"; 
import "./globals.css";

const PRELOAD_GATE = `try {
  if (sessionStorage.getItem('cosmolix:registered')) {
    document.documentElement.setAttribute('data-preloaded', '');
  }
} catch (e) {}`;

export const metadata: Metadata = {
  title: "Cosmolix | Engineering What's Next",
  description: "We turn complex business challenges into technology that works.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Adding suppressHydrationWarning so React ignores the PRELOAD_GATE script's changes to the <html> tag
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRELOAD_GATE }} />
        <noscript><style>{`.pl-root { display: none; }`}</style></noscript>
      </head>
      <body className="antialiased bg-cosmo-paper text-cosmo-ink flex flex-col min-h-screen">
        <Preloader />
        <div data-preload-content tabIndex={-1} className="flex flex-col flex-grow">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}