// components/preloader/Preloader.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePreloadProgress } from "./usePreloadProgress";
import { runRegistrationAndExit } from "./registration";
import { TIMING } from "./constants";
import "./preloader.css";

export default function Preloader() {
  const { progress, isReady } = usePreloadProgress();
  const [isMounted, setIsMounted] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const startTime = useRef(Date.now());
  
  useEffect(() => {
    // Session Gate check
    if (sessionStorage.getItem('cosmolix:registered')) {
      setIsMounted(false);
      return;
    }
    
    setIsVisible(true);
    
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  useEffect(() => {
    if (!isReady || !isVisible) return;

    const elapsed = Date.now() - startTime.current;
    // Ensure we satisfy the minimum visible time to prevent flicker
    const remaining = Math.max(0, TIMING.minVisible - elapsed);

    const timer = setTimeout(() => {
      runRegistrationAndExit(() => {
        sessionStorage.setItem('cosmolix:registered', 'true');
        setIsMounted(false);
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      });
    }, remaining);

    return () => clearTimeout(timer);
  }, [isReady, isVisible]);

  if (!isMounted || !isVisible) return null;

  return (
    <div className="pl-root" aria-hidden="true" style={{ "--pl-progress": progress } as React.CSSProperties}>
      
      <div className="pl-split-top" />
      <div className="pl-split-bottom" />
      
      <div className="w-full max-w-[1400px] mx-auto flex justify-between items-start text-xs tracking-[0.2em] uppercase opacity-50 font-sans pl-fade-out z-10 pt-6 md:pt-12">
        <span>Cosmolix</span>
        <span>Engineering / 05</span>
      </div>

      <div className="flex-1 flex items-center justify-center z-10">
        {/* This element will be targeted by WAAPI to fly to the navbar */}
        <span data-loader-wordmark className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight text-cosmo-paper origin-top-left">
          Cosmolix
        </span>
      </div>

      <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-6 z-10 pl-fade-out pb-6 md:pb-12">
        <div className="flex justify-between items-end font-sans">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 mb-1">Architecture</span>
            <span className="text-sm tracking-widest uppercase">05 / 05</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 mb-1">Assembly</span>
            <span className="text-sm tracking-widest">{Math.floor(progress)}%</span>
          </div>
        </div>
        
        <div className="pl-progress-track">
          <div className="pl-progress-fill">
            <div className="pl-progress-head" />
          </div>
        </div>
      </div>

    </div>
  );
}