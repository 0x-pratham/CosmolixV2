"use client";

/**
 * ProblemSection.tsx
 * ---------------------------------------------------------------
 * - FIXED: Removed the top-right "Close" button. The modal now relies entirely on seamless hover-out.
 * - FIXED: Removed all scrollbars (`overflow-y-auto`) from the expanded modal.
 * - FIXED: Optimized typography sizing, spacing, and padding to ensure all content perfectly fits on-screen without scrolling.
 * - Kept: High-converting B2B agency text.
 * - Kept: Continuous looping videos (.webm) inside the modal.
 * - Kept: Cinematic 1.2s Zoom Transition.
 * - Kept: Image margins are razor-thin (inset-1) with Light/Dark Orange background.
 * ---------------------------------------------------------------
 */

import React, { useEffect, useRef, useState } from "react";
import * as animeLib from 'animejs';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

// -----------------------------------------------------------
// Universal Anime.js Wrapper
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
// High-Converting B2B Data Structure
// -----------------------------------------------------------
interface Challenge {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  problem: string;
  impact: string[];
  helps: string[];
  visual: string; 
  outerVisual: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: "legacy",
    num: "01",
    title: "Legacy Modernization",
    subtitle: "Transform technical debt into digital agility.",
    problem: "Outdated infrastructure doesn't just slow down your engineering—it bleeds revenue. We architect modern, scalable ecosystems that empower your business to move at the speed of the market.",
    impact: ["Sluggish deployment rates", "Exorbitant maintenance costs", "Rigid, inflexible architecture"],
    helps: ["Cloud-Native Migration", "API-First Refactoring", "Automated CI/CD Workflows"],
    visual: "/LegacySystems.webm",
    outerVisual: "/card1.jpeg"
  },
  {
    id: "manual",
    num: "02",
    title: "Intelligent Automation",
    subtitle: "Free your human capital from robotic work.",
    problem: "Your top talent is drowning in repetitive operational friction. By deploying targeted AI and intelligent scripts, we reclaim thousands of wasted hours, letting your team focus on high-value innovation.",
    impact: ["High human error rates", "Wasted engineering talent", "Operational bottlenecks"],
    helps: ["Custom AI Workflows", "Process Optimization", "Robotic Process Automation"],
    visual: "/ManualOperations.webm",
    outerVisual: "/card2.jpeg"
  },
  {
    id: "security",
    num: "03",
    title: "Zero-Trust Security",
    subtitle: "Bulletproof your digital perimeter.",
    problem: "As your digital footprint expands, traditional security boundaries dissolve. We implement robust, military-grade architectures to ensure your sensitive data is protected against sophisticated modern threats.",
    impact: ["Critical data breaches", "Regulatory non-compliance", "Irreparable loss of trust"],
    helps: ["Zero-Trust Architectures", "End-to-End Encryption", "Continuous Compliance Auditing"],
    visual: "/SecurityGaps.webm",
    outerVisual: "/card3.jpeg"
  },
  {
    id: "scaling",
    num: "04",
    title: "Elastic Scalability",
    subtitle: "Architecture that grows effortlessly with your ambition.",
    problem: "Monolithic systems crumble under exponential growth. We decompose rigid backends into agile, microservice-driven architectures that scale elastically without downtime or performance degradation.",
    impact: ["System outages under load", "Lost transactional revenue", "Severely degraded UX"],
    helps: ["Microservices Decomposition", "Kubernetes Orchestration", "Global Load Balancing"],
    visual: "/ScalingProblems.webm",
    outerVisual: "/card4.jpeg"
  },
  {
    id: "data",
    num: "05",
    title: "Unified Intelligence",
    subtitle: "Turn fragmented data into actionable foresight.",
    problem: "Your most valuable asset—data—is trapped in isolated silos. We build centralized, high-velocity data pipelines that feed predictive analytics and machine learning models in real-time.",
    impact: ["Blind strategic decisions", "Stale, retrospective reporting", "Inability to leverage AI"],
    helps: ["Enterprise Data Lakes", "Real-Time Sync Pipelines", "Predictive Analytics Models"],
    visual: "/DisconnectedData.webm",
    outerVisual: "/card5.jpeg"
  },
  {
    id: "ideas",
    num: "06",
    title: "Accelerated Innovation",
    subtitle: "From boardroom concept to market launch. Fast.",
    problem: "Brilliant ideas die waiting for engineering bandwidth. Cosmolix provides elite, agile development pods that integrate seamlessly with your team to rapidly prototype and launch your next flagship product.",
    impact: ["Missed market opportunities", "Internal team stagnation", "Competitors outpacing you"],
    helps: ["Rapid MVP Development", "Elite Staff Augmentation", "Agile Engineering Pods"],
    visual: "/IdeasStuck.webm",
    outerVisual: "/card6.jpeg"
  }
];

// -----------------------------------------------------------
// Compact Architectural Bento Card
// -----------------------------------------------------------
const ChallengeCard = ({ challenge, index, onHover }: { challenge: Challenge; index: number; onHover: () => void }) => {
  
  const getBentoClass = (idx: number) => {
    switch(idx) {
      case 0: return "md:col-span-2 md:row-span-2 h-[220px] md:h-[284px]"; 
      case 1: return "md:col-span-1 h-[130px]";              
      case 2: return "md:col-span-1 h-[130px]";              
      case 3: return "md:col-span-1 h-[130px]";              
      case 4: return "md:col-span-1 h-[130px]";             
      case 5: return "md:col-span-1 h-[130px]";             
      default: return "md:col-span-1 h-[130px]";
    }
  };

  return (
    <motion.div
      layoutId={`card-container-${challenge.id}`}
      onMouseEnter={onHover}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        layout: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }, 
        default: { duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] } 
      }}
      className={`cx-reveal-card w-full bg-cosmo-accent/30 cursor-pointer flex flex-col justify-end hover:shadow-2xl rounded-[2rem] md:rounded-[2.5rem] group relative overflow-hidden ${getBentoClass(index)}`}
    >
      
      {/* Inner Image with ULTRA-THIN Margins (inset-1) */}
      <div className="absolute inset-1 z-0 overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] bg-cosmo-ink/80 pointer-events-none">
        <motion.img 
          layoutId={`card-img-${challenge.id}`}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          src={challenge.outerVisual} 
          alt={challenge.title}
          className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
      </div>

      {/* Text Content placed perfectly ON the image layer */}
      <div className="relative z-10 flex flex-col w-full px-5 pb-5 md:px-6 md:pb-6 pointer-events-none">
        <motion.h3 
          layoutId={`card-title-${challenge.id}`}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-fit text-xl md:text-2xl font-serif text-white leading-[1.1] mb-2 pb-1 drop-shadow-md"
        >
          {challenge.title}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center z-20" />
        </motion.h3>
        
        <p className="font-sans text-xs md:text-sm text-white/90 line-clamp-2 drop-shadow-md">
          {challenge.subtitle}
        </p>
      </div>
    </motion.div>
  );
};

// -----------------------------------------------------------
// Main Component
// -----------------------------------------------------------
export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedChallenge = CHALLENGES.find(c => c.id === selectedId);

  // Modal Parallax Engine
  const modalX = useMotionValue(0);
  const modalY = useMotionValue(0);
  const modalSpringX = useSpring(modalX, { stiffness: 100, damping: 30 });
  const modalSpringY = useSpring(modalY, { stiffness: 100, damping: 30 });
  
  const modalImgX = useTransform(modalSpringX, [-0.5, 0.5], [-25, 25]);
  const modalImgY = useTransform(modalSpringY, [-0.5, 0.5], [-25, 25]);
  
  const modalTextX = useTransform(modalSpringX, [-0.5, 0.5], [15, -15]);
  const modalTextY = useTransform(modalSpringY, [-0.5, 0.5], [15, -15]);

  const handleModalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    modalX.set(e.clientX / rect.width - 0.5);
    modalY.set(e.clientY / rect.height - 0.5);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnime(section.querySelectorAll('.cx-reveal-text'), {
            opacity: [0, 1],
            translateY: [30, 0],
            easing: 'easeOutCubic',
            duration: 1000,
            delay: getStagger(150)
          });
          runAnime(section.querySelectorAll('.cx-reveal-conclusion'), {
            opacity: [0, 1],
            translateX: [-20, 0],
            easing: 'easeOutExpo',
            duration: 1000,
            delay: 800
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 } 
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedId) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedId]);

  return (
    <section ref={sectionRef} className="py-32 bg-cosmo-paper overflow-hidden relative">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10">
        
        {/* Strong B2B Entrance Header */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-20 tracking-tight max-w-4xl font-serif text-cosmo-ink">
          <div className="cx-reveal-text opacity-0">Your vision is ambitious.</div>
          <div className="cx-reveal-text text-cosmo-ink/40 opacity-0">Our engineering makes it inevitable.</div>
        </h2>

        {/* Compact 3x3 Architectural Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 relative z-20">
          {CHALLENGES.map((challenge, i) => (
            <ChallengeCard 
              key={challenge.id} 
              index={i}
              challenge={challenge} 
              onHover={() => setSelectedId(challenge.id)} 
            />
          ))}
        </div>

        {/* Conclusion */}
        <div className="cx-reveal-conclusion opacity-0 pl-6 md:pl-8 border-l-2 border-cosmo-accent max-w-2xl">
          <p className="text-2xl md:text-3xl text-cosmo-ink italic font-serif">
            Welcome to Cosmolix. Your elite engineering partner.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------- */}
      {/* Asymmetric Expanded Detail View (Framer Motion LayoutId) */}
      {/* ------------------------------------------------------- */}
      <AnimatePresence>
        {selectedId && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-0 md:p-8 lg:p-12 pointer-events-none">
            
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedId(null)}
              onMouseEnter={() => setSelectedId(null)} 
              className="absolute inset-0 bg-cosmo-ink/80 backdrop-blur-xl pointer-events-auto cursor-pointer"
            />

            {/* Cinematic Modal Container - Removed overflow-y-auto so everything perfectly fits without scrolling */}
            <motion.div 
              layoutId={`card-container-${selectedId}`}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full max-w-[1400px] bg-cosmo-ink border border-cosmo-paper/10 text-cosmo-paper flex flex-col lg:flex-row overflow-hidden pointer-events-auto shadow-2xl origin-center rounded-[2rem]"
              onMouseMove={handleModalMouseMove}
              onMouseLeave={() => setSelectedId(null)} 
            >
              
              {/* LEFT COLUMN (45%): Internal Visual WITH Parallax */}
              <div className="w-full lg:w-[45%] h-[50vh] lg:h-full relative flex flex-col justify-between p-8 md:p-12 overflow-hidden bg-black pointer-events-none">
                <motion.div 
                  className="absolute inset-0 z-0"
                >
                  <motion.video 
                    layoutId={`card-img-${selectedId}`}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    src={CHALLENGES.find(c => c.id === selectedId)?.visual} 
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ x: modalImgX, y: modalImgY, scale: 1.15 }}
                    className="w-full h-full object-cover opacity-60 mix-blend-screen" 
                  />
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-gradient-to-t from-cosmo-ink via-cosmo-ink/50 to-transparent lg:bg-gradient-to-r" 
                  />
                </motion.div>

                {/* Left Column Text Base */}
                <motion.div style={{ x: modalTextX, y: modalTextY }} className="relative z-10 mt-auto drop-shadow-2xl">
                  <motion.span 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-xs tracking-[0.2em] text-cosmo-accent block mb-4 font-sans hidden"
                  />
                  {/* Optimized sizing to prevent crowding */}
                  <motion.h3 
                    layoutId={`card-title-${selectedId}`} 
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl md:text-4xl lg:text-5xl text-cosmo-paper leading-[1.1] mb-4 font-serif"
                  >
                    {CHALLENGES.find(c => c.id === selectedId)?.title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-base md:text-lg text-cosmo-paper/80 font-sans"
                  >
                    {CHALLENGES.find(c => c.id === selectedId)?.subtitle}
                  </motion.p>
                </motion.div>
              </div>

              {/* RIGHT COLUMN (55%): Optimized Spacing to fit fully without scrolling */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="w-full lg:w-[55%] h-full bg-cosmo-ink p-6 md:p-10 lg:p-14 flex flex-col justify-center relative z-10"
              >
                
                {/* The Problem */}
                <div className="mb-8 md:mb-10">
                  <h4 className="text-[10px] md:text-xs tracking-[0.2em] text-cosmo-paper/40 uppercase mb-4 border-b border-cosmo-paper/10 pb-3 font-sans">The Core Challenge</h4>
                  {/* Reduced text sizes slightly to fit neatly into the view block */}
                  <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-cosmo-paper font-serif">
                    {CHALLENGES.find(c => c.id === selectedId)?.problem}
                  </p>
                </div>

                {/* Grid for Impact and Helps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div>
                    <h4 className="text-[10px] md:text-xs tracking-[0.2em] text-cosmo-paper/40 uppercase mb-4 border-b border-cosmo-paper/10 pb-3 font-sans">Business Impact</h4>
                    {/* Tighter list spacing */}
                    <ul className="space-y-3 md:space-y-4">
                      {CHALLENGES.find(c => c.id === selectedId)?.impact.map((item, i) => (
                        <li key={i} className="text-cosmo-paper/80 flex items-start font-sans text-sm md:text-base">
                          <span className="text-cosmo-accent mr-3 mt-1.5 text-[8px]">■</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[10px] md:text-xs tracking-[0.2em] text-cosmo-paper/40 uppercase mb-4 border-b border-cosmo-paper/10 pb-3 font-sans">The Cosmolix Solution</h4>
                    <ul className="space-y-3 md:space-y-4">
                      {CHALLENGES.find(c => c.id === selectedId)?.helps.map((item, i) => (
                        <li key={i} className="text-cosmo-paper flex items-start font-sans text-sm md:text-base">
                          <span className="text-[10px] text-cosmo-accent mr-3 mt-1 font-bold tracking-widest">0{i+1}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}