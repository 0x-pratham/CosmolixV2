"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { createTimeline } from "animejs";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isFirstRun = useRef(true); 

  // Detect Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 1. Initial load entrance animation
  useEffect(() => {
    createTimeline({
      defaults: { ease: "outExpo", duration: 1000 }
    }).add(".nav-element", {
      translateY: [-20, 0],
      opacity: [0, 1],
      // FIX 1: Provide a fallback value for 'i' in case it is undefined
      delay: (el, i) => (i ?? 0) * 100, 
    });
  }, []);

  // 2. The Smart Brand Scroll Animation
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const tl = createTimeline();

    if (isScrolled) {
      tl.add('.nav-middle-text', {
        maxWidth: ['220px', '0px'],
        opacity: [1, 0],
        duration: 400,
        ease: 'inOutQuart'
      })
      .add('.nav-text-container', {
        opacity: [1, 0],
        scale: [1, 0.9],
        duration: 300,
        ease: 'outQuad'
      }, '-=200')
      .add('.nav-logo', {
        opacity: [0, 1],
        scale: [0.8, 1],
        rotate: [-30, 0], 
        duration: 600,
        ease: 'outBack(1.2)' 
      }, '-=300'); 

    } else {
      tl.add('.nav-logo', {
        opacity: [1, 0],
        scale: [1, 0.8],
        rotate: [0, -30],
        duration: 300,
        ease: 'inQuad'
      })
      .add('.nav-text-container', {
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 400,
        ease: 'outQuad'
      }, '-=200')
      .add('.nav-middle-text', {
        maxWidth: ['0px', '220px'],
        opacity: [0, 1],
        duration: 500,
        ease: 'outQuart'
      }, '-=300'); 
    }

    // FIX 2: Wrap the cleanup in curly braces to strictly return 'void'
    return () => { 
      tl.pause(); 
    }; 
  }, [isScrolled]);

  const navLinks = [
    { name: "Capabilities", href: "#capabilities" },
    { name: "Approach", href: "#approach" },
    { name: "Work", href: "#work" },
    { 
      name: "Company", 
      href: "#company",
      dropdown: [
        { name: "About", href: "#about" },
        { name: "Research", href: "#research" },
        { name: "Careers", href: "#careers" },
        { name: "Leadership", href: "#leadership" },
        { name: "News", href: "#news" },
        { name: "Policy", href: "#policy" },
      ]
    },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans ${
        isScrolled 
          ? "bg-cosmo-paper/90 backdrop-blur-md border-b border-cosmo-ink/10 py-2 md:py-3" 
          : "bg-transparent py-4 md:py-5" 
      }`}
    >
      <div className="px-6 md:px-16 lg:px-32 flex items-center justify-between">

        {/* The Animated Brand Component */}
        <Link 
          href="/" 
          className="nav-element opacity-0 relative flex items-center h-[56px] w-48 md:w-64 hover:opacity-70 transition-opacity"
        >
          <div className="nav-logo absolute left-0 flex items-center opacity-0 scale-50 origin-left">
            <Image 
              src="/icon.svg" 
              alt="Cosmolix Logo" 
              width={56} 
              height={56} 
              className="text-cosmo-ink"
            />
          </div>

          <div data-registration-target className="nav-text-container absolute left-0 flex items-center origin-left text-2xl md:text-3xl leading-none tracking-[0.15em] uppercase text-cosmo-ink font-serif font-bold">
            <span>C</span>
            <span 
              className="nav-middle-text overflow-hidden whitespace-nowrap inline-flex" 
              style={{ maxWidth: '220px' }}
            >
              OSMOLI
            </span>
            <span>X</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link, index) => (
            <div key={index} className="nav-element opacity-0 relative group">
              <Link 
                href={link.href}
                className="relative flex items-center gap-1.5 py-2 text-sm font-medium text-cosmo-ink/80 hover:text-cosmo-ink transition-colors duration-300 before:absolute before:-inset-x-5 before:-inset-y-6"
              >
                {link.name}

                {/* Arrow Icon for Dropdown (Rotates on Hover) */}
                {link.dropdown && (
                  <svg 
                    className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:-rotate-180 transition-all duration-300 ease-out" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}

                {/* Minimal Thin Line Container - Starts from Center */}
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-px bg-cosmo-ink/60 w-0 group-hover:w-full transition-all duration-500 ease-out" />
              </Link>

              {/* Advanced Dropdown Menu for Company */}
              {link.dropdown && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  {/* Dropdown Box: Slightly darker background (#f2eee4), rounded-2xl, and shadow */}
                  <div className="bg-[#f2eee4] backdrop-blur-md border border-cosmo-ink/10 shadow-xl py-5 px-8 flex flex-col gap-4 min-w-[200px] rounded-2xl">
                    {link.dropdown.map((subItem, subIndex) => (
                      <Link 
                        key={subIndex} 
                        href={subItem.href}
                        className="relative group/sub w-fit text-sm font-medium text-cosmo-ink/70 hover:text-cosmo-ink transition-colors duration-300"
                      >
                        {subItem.name}
                        {/* Same center-out effect for dropdown items */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-px bg-cosmo-ink/60 w-0 group-hover/sub:w-full transition-all duration-500 ease-out" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block nav-element opacity-0">
          <Link 
            href="#start"
            className="group relative flex items-center gap-2 py-2 text-sm font-medium text-cosmo-ink hover:text-cosmo-accent transition-colors duration-300"
          >
            Start a project
            <span className="text-cosmo-accent group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
            {/* Center-out line for the CTA too! */}
            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-px bg-cosmo-accent/60 w-0 group-hover:w-full transition-all duration-500 ease-out" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden nav-element opacity-0 text-cosmo-ink text-sm tracking-widest uppercase"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-cosmo-paper border-b border-cosmo-ink/10 transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? "max-h-screen py-6 overflow-y-auto" : "max-h-0 py-0 border-transparent"
        }`}
      >
        <nav className="flex flex-col px-6 gap-6">
          {navLinks.map((link, index) => (
            <div key={index} className="flex flex-col gap-4">
              <Link 
                href={link.href}
                className="flex items-center gap-2 text-lg font-medium text-cosmo-ink font-serif"
                onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
              >
                {link.name}
                {link.dropdown && (
                  <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>

              {/* Mobile Sub-links rendering */}
              {link.dropdown && (
                <div className="flex flex-col pl-4 gap-4 border-l border-cosmo-ink/10 ml-2">
                  {link.dropdown.map((sub, subIdx) => (
                    <Link 
                      key={subIdx} 
                      href={sub.href}
                      className="text-base text-cosmo-ink/70"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link 
            href="#start"
            className="text-lg font-bold text-cosmo-accent font-serif flex items-center gap-2 mt-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Start a project →
          </Link>
        </nav>
      </div>
    </header>
  );
}