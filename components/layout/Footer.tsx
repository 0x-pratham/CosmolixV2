"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as animeLib from 'animejs';
import { motion } from "framer-motion";

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
// Static Route Data Structure
// -----------------------------------------------------------
const NAVIGATION = {
  explore: [
    { label: "Capabilities", href: "#capabilities" },
    { label: "Approach", href: "#approach" },
    { label: "Work", href: "#work" },
    { label: "Labs", href: "#labs" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Journal", href: "#journal" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ],
  connect: [
    { label: "X", href: "#x" },
    { label: "LinkedIn", href: "#linkedin" },
    { label: "Instagram", href: "#instagram" },
  ],
  legal: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
    { label: "Security", href: "#security" },
    { label: "Cookies", href: "#cookies" },
  ],
};

// -----------------------------------------------------------
// Magnetic CTA Component (Motion) - Minimal Effect
// -----------------------------------------------------------
const MagneticCTA = ({ href, children }: { href: string, children: React.ReactNode }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    // Reduced to 0.05 for a very minimal magnetic pull
    setPosition({ x: middleX * 0.05, y: middleY * 0.05 });
  };

  const reset = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      animate={{ x: position.x, y: position.y, scale: isHovered ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      <Link 
        ref={ref}
        href={href}
        onMouseMove={handleMouse}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={reset}
        className="group relative inline-flex items-center gap-6 text-cosmo-ink font-sans text-sm md:text-base tracking-[0.15em] uppercase py-3"
      >
        <span className="relative z-10 transition-colors duration-300 group-hover:text-cosmo-accent">
          {children}
        </span>
        
        {/* Animated Arrow */}
        <motion.span 
          animate={{ 
            x: isHovered ? 8 : 0, 
            y: isHovered ? -1 : 0, 
            color: isHovered ? "var(--color-cosmo-accent)" : "var(--color-cosmo-ink)" 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="relative z-10"
        >
          ↗
        </motion.span>

        {/* Editorial Left-to-Right Underline */}
        <motion.span 
          initial={false}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-cosmo-accent origin-left"
        />
        {/* Idle Underline */}
        <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-cosmo-ink/20" />
      </Link>
    </motion.div>
  );
};

// -----------------------------------------------------------
// Main Footer Component
// -----------------------------------------------------------
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  // States for the minimal interactive hero area parallax
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          
          // 1. Eyebrow
          runAnime(footer.querySelectorAll('.footer-eyebrow'), {
            opacity: [0, 1],
            translateY: [10, 0],
            easing: 'easeOutCubic',
            duration: 1000,
            delay: 150
          });

          // 2. Headline Entrance
          runAnime(footer.querySelectorAll('.footer-word'), {
            opacity: [0, 1],
            translateY: [40, 0], 
            translateZ: [50, 0], 
            rotateX: [-30, 0], 
            scale: [0.8, 1], 
            easing: 'easeOutElastic(1, .8)', 
            duration: 1600,
            delay: getStagger(60, { start: 200 })
          });

          // 3. CTA
          runAnime(footer.querySelectorAll('.footer-cta'), {
            opacity: [0, 1],
            translateY: [20, 0],
            easing: 'easeOutElastic(1, .8)',
            duration: 1500,
            delay: 800
          });

          // 4. Navigation Columns
          runAnime(footer.querySelectorAll('.footer-col'), {
            opacity: [0, 1],
            translateY: [15, 0],
            easing: 'easeOutCubic',
            duration: 1000,
            delay: getStagger(100, { start: 1000 })
          });

          // 5. Legal
          runAnime(footer.querySelectorAll('.footer-legal'), {
            opacity: [0, 1],
            easing: 'easeOutCubic',
            duration: 1000,
            delay: 1300
          });

          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Handler for Minimal 3D Hero Parallax
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate normalized tilt (-1 to 1 mapping)
    const normalizedX = (x / rect.width - 0.5) * 2;
    const normalizedY = (y / rect.height - 0.5) * 2;

    // Apply up to 5 degrees of tilt
    setTilt({ x: normalizedY * -5, y: normalizedX * 5 });
  };

  // Base text/color classes for the links (removed the pseudo-element underline CSS)
  const baseLinkClasses = "group relative inline-block w-fit text-cosmo-ink/70 hover:text-cosmo-ink text-sm transition-colors duration-300";
  const flexLinkClasses = "group relative flex items-center gap-2 w-fit text-cosmo-ink/70 hover:text-cosmo-ink text-sm transition-colors duration-300";

  return (
    <footer ref={footerRef} className="relative bg-cosmo-paper border-t border-cosmo-ink/10 pt-16 md:pt-24 pb-6 px-6 md:px-12 lg:px-24 overflow-hidden perspective-[1000px]">
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* ------------------------------------------------------- */}
        {/* ACT 1: The Next Move (MINIMAL INTERACTIVE HERO)         */}
        {/* ------------------------------------------------------- */}
        <div 
          className="mb-16 md:mb-24 relative rounded-3xl"
          style={{ perspective: "1000px" }}
          onMouseMove={handleHeroMouseMove}
          onMouseEnter={() => setIsHoveringHero(true)}
          onMouseLeave={() => {
            setIsHoveringHero(false);
            setTilt({ x: 0, y: 0 }); // Reset to center smoothly
          }}
        >
          {/* Minimal 3D Parallax Tracking Wrapper */}
          <motion.div
            animate={{ 
              rotateX: tilt.x, 
              rotateY: tilt.y, 
              translateZ: isHoveringHero ? 10 : 0 
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative z-10 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-4 py-8 md:py-12"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Left Side: Headline */}
            <div className="flex flex-col items-start text-left">
              <span className="footer-eyebrow opacity-0 block text-[10px] tracking-[0.3em] font-sans text-cosmo-ink/50 uppercase mb-6">
                Start a conversation
              </span>
              
              <h2 
                className="text-4xl md:text-5xl lg:text-7xl font-serif text-cosmo-ink leading-[1.05] tracking-tight flex flex-col items-start"
                style={{ transform: "translateZ(10px)" }}
              >
                <div className="flex gap-x-3 md:gap-x-4 flex-wrap justify-start drop-shadow-sm">
                  <span className="footer-word opacity-0 inline-block transform-origin-bottom">Let's</span>
                  <span className="footer-word opacity-0 inline-block transform-origin-bottom">Work</span>
                </div>
                <div className="flex gap-x-3 md:gap-x-4 flex-wrap justify-start text-cosmo-ink/40 mt-1">
                  <span className="footer-word opacity-0 inline-block transform-origin-bottom">Together</span>
                  <span className="footer-word opacity-0 inline-block transform-origin-bottom text-cosmo-accent">!!</span>
                </div>
              </h2>
            </div>
            
            {/* Right Side: CTA Button */}
            <div 
              className="footer-cta opacity-0 shrink-0 mb-2 md:mb-4"
              style={{ transform: "translateZ(15px)" }}
            >
              <MagneticCTA href="#start">
                Let's engineer what's next
              </MagneticCTA>
            </div>
          </motion.div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* ACT 2: The Asymmetrical Navigation Grid                 */}
        {/* ------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 font-sans mb-16">
          
          {/* Brand Column (4/12) */}
          <div className="footer-col opacity-0 md:col-span-4 flex flex-col">
            <span className="block text-sm tracking-[0.2em] uppercase text-cosmo-ink mb-4">
              Cosmolix
            </span>
            <p className="text-cosmo-ink/50 text-sm leading-relaxed max-w-sm mb-6">
              Engineering what's next.
            </p>
            <div className="mt-auto">
              <span className="block text-[10px] tracking-[0.2em] uppercase text-cosmo-ink/30 mb-2">
                We Engineer For
              </span>
              <p className="text-cosmo-ink/60 text-sm leading-relaxed max-w-sm">
                Products, Platforms, Operations, Infrastructure, and Intelligence.
              </p>
            </div>
          </div>

          {/* Explore Column (2/12) */}
          <div className="footer-col opacity-0 md:col-span-2">
            <span className="block text-[10px] tracking-[0.2em] font-semibold uppercase text-cosmo-ink/40 mb-6">
              Explore
            </span>
            <ul className="flex flex-col gap-3">
              {NAVIGATION.explore.map((item) => (
                <li key={item.label} className="w-fit">
                  <Link href={item.href} className={baseLinkClasses}>
                    <span className="relative z-10">{item.label}</span>
                    {/* The Memorized Navbar Line Effect */}
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-px bg-cosmo-ink/60 w-0 group-hover:w-full transition-all duration-500 ease-out" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column (2/12) */}
          <div className="footer-col opacity-0 md:col-span-2">
            <span className="block text-[10px] tracking-[0.2em] font-semibold uppercase text-cosmo-ink/40 mb-6">
              Company
            </span>
            <ul className="flex flex-col gap-3">
              {NAVIGATION.company.map((item) => (
                <li key={item.label} className="w-fit">
                  <Link href={item.href} className={baseLinkClasses}>
                    <span className="relative z-10">{item.label}</span>
                    {/* The Memorized Navbar Line Effect */}
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-px bg-cosmo-ink/60 w-0 group-hover:w-full transition-all duration-500 ease-out" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column (2/12) */}
          <div className="footer-col opacity-0 md:col-span-2">
            <span className="block text-[10px] tracking-[0.2em] font-semibold uppercase text-cosmo-ink/40 mb-6">
              Connect
            </span>
            <ul className="flex flex-col gap-3">
              {NAVIGATION.connect.map((item) => (
                <li key={item.label} className="w-fit">
                  <motion.a 
                    href={item.href}
                    initial="initial"
                    whileHover="hover" 
                    className={flexLinkClasses}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <motion.span 
                      variants={{ initial: { opacity: 0, x: -4 }, hover: { opacity: 1, x: 0 } }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="text-xs text-cosmo-ink relative z-10"
                    >
                      ↗
                    </motion.span>
                    {/* The Memorized Navbar Line Effect */}
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-px bg-cosmo-ink/60 w-0 group-hover:w-full transition-all duration-500 ease-out" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column (2/12) */}
          <div className="footer-col opacity-0 md:col-span-2">
            <span className="block text-[10px] tracking-[0.2em] font-semibold uppercase text-cosmo-ink/40 mb-6">
              Legal
            </span>
            <ul className="flex flex-col gap-3">
              {NAVIGATION.legal.map((item) => (
                <li key={item.label} className="w-fit">
                  <Link href={item.href} className={baseLinkClasses}>
                    <span className="relative z-10">{item.label}</span>
                    {/* The Memorized Navbar Line Effect */}
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-px bg-cosmo-ink/60 w-0 group-hover:w-full transition-all duration-500 ease-out" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* ACT 3: Legal & Location                                 */}
        {/* ------------------------------------------------------- */}
        <div className="footer-legal opacity-0 flex flex-col md:flex-row justify-between items-start md:items-center pt-6 border-t border-cosmo-ink/10 text-[10px] tracking-[0.1em] uppercase font-sans text-cosmo-ink/40 gap-6">
          
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <p className="text-cosmo-ink">COSMOLIX</p>
            <p className="normal-case tracking-normal">© {currentYear} Cosmolix Private Limited</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <p className="text-cosmo-ink">Pune, India</p>
          </div>

        </div>

      </div>
    </footer>
  );
}