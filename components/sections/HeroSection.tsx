"use client";

import { useEffect, useRef } from "react";
import { createTimeline, stagger } from "animejs";
import Cxmodel from "@/components/ui/cxmodel";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Premium orchestrated timeline
    const tl = createTimeline({
      defaults: { ease: "outExpo", duration: 1200 },
    });

    // 1. The 3D Cascade Letter Reveal
    tl.add(".hero-letter", {
      translateY: [60, 0],
      rotateX: [-90, 0], // Flips the letters up mechanically
      opacity: [0, 1],
      delay: stagger(35), // 35ms ripple effect across the letters
    })
    // 2. The Orange Accent Line shoots out
    .add(".hero-line", {
      scaleX: [0, 1],
      transformOrigin: "0% 50%",
      duration: 1000,
      ease: "inOutQuart",
    }, "-=800")
    // 3. The Paragraph smoothly glides up
    .add(".hero-desc", {
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 1000,
    }, "-=800")
    // 4. The Button fades in
    .add(".hero-cta", {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 800,
    }, "-=800")
    // 5. The 3D Model fades into the scene
    .add(".hero-model", {
      opacity: [0, 1],
      translateX: [30, 0],
      duration: 1200,
      ease: "outQuart",
    }, "-=1200"); // Starts early, alongside the text

    // FIX: Wrap the cleanup in curly braces to explicitly return 'void'
    return () => {
      tl.pause();
    };
  }, []);

  // Helper function to render staggered letters while keeping spaces intact
  const renderLetters = (text: string) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="hero-letter inline-block opacity-0 origin-bottom"
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section ref={containerRef} className="min-h-screen relative flex flex-col justify-center px-6 md:px-16 lg:px-32 overflow-hidden">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Column: The Declarative Text */}
        <div className="max-w-3xl relative z-10 w-full">
          
          {/* Main Heading: Bold, 3D perspective applied for the letter flip */}
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] text-cosmo-ink font-serif font-bold mb-10 [perspective:1000px]">
            <span className="block" aria-label="Engineering">
              {renderLetters("Engineering")}
            </span>
            <span className="block" aria-label="What's Next.">
              {renderLetters("What's Next.")}
            </span>
          </h1>
          
          <div className="hero-line w-24 h-[2px] bg-cosmo-accent mb-10 scale-x-0"></div>
          
          <p className="hero-desc opacity-0 text-xl md:text-2xl text-cosmo-ink/80 font-sans leading-relaxed max-w-2xl mb-12">
            We turn complex business challenges into technology that works. 
            From new digital products to intelligent systems, infrastructure and security, 
            Cosmolix helps organizations build, transform and scale.
          </p>
          
          <button className="hero-cta opacity-0 group flex items-center gap-4 text-cosmo-ink font-sans text-lg border-b border-cosmo-ink/30 pb-2 hover:border-cosmo-accent transition-colors duration-300">
            <span className="group-hover:text-cosmo-accent transition-colors duration-300">
              Start a conversation
            </span>
            <span className="text-cosmo-accent group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </button>
        </div>

        {/* Right Column: The UI Component / Model */}
        <div className="hero-model opacity-0 hidden lg:flex w-full lg:w-1/2 h-[400px] xl:h-[500px] items-center justify-center relative z-0">
          <div className="w-full h-full relative">
            <Cxmodel />
          </div>
        </div>

      </div>
    </section>
  );
}