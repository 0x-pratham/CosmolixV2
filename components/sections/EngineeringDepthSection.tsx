"use client";

import React, { useEffect, useRef, useState } from "react";
import * as animeLib from 'animejs';
import { motion, AnimatePresence } from "framer-motion";

// -----------------------------------------------------------
// Isolated Anime.js Utilities
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
// Data Structure (Upgraded for High-Ticket Enterprise Clients)
// -----------------------------------------------------------
const CAPABILITIES = [
  {
    id: "software",
    category: "SOFTWARE ENGINEERING",
    description: "Architecting mission-critical, hyper-scalable enterprise platforms. We translate complex business logic into high-yield digital assets, accelerating time-to-market and aggressively driving revenue growth through unmatched technical execution.",
    items: ["Product Architecture", "Core Platforms", "API Ecosystems", "Enterprise Systems"],
    video: "/SoftwareEngineering.webm"
  },
  {
    id: "intelligence",
    category: "AI & INTELLIGENCE",
    description: "Integrating proprietary machine learning models and cognitive automation to unlock predictive alpha. We eliminate operational friction, compounding efficiency gains and transforming your proprietary data into an insurmountable competitive moat.",
    items: ["AI Infrastructure", "Machine Learning", "LLM Integration", "Workflow Automation"],
    video: "/Intelligence.webm"
  },
  {
    id: "cloud",
    category: "CLOUD & INFRASTRUCTURE",
    description: "Deploying highly resilient, fault-tolerant cloud ecosystems engineered for infinite scale and zero downtime. We optimize dynamic resource allocation to aggressively slash Total Cost of Ownership (TCO) while guaranteeing absolute performance reliability.",
    items: ["Cloud Architecture", "DevOps Pipelines", "Global Scalability", "Cost Optimization"],
    video: "/Cloud.webm"
  },
  {
    id: "security",
    category: "SECURITY",
    description: "Implementing proactive, military-grade zero-trust security architectures. We shield critical corporate IP, neutralize asymmetric threats, and ensure absolute operational continuity, mitigating existential enterprise risk in a volatile digital landscape.",
    items: ["Application Security", "Infrastructure Defense", "Risk Mitigation", "Resilience Planning"],
    video: "/Security.webm"
  },
  {
    id: "data",
    category: "DATA",
    description: "Constructing unified, high-velocity data pipelines that synthesize fragmented organizational siloes. We empower executive leadership with real-time, deterministic insights, directly accelerating bottom-line growth and strategic market positioning.",
    items: ["Data Platforms", "Predictive Analytics", "Decision Systems", "BI Architecture"],
    video: "/Data.webm"
  },
];

// -----------------------------------------------------------
// Main Component
// -----------------------------------------------------------
export default function EngineeringDepthSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeNode, setActiveNode] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          
          // Ultra-Premium 3D Typography Reveal
          runAnime(section.querySelectorAll('.eng-word'), {
            opacity: [0, 1],
            translateY: [40, 0],
            translateZ: [50, 0],
            rotateX: [60, 0],
            easing: 'easeOutElastic(1, .6)', // Complex elastic spring curve
            duration: 1500,
            delay: getStagger(80)
          });

          // 3D Unfolding Sequence for the Engineering Rows
          runAnime(section.querySelectorAll('.eng-row'), {
            opacity: [0, 1],
            translateY: [60, 0],
            rotateX: [15, 0],
            scale: [0.95, 1],
            easing: 'easeOutExpo',
            duration: 1600,
            delay: getStagger(150, { start: 400 })
          });

          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // FIX: Added 'as const' to the type property to satisfy Framer Motion's strict typing
  const editorialSpring = { type: "spring" as const, stiffness: 150, damping: 15, mass: 0.8 };

  return (
    <section ref={sectionRef} className="py-32 bg-cosmo-ink text-cosmo-paper border-t border-cosmo-paper/10 overflow-hidden perspective-[1200px]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* ------------------------------------------------------- */}
        {/* Editorial Header                                        */}
        {/* ------------------------------------------------------- */}
        <div className="mb-24 flex flex-col">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] tracking-tight perspective-[1000px]">
            <div className="flex gap-3 flex-wrap text-cosmo-paper">
              <span className="eng-word opacity-0 inline-block transform-origin-bottom">Deep</span>
              <span className="eng-word opacity-0 inline-block transform-origin-bottom">engineering.</span>
            </div>
            <div className="flex gap-3 flex-wrap text-cosmo-paper/40 mt-2">
              <span className="eng-word opacity-0 inline-block transform-origin-bottom">Business-first</span>
              <span className="eng-word opacity-0 inline-block transform-origin-bottom">thinking.</span>
            </div>
          </h2>
        </div>

        {/* ------------------------------------------------------- */}
        {/* The Alternating Engineering Index                       */}
        {/* ------------------------------------------------------- */}
        <div 
          className="flex flex-col border-t border-cosmo-paper/10"
          onMouseLeave={() => setActiveNode(null)}
        >
          {CAPABILITIES.map((cap, index) => {
            const isActive = activeNode === index;
            const isDimmed = activeNode !== null && !isActive;
            const isEven = index % 2 === 0;

            return (
              <div key={cap.id} className="eng-row opacity-0 border-b border-cosmo-paper/10 relative transform-origin-top">
                
                {/* Motion layer owns the interactive hover states */}
                <motion.div 
                  onMouseEnter={() => setActiveNode(index)}
                  onFocus={() => setActiveNode(index)}
                  onClick={() => setActiveNode(index)}
                  tabIndex={0}
                  animate={{ opacity: isDimmed ? 0.3 : 1 }}
                  transition={editorialSpring}
                  // Dynamic alternating layout: flex-row for even, flex-row-reverse for odd
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center py-16 gap-12 lg:gap-24 cursor-pointer relative z-10 focus:outline-none`}
                >
                  
                  {/* Text Side: Title & Description & Sub-items */}
                  <div className="w-full lg:w-1/2 flex flex-col">
                    <div className="flex flex-col mb-8">
                      <motion.h3 
                        animate={{ x: isActive ? 12 : 0 }}
                        transition={editorialSpring}
                        className="text-xl md:text-2xl lg:text-3xl font-serif tracking-tight text-cosmo-paper uppercase mb-4"
                      >
                        {cap.category}
                      </motion.h3>
                      
                      <motion.p
                        animate={{ 
                          x: isActive ? 8 : 0,
                          color: isActive ? "rgba(249, 246, 241, 0.95)" : "rgba(249, 246, 241, 0.5)"
                        }}
                        transition={editorialSpring}
                        className="font-sans text-sm md:text-base leading-relaxed max-w-lg"
                      >
                        {cap.description}
                      </motion.p>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-3 font-sans">
                      {cap.items.map((item, i) => (
                        <motion.span 
                          key={i} 
                          animate={{ 
                            x: isActive ? 6 : 0,
                            color: isActive ? "var(--color-cosmo-paper)" : "rgba(249, 246, 241, 0.4)"
                          }}
                          transition={{ ...editorialSpring, delay: i * 0.04 }}
                          className="text-sm tracking-wide relative inline-flex items-center font-medium"
                        >
                          {item}
                          {/* Left-to-Right Hover Underline with delay scaling */}
                          <motion.span 
                            initial={false}
                            animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                            transition={{ duration: 0.4, delay: isActive ? 0.1 + (i * 0.05) : 0, ease: "easeOut" }}
                            className="absolute -bottom-1 left-0 right-0 h-[1px] bg-cosmo-accent/80 origin-left"
                          />
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Visual Side: Dedicated Video Inspection Lens */}
                  <div className={`w-full lg:w-1/2 flex ${isEven ? 'lg:justify-end' : 'lg:justify-start'}`}>
                    {/* The outer box is completely invisible until hovered */}
                    <motion.div 
                      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.92 }}
                      transition={{ type: "spring", stiffness: 120, damping: 25 }}
                      className="w-full max-w-[380px] aspect-[4/5] bg-cosmo-ink border border-cosmo-paper/10 overflow-hidden flex items-center justify-center rounded-sm relative"
                    >
                      
                      {/* Idle Subtle Background Grid */}
                      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(var(--color-cosmo-paper) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                      
                      {/* Complex Crossfading & Clip-Path Video Engine */}
                      <AnimatePresence mode="popLayout">
                        {isActive && (
                          <motion.div
                            key={activeNode}
                            initial={{ opacity: 0, scale: 1.15, filter: "blur(12px)", clipPath: "inset(10% 10% 10% 10%)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0%)" }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(12px)", clipPath: "inset(10% 10% 10% 10%)", position: "absolute" }}
                            transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.5 }}
                            className="absolute inset-0 w-full h-full"
                          >
                            <video 
                              src={cap.video}
                              autoPlay 
                              loop 
                              muted 
                              playsInline 
                              // Unified Vibe Filter 1: Luminosity blending drops harsh saturation
                              className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-75"
                            />
                            
                            {/* Unified Vibe Filter 2: Deep inner shadow vignette to make it feel embedded */}
                            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(29,26,24,1)] z-10 pointer-events-none" />
                            
                            {/* Unified Vibe Filter 3: Subtle unified tint overlay */}
                            <div className="absolute inset-0 bg-cosmo-ink/30 mix-blend-overlay z-20 pointer-events-none" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  </div>

                </motion.div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}