import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer"; // Import the Footer
import Preloader from "@/components/layout/Preloader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cosmolix | Engineering What's Next",
  description: "We turn complex business challenges into technology that works.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-cosmo-paper text-cosmo-ink flex flex-col min-h-screen">
        <Preloader/>
        <Navbar />
        {/* Main content area takes up remaining space to keep footer at bottom */}
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}