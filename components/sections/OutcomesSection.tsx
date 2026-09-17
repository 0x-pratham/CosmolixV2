"use client";

/**
 * OutcomesSection.tsx
 * ---------------------------------------------------------------
 * - FIXED: Removed "03 / Outcomes" subheader for a cleaner, bolder look.
 * - UPGRADED: Completely replaced the generic list (numbers/lines/arrows) with a "Hollow-to-Solid" Typographic Morph interaction.
 * - UPGRADED: Expanded content layout into a high-end editorial format (Current State vs Engineered Outcome).
 * - Kept: Transformation Canvas architecture with sticky right column.
 * - Kept: Custom Framer Motion SVG visual narratives.
 * ---------------------------------------------------------------
 */

import React, { useEffect, useRef, useState } from "react";
import * as animeLib from 'animejs';
import { motion, AnimatePresence } from "framer-motion";

// -----------------------------------------------------------
// Universal Anime.js Wrapper (Crash-Proof)
// -----------------------------------------------------------
const runAnime = (targets: any, props: any) => {
  if (typeof (animeLib as any).animate === 'function') {
    (animeLib as any).animate(targets, props);
  } else {
    const anime = (animeLib as any).default || animeLib;
    if (typeof anime === 'function') {
      anime({ targets, ...props });
    }
  }
};

const getStagger = (value: number, options?: any) => {
  if (typeof (animeLib as any).stagger === 'function') {
    return (animeLib as any).stagger(value, options);
  }
  const anime = (animeLib as any).default || animeLib;
  if (anime && typeof anime.stagger === 'function') {
    return anime.stagger(value, options);
  }
  return value; 
};

// -----------------------------------------------------------
// Data Structure (Updated with Professional Business Language)
// -----------------------------------------------------------
const OUTCOMES = [
  {
    id: "build",
    title: "BUILD",
    problem: "Organizations often possess transformative, disruptive concepts that languish in the conceptual phase due to a lack of elite engineering execution and strategic technical vision.",
    solution: "We architect and engineer these concepts into market-defining, highly scalable flagship products, leveraging cutting-edge tech stacks to ensure long-term competitive advantage and rapid market penetration.",
    video: "/Build.mp4"
  },
  {
    id: "transform",
    title: "TRANSFORM",
    problem: "Technical debt and monolithic legacy infrastructures are severely restricting operational agility, increasing maintenance overhead, and preventing the integration of modern, data-driven capabilities.",
    solution: "We relentlessly modernize and refactor your entire infrastructure, executing seamless cloud migrations and microservices architectures that drastically reduce costs and future-proof your enterprise.",
    video: "/Transform.mp4"
  },
  {
    id: "automate",
    title: "AUTOMATE",
    problem: "Valuable human capital is continuously misallocated toward repetitive, high-volume operational workflows, leading to severe margin erosion, operational bottlenecks, and high error rates.",
    solution: "We deploy sophisticated, AI-driven automation ecosystems and intelligent, zero-touch workflows that eliminate redundancies, hyper-accelerate throughput, and liberate your workforce to focus on strategic growth.",
    video: "/Automate.mp4"
  },
  {
    id: "scale",
    title: "SCALE",
    problem: "Rapid organizational growth and sudden spikes in user demand are overwhelming your current system architecture, resulting in unacceptable latency, service degradation, and lost revenue opportunities.",
    solution: "We engineer hyper-elastic, high-availability, fault-tolerant ecosystems designed for infinite scale, guaranteeing continuous performance optimization and five-nines (99.999%) reliability under maximum load.",
    video: "/Scale.mp4"
  },
  {
    id: "protect",
    title: "PROTECT",
    problem: "In an era of sophisticated, state-sponsored cyber threats, traditional digital perimeters are increasingly porous, leaving sensitive corporate data and intellectual property highly vulnerable to catastrophic breaches.",
    solution: "We implement military-grade, zero-trust security frameworks and advanced cryptographic protocols, creating an impenetrable, proactive defense matrix that neutralizes threats before they materialize.",
    video: "/Protect.mp4"
  },
];

// -----------------------------------------------------------
// Main Component
// -----------------------------------------------------------
export default function OutcomesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Set initial state to null so all cards are minimized by default
  const [activeOutcome, setActiveOutcome] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          
          runAnime(section.querySelectorAll('.cx-outcome-header'), {
            opacity: [0, 1],
            translateY: [40, 0],
            easing: 'easeOutExpo',
            duration: 1500, // Slightly longer duration for a smoother reveal
            delay: getStagger(200)
          });

          runAnime(section.querySelectorAll('.cx-outcome-row'), {
            opacity: [0, 1],
            translateY: [20, 0],
            easing: 'easeOutExpo',
            duration: 1500,
            delay: getStagger(100, { start: 300 }) 
          });

          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // FIX: Added `as const` to the type properties
  // Premium Framer Motion Transition Configuration for text/layout
  const layoutSpringTransition = { type: "spring" as const, bounce: 0, duration: 0.8 };
  
  // Crazy Dynamic 3D Spring Configuration for Video Switching
  const dynamicVideoSpring = { type: "spring" as const, damping: 14, stiffness: 90, mass: 0.8 };

  // Crazy 3D animation variants for the videos
  const crazyVideoVariants = {
    initial: { opacity: 0, scale: 0.3, rotateX: 60, rotateY: -30, rotateZ: -15, filter: "blur(20px)" },
    animate: { opacity: 1, scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 1.6, rotateX: -60, rotateY: 30, rotateZ: 15, filter: "blur(25px)", position: "absolute" as const }
  };

  return (
    <section ref={sectionRef} className="py-32 px-6 md:px-12 lg:px-24 bg-cosmo-paper relative">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
        
        {/* ------------------------------------------------------- */}
        {/* Left Column: Philosophy & Interactive Narrative List    */}
        {/* ------------------------------------------------------- */}
        <div className="w-full lg:w-[55%] flex flex-col">
          
          {/* Minimal, Confident Header */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-cosmo-ink leading-[1.1] tracking-tight">
              <div className="cx-outcome-header opacity-0 text-cosmo-ink/40">We don't sell technology.</div>
              <div className="cx-outcome-header opacity-0 mt-2">We engineer outcomes.</div>
            </h2>
          </div>

          {/* Highly Innovative Transformation Narrative List */}
          <div 
            className="flex flex-col pt-4"
            onMouseLeave={() => setActiveOutcome(null)}
          >
            {OUTCOMES.map((outcome, index) => {
              const isActive = activeOutcome === index;

              return (
                <div 
                  key={outcome.id}
                  onMouseEnter={(e) => {
                    setActiveOutcome(index);
                    // Dynamically smooth-scrolls this specific card to the center of the viewport
                    e.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="cx-outcome-row opacity-0 flex flex-col py-4 md:py-6 cursor-pointer group"
                >
                  
                  {/* Brutalist Outline-to-Solid Title Morph */}
                  <motion.h3 
                    animate={{ 
                      x: isActive ? 24 : 0, 
                      opacity: isActive ? 1 : 0.4
                    }}
                    transition={layoutSpringTransition}
                    className={`text-5xl md:text-6xl lg:text-7xl font-serif tracking-tighter uppercase transition-colors duration-700 ${isActive ? 'text-cosmo-ink' : 'text-transparent'}`}
                    style={{ 
                      WebkitTextStroke: isActive ? '0px transparent' : '1px var(--color-cosmo-ink)'
                    }}
                  >
                    {outcome.title}
                  </motion.h3>

                  {/* Expanding Editorial Layout with Spring Physics */}
                  <motion.div 
                    initial={false}
                    animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ opacity: { duration: 0.4 }, height: layoutSpringTransition }}
                    className="overflow-hidden font-sans pl-6 md:pl-12"
                  >
                    <div className="pt-8 pb-4 flex flex-col gap-5 relative before:absolute before:left-0 before:top-8 before:bottom-4 before:w-[2px] before:bg-cosmo-accent/80">
                      
                      <div className="pl-6">
                        <span className="text-[10px] tracking-[0.2em] text-cosmo-ink/40 uppercase block mb-2 font-bold">Current State</span>
                        <p className="text-lg md:text-xl text-cosmo-ink/70 leading-snug">
                          {outcome.problem}
                        </p>
                      </div>
                      
                      <div className="pl-6 mt-2">
                        <span className="text-[10px] tracking-[0.2em] text-cosmo-accent uppercase block mb-2 font-bold">Engineered Outcome</span>
                        <p className="text-2xl md:text-3xl font-serif text-cosmo-ink leading-tight">
                          {outcome.solution}
                        </p>
                      </div>

                    </div>
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* Right Column: Visual Transformation Canvas              */}
        {/* ------------------------------------------------------- */}
        <div className="w-full lg:w-[45%] hidden lg:block relative">
          {/* Light Orange background with ultra-thin p-[2px] margin */}
          <div className="sticky top-32 w-[75%] max-w-[380px] mx-auto aspect-[3/4] bg-orange-200 border border-cosmo-ink/10 rounded-[2rem] flex flex-col items-center justify-center p-[2px] overflow-hidden">
            
            <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(var(--color-cosmo-ink) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            {/* Perspective wrapper to allow crazy 3D depth during transitions */}
            <div className="w-full h-full relative flex items-center justify-center z-10" style={{ perspective: "1200px" }}>
              <AnimatePresence mode="popLayout">
                {activeOutcome === null ? (
                  <motion.div
                    key="default-video"
                    variants={crazyVideoVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={dynamicVideoSpring}
                    className="w-full h-full flex items-center justify-center origin-center"
                  >
                    <video 
                      src="/StandAlone.mp4" 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      // Inner radius adjusted to perfectly nest inside the 2rem outer radius with 2px padding
                      className="w-full h-full object-cover rounded-[1.9rem] shadow-2xl"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`outcome-${activeOutcome}`}
                    variants={crazyVideoVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={dynamicVideoSpring}
                    className="w-full h-full flex items-center justify-center origin-center"
                  >
                    <video 
                      src={OUTCOMES[activeOutcome].video}
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover rounded-[1.9rem] shadow-2xl"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}