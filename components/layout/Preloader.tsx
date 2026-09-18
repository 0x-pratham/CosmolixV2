"use client";

import React, { useEffect, useState, useRef } from "react";
import * as animeLib from "animejs";

// -----------------------------------------------------------
// Anime.js Wrapper (Crash-Proof for Next.js SSR)
// -----------------------------------------------------------
const getAnime = () => {
  let animeFn = animeLib as any;
  // Deep unwrap to handle Webpack/Next.js ESM interop nesting issues
  while (animeFn && typeof animeFn !== "function" && animeFn.default) {
    animeFn = animeFn.default;
  }
  return animeFn;
};

// -----------------------------------------------------------
// Semantic Loading States
// -----------------------------------------------------------
const STAGES = [
  { threshold: 0, label: "INITIALIZING", bg: "SYSTEMS", index: "00" },
  { threshold: 20, label: "SOFTWARE", bg: "SOFTWARE", index: "01" },
  { threshold: 40, label: "INTELLIGENCE", bg: "INTELLIGENCE", index: "02" },
  { threshold: 60, label: "INFRASTRUCTURE", bg: "INFRASTRUCTURE", index: "03" },
  { threshold: 80, label: "SECURITY", bg: "SECURITY", index: "04" },
  { threshold: 95, label: "DATA", bg: "DATA", index: "05" },
  { threshold: 100, label: "SYSTEM READY", bg: "COSMOLIX", index: "05" },
];

export default function Preloader() {
  const [visualProgress, setVisualProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(true);
  
  const actualProgress = useRef(0);
  const isReady = useRef(false);
  const animationTriggered = useRef(false);
  
  const currentStage = STAGES.slice().reverse().find(s => visualProgress >= s.threshold) || STAGES[0];

  useEffect(() => {
    // -------------------------------------------------------
    // Scroll Lock with Layout Shift Prevention
    // -------------------------------------------------------
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingRight;
    
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // -------------------------------------------------------
    // Honest Progress Simulation (Chasing Actual Load)
    // -------------------------------------------------------
    const simInterval = setInterval(() => {
      if (actualProgress.current < 90) {
        // Linear, predictable growth, no random jumps
        actualProgress.current += 3;
      }
    }, 100);

    const markComplete = () => {
      clearInterval(simInterval);
      actualProgress.current = 100;
      isReady.current = true;
    };

    if (document.readyState === "complete") {
      markComplete();
    } else {
      window.addEventListener("load", markComplete);
    }

    // Visual Progress Interpolation Loop
    let raf: number;
    const updateVisual = () => {
      setVisualProgress((prev) => {
        if (prev < actualProgress.current) {
          const next = Math.min(prev + 0.8, actualProgress.current);
          
          // Trigger Exit Sequence precisely at 100
          if (next >= 100 && !animationTriggered.current) {
            animationTriggered.current = true;
            triggerExitSequence();
          }
          return next;
        }
        return prev;
      });
      raf = requestAnimationFrame(updateVisual);
    };
    raf = requestAnimationFrame(updateVisual);

    // -------------------------------------------------------
    // Initial SVG Architecture Drawing
    // -------------------------------------------------------
    const anime = getAnime();
    
    // Safety check ensuring we actually unwrapped a function
    if (typeof anime === "function") {
      anime({
        targets: ".sys-line",
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: "easeInOutSine",
        duration: 1500,
        delay: anime.stagger ? anime.stagger(150) : 0,
      });
      anime({
        targets: ".sys-node",
        opacity: [0, 1],
        scale: [0, 1],
        easing: "easeOutExpo",
        duration: 1000,
        delay: anime.stagger ? anime.stagger(150, { start: 600 }) : 0,
      });
    }

    return () => {
      clearInterval(simInterval);
      window.removeEventListener("load", markComplete);
      cancelAnimationFrame(raf);
      
      // Cleanup DOM
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
    };
  }, []);

  // -------------------------------------------------------
  // The Signature Exit Choreography
  // -------------------------------------------------------
  const triggerExitSequence = () => {
    const anime = getAnime();
    
    // Failsafe: if anime failed to resolve, just reveal the site instantly
    if (typeof anime !== "function" || typeof anime.timeline !== "function") {
      setIsMounted(false);
      return;
    }

    const tl = anime.timeline({
      easing: "cubicBezier(0.76, 0, 0.24, 1)",
    });

    // 1. Pause for effect (System Ready display)
    // 2. Collapse the SVG Architecture inward
    tl.add({
      targets: ".sys-layer",
      scale: 0,
      opacity: 0,
      rotateZ: 45,
      duration: 800,
      delay: 400, // The silence pause
    })
    // 3. Fade out the typography and UI
    .add({
      targets: ".preloader-ui",
      opacity: 0,
      duration: 400,
    }, "-=600")
    // 4. The Grand Split-Screen Reveal
    .add({
      targets: ".preloader-panel-top",
      translateY: "-100%",
      duration: 1200,
    }, "-=200")
    .add({
      targets: ".preloader-panel-bottom",
      translateY: "100%",
      duration: 1200,
      complete: () => {
        setIsMounted(false); // Unmount entirely
      }
    }, "-=1200");
  };

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none select-none" aria-hidden="true">
      
      {/* ------------------------------------------------------- */}
      {/* The Split Panels (Solid Background)                     */}
      {/* ------------------------------------------------------- */}
      <div className="preloader-panel-top absolute top-0 left-0 w-full h-1/2 bg-cosmo-ink origin-top" />
      <div className="preloader-panel-bottom absolute bottom-0 left-0 w-full h-1/2 bg-cosmo-ink origin-bottom" />

      {/* ------------------------------------------------------- */}
      {/* Content Wrapper                                       */}
      {/* ------------------------------------------------------- */}
      <div className="absolute inset-0 flex flex-col items-center justify-between text-cosmo-paper px-6 py-12 md:py-16">
        
        {/* Massive Background Typography */}
        <div className="preloader-ui absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none">
          <span className="text-[12vw] font-serif tracking-tighter opacity-[0.03] whitespace-nowrap">
            {currentStage.bg}
          </span>
        </div>

        {/* TOP: Branding */}
        <div className="preloader-ui w-full max-w-[1400px] flex justify-between items-start text-xs tracking-[0.2em] uppercase opacity-50 font-sans z-10">
          <span>Cosmolix</span>
          <span>Engineering / 05</span>
        </div>

        {/* CENTER: SVG Engineering Architecture */}
        <div className="sys-layer relative w-full max-w-[600px] aspect-square flex items-center justify-center z-10">
          <svg viewBox="0 0 1000 1000" className="w-full h-full overflow-visible">
            {/* Connection Lines */}
            <g stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" fill="none">
              <line className="sys-line" x1="500" y1="500" x2="500" y2="150" />
              <line className="sys-line" x1="500" y1="500" x2="800" y2="350" />
              <line className="sys-line" x1="500" y1="500" x2="800" y2="650" />
              <line className="sys-line" x1="500" y1="500" x2="500" y2="850" />
              <line className="sys-line" x1="500" y1="500" x2="200" y2="650" />
              <line className="sys-line" x1="500" y1="500" x2="200" y2="350" />
              
              {/* Outer Ring Connectors */}
              <line className="sys-line" x1="500" y1="150" x2="800" y2="350" />
              <line className="sys-line" x1="800" y1="350" x2="800" y2="650" />
              <line className="sys-line" x1="800" y1="650" x2="500" y2="850" />
              <line className="sys-line" x1="500" y1="850" x2="200" y2="650" />
              <line className="sys-line" x1="200" y1="650" x2="200" y2="350" />
              <line className="sys-line" x1="200" y1="350" x2="500" y2="150" />
            </g>

            {/* Nodes */}
            <g fill="currentColor">
              {/* Center Core */}
              <circle className="sys-node" cx="500" cy="500" r="8" />
              <circle className="sys-node" cx="500" cy="500" r="24" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
              
              {/* Perimeter Nodes */}
              <circle className="sys-node" cx="500" cy="150" r="4" />
              <circle className="sys-node" cx="800" cy="350" r="4" />
              <circle className="sys-node" cx="800" cy="650" r="4" />
              <circle className="sys-node" cx="500" cy="850" r="4" />
              <circle className="sys-node" cx="200" cy="650" r="4" />
              <circle className="sys-node" cx="200" cy="350" r="4" />
            </g>
          </svg>

          {/* Center Stage Text Indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-12 flex flex-col items-center">
             <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-sans mb-1">System State</span>
             <span className="text-sm tracking-widest font-sans uppercase font-medium">{currentStage.label}</span>
          </div>
        </div>

        {/* BOTTOM: Progress Tracking */}
        <div className="preloader-ui w-full max-w-[1400px] flex flex-col gap-6 z-10">
          
          <div className="flex justify-between items-end font-sans">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 mb-1">Architecture</span>
              <span className="text-sm tracking-widest uppercase">{currentStage.index} / 05</span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 mb-1">Assembly</span>
              <span className="text-sm tracking-widest">{Math.floor(visualProgress)}%</span>
            </div>
          </div>
          
          {/* Engineering Progress Line */}
          <div className="w-full h-[1px] bg-cosmo-paper/20 relative">
            <div 
              className="absolute top-0 left-0 bottom-0 bg-cosmo-paper transition-all duration-100 ease-linear"
              style={{ width: `${visualProgress}%` }}
            />
          </div>

        </div>
      </div>

    </div>
  );
}