"use client";

/**
 * CosmolixVideoTeaser.tsx
 * ---------------------------------------------------------------
 * - FIXED: "Invisible Text" bug. Gradient mask now applied directly to the span layer.
 * - Upgraded: Majestic 3D Cinematic Tilt & Scale entrance for the final brand text.
 * - Upgraded: Refined Silver/Grey metallic shine gradient.
 * - Upgraded: Button strictly locked to Top-Right Navbar position.
 * - Upgraded: IntersectionObserver completely handles auto-mute/unmute on scroll.
 * ---------------------------------------------------------------
 */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import * as animeLib from 'animejs';

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

const stopAnime = (targets: any) => {
  if (typeof (animeLib as any).remove === 'function') {
    (animeLib as any).remove(targets);
  } else {
    const anime = (animeLib as any).default || animeLib;
    if (anime && typeof anime.remove === 'function') {
      anime.remove(targets);
    }
  }
};

const getStagger = (value: number, options?: any) => {
  if (typeof (animeLib as any).stagger === 'function') {
    return (animeLib as any).stagger(value, options);
  } else {
    const anime = (animeLib as any).default || animeLib;
    if (anime && typeof anime.stagger === 'function') {
      return anime.stagger(value, options);
    }
  }
  return value; 
};

export interface CosmolixVideoTeaserHandle {
  replay: () => void;
}

export interface CosmolixVideoTeaserProps {
  videoSrc?: string;
  posterSrc?: string;
  className?: string;
}

// -----------------------------------------------------------
// The Master Cinematic Timeline
// -----------------------------------------------------------
type SceneType = 'default' | 'sequence' | 'final';
type ScenePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

interface Scene {
  id: string;
  start: number;
  end: number;
  type: SceneType;
  position: ScenePosition;
  line1?: string;
  line2?: string;
}

const TIMELINE: Scene[] = [
  { id: 's1', start: 0.0, end: 3.4, type: 'default', position: 'bottom-left', line1: 'THE WORLD IS ALWAYS MOVING.' },
  { id: 's2', start: 3.4, end: 6.2, type: 'default', position: 'top-right', line1: 'IDEAS MOVE. PEOPLE MOVE.' },
  { id: 's3', start: 6.2, end: 11.5, type: 'default', position: 'bottom-right', line1: 'EVERY SECOND.', line2: 'EVERYWHERE.' },
  { id: 's5', start: 11.5, end: 16.5, type: 'default', position: 'top-left', line1: 'FROM SOMEWHERE…', line2: 'TO EVERYWHERE.' },
  { id: 's7', start: 16.5, end: 27.4, type: 'sequence', position: 'bottom-left', line1: 'SOFTWARE → CLOUD → AI → SECURITY' },
  { id: 's8', start: 27.4, end: 32.0, type: 'default', position: 'bottom-right', line1: 'DIFFERENT PLACES.', line2: 'ONE TECHNOLOGY PARTNER.' },
  { id: 's9', start: 32.0, end: 35.0, type: 'default', position: 'top-left', line1: 'BUILT FOR BUSINESS.' },
  { id: 's10', start: 35.0, end: 37.7, type: 'default', position: 'top-right', line1: 'BUILT TO SCALE.' },
  { id: 's11', start: 37.7, end: 39.8, type: 'default', position: 'bottom-left', line1: 'WHEREVER BUSINESS GOES…' },
  { id: 's12', start: 39.8, end: 42.2, type: 'default', position: 'bottom-right', line1: 'COSMOLIX', line2: 'GOES FURTHER.' },
  { id: 's13', start: 42.2, end: 44.0, type: 'default', position: 'top-left', line1: 'EVERYWHERE.' },
  { id: 's15', start: 44.0, end: 999.0, type: 'final', position: 'center', line1: 'COSMOLIX', line2: "ENGINEERING WHAT'S NEXT." }, 
];

// -----------------------------------------------------------
// Animated Scene Sub-Component
// -----------------------------------------------------------
const AnimatedScene = ({ scene, isActive }: { scene: Scene; isActive: boolean }) => {
  const elRef = useRef<HTMLDivElement>(null);
  const isFinal = scene.type === 'final';

  const getPositionClasses = (position: ScenePosition) => {
    switch (position) {
      case 'top-left': return 'top-16 left-8 md:top-24 md:left-16 items-start text-left w-auto';
      case 'top-right': return 'top-16 right-8 md:top-24 md:right-16 items-end text-right w-auto';
      case 'bottom-left': return 'bottom-16 left-8 md:bottom-24 md:left-16 items-start text-left w-auto';
      case 'bottom-right': return 'bottom-16 right-8 md:bottom-24 md:right-16 items-end text-right w-auto';
      case 'center': default: return 'inset-0 w-full h-full items-center justify-center text-center px-6';
    }
  };

  useEffect(() => {
    if (!elRef.current) return;
    const words = elRef.current.querySelectorAll('.animate-word');

    if (isActive) {
      elRef.current.style.pointerEvents = 'auto';
      
      stopAnime(words);
      stopAnime(elRef.current);
      
      runAnime(elRef.current, {
        opacity: [0, 1],
        duration: 50,
        easing: 'linear'
      });

      if (isFinal) {
        // NEW MAJESTIC 3D CINEMATIC REVEAL FOR FINAL LOGO
        runAnime(words, {
          opacity: [0, 1],
          translateY: [30, 0],
          translateZ: [50, 0], // Adds 3D depth to the entrance
          rotateX: [-30, 0],   // Cinematic tilt up
          scale: [0.9, 1],
          duration: 2500, 
          delay: getStagger(300, { start: 200 }), 
          easing: 'easeOutQuart' 
        });
      } else {
        // INSTANT FLIPPER REVEAL FOR READING TEXT
        runAnime(words, {
          rotateX: [-90, 0], 
          translateY: [15, 0], 
          opacity: [0, 1],
          duration: 500, 
          delay: getStagger(10), 
          easing: 'easeOutExpo' 
        });
      }
    } else {
      elRef.current.style.pointerEvents = 'none';
      
      // Instant Mechanical Dissolve Out
      runAnime(words, {
        rotateX: [0, 90], 
        opacity: [1, 0],
        duration: 250, 
        delay: 0, 
        easing: 'easeInQuad'
      });

      runAnime(elRef.current, {
        opacity: [1, 0],
        duration: 250,
        easing: 'linear'
      });
    }
  }, [isActive, isFinal]);

  // Modified to accept custom classes (Fixes the transparent text bug)
  const renderWords = (text: string, customClass: string = 'text-white') => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="inline-block" style={{ perspective: '1000px' }}>
        <span className={`animate-word inline-block mr-[0.25em] opacity-0 will-change-transform transform-gpu ${customClass}`}>
          {word}
        </span>
      </span>
    ));
  };

  // Strict Typography Engine
  const uniformTextClass = "text-[clamp(1.5rem,4vw,3.5rem)] font-sans font-bold uppercase drop-shadow-2xl leading-[1.2]";
  
  // The wrapper drops the white text color so the gradient mask isn't overridden
  const finalTextClass = "text-[clamp(3.5rem,8vw,8rem)] font-serif font-bold uppercase drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] mb-2 md:mb-4";

  const textClassToUse = isFinal ? finalTextClass : uniformTextClass;

  return (
    <div ref={elRef} className={`absolute flex flex-col opacity-0 transform-gpu ${getPositionClasses(scene.position)} pointer-events-none`}>
       <h2 className={textClassToUse}>
         {/* Apply the Silver Shine specifically to the word nodes to prevent 3D context layer breaking */}
         {scene.line1 && renderWords(scene.line1, isFinal ? 'cx-brand-shine pb-2' : 'text-white')}
         {scene.line2 && (
           <>
             <br />
             <span className={isFinal ? "font-sans text-[clamp(0.875rem,2vw,1.5rem)] tracking-[0.25em] text-white/80 font-medium" : "font-sans text-white/80"}>
               {renderWords(scene.line2, 'text-white')}
             </span>
           </>
         )}
       </h2>
       
       {isFinal && (
         <a 
           href="#start"
           className="animate-word opacity-0 px-8 py-3.5 mt-8 md:mt-12 rounded-full border border-white/30 text-white font-sans text-xs md:text-sm font-bold tracking-[0.15em] uppercase bg-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 ease-out hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 pointer-events-auto"
         >
           Read More
         </a>
       )}
    </div>
  );
};


// -----------------------------------------------------------
// Animated Morphing Wave Button (Cute & Elastic)
// -----------------------------------------------------------
const AudioWaveButton = ({ isMuted, onClick }: { isMuted: boolean, onClick: (e: React.MouseEvent) => void }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const flatPath = "M 0 12 Q 3 12, 6 12 T 12 12 T 18 12 T 24 12 T 30 12 T 36 12 T 42 12 T 48 12";
  const wavePath = "M 0 12 Q 3 4, 6 12 T 12 12 T 18 12 T 24 12 T 30 12 T 36 12 T 42 12 T 48 12";

  useEffect(() => {
    if (!pathRef.current) return;
    stopAnime(pathRef.current);

    if (isMuted) {
      runAnime(pathRef.current, {
        d: flatPath,
        translateX: 0,
        duration: 800,
        easing: 'easeOutElastic(1, 0.5)'
      });
    } else {
      runAnime(pathRef.current, {
        d: wavePath,
        duration: 800,
        easing: 'easeOutElastic(1, 0.5)'
      });
      runAnime(pathRef.current, {
        translateX: [-12, 0], 
        duration: 800,
        easing: 'linear',
        loop: true
      });
    }
  }, [isMuted]);

  const handleClick = (e: React.MouseEvent) => {
    if (btnRef.current) {
      stopAnime(btnRef.current);
      runAnime(btnRef.current, {
        scale: [0.75, 1],
        rotate: isMuted ? [15, 0] : [-15, 0],
        duration: 800,
        easing: 'easeOutElastic(1, 0.4)'
      });
    }
    onClick(e);
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-black/5 hover:scale-105 pointer-events-auto"
      aria-label="Toggle Sound"
    >
      <div className="w-5 h-5 overflow-hidden flex items-center justify-center text-cosmo-ink">
        <svg viewBox="0 0 16 24" className="w-full h-full overflow-visible">
          <path
            ref={pathRef}
            d={flatPath}
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  );
};


// -----------------------------------------------------------
// Main Teaser Component
// -----------------------------------------------------------
const CosmolixVideoTeaser = forwardRef<CosmolixVideoTeaserHandle, CosmolixVideoTeaserProps>(
  function CosmolixVideoTeaser({ videoSrc = '/CosmolixChinematic.mp4', posterSrc, className }, ref) {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [activeSceneId, setActiveSceneId] = useState<string | null>(null);

    const [isMuted, setIsMuted] = useState(true);
    const isMutedRef = useRef(true);

    // Beautiful Silver/Grey Metallic Shine CSS
    const shineCss = `
      @keyframes cx-shine-anim {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      .cx-brand-shine {
        background: linear-gradient(110deg, #6b7280 15%, #ffffff 45%, #ffffff 55%, #6b7280 85%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent !important;
        display: inline-block;
        animation: cx-shine-anim 4s linear infinite;
      }
    `;

    // -----------------------------------------------------------
    // Advanced IntersectionObserver (Auto-Mute on Viewport Leave)
    // -----------------------------------------------------------
    useEffect(() => {
      const section = sectionRef.current;
      const video = videoRef.current;
      if (!section || !video) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Video is in view -> Unmute
              video.muted = false;
              setIsMuted(false);
              isMutedRef.current = false;
              
              video.play().catch(() => {
                video.muted = true;
                setIsMuted(true);
                isMutedRef.current = true;
                video.play();
              });
            } else {
              // Video left the view (scrolled up or down) -> Instantly Mute
              video.muted = true;
              setIsMuted(true);
              isMutedRef.current = true;
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(section);
      return () => observer.disconnect();
    }, []);

    // -----------------------------------------------------------
    // High-Performance Apple Scroll Reveal Loop (B&W to Color)
    // -----------------------------------------------------------
    useEffect(() => {
      let rafId: number;

      const maxScroll = window.innerHeight * 0.8;
      const initialProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);

      let currentProgress = initialProgress;
      let targetProgress = initialProgress;

      const onScroll = () => {
        const ms = window.innerHeight * 0.8;
        targetProgress = Math.min(Math.max(window.scrollY / ms, 0), 1);
      };

      const loop = () => {
        currentProgress += (targetProgress - currentProgress) * 0.08; 

        if (wrapperRef.current) {
          const insetY = 8 * (1 - currentProgress); 
          const insetX = 15 * (1 - currentProgress); 
          const radius = 48 * (1 - currentProgress); 
          const gray = 100 * (1 - currentProgress); 

          wrapperRef.current.style.clipPath = `inset(${insetY}vh ${insetX}vw round ${radius}px)`;
          wrapperRef.current.style.filter = `grayscale(${gray}%)`;
        }
        rafId = requestAnimationFrame(loop);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      loop(); 

      return () => {
        window.removeEventListener('scroll', onScroll);
        cancelAnimationFrame(rafId);
      };
    }, []);

    // Timeline Tracker
    const onTimeUpdate = useCallback(() => {
      const v = videoRef.current;
      if (!v) return;
      
      const currentScene = TIMELINE.find(s => v.currentTime >= s.start && v.currentTime < s.end);
      
      if (currentScene && currentScene.id !== activeSceneId) {
        setActiveSceneId(currentScene.id);
      } else if (!currentScene && activeSceneId !== null) {
        setActiveSceneId(null); 
      }
    }, [activeSceneId]);

    useImperativeHandle(ref, () => ({
      replay: () => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play();
        }
      }
    }));

    return (
      <section ref={sectionRef} className={`relative w-full h-[150vh] bg-cosmo-paper ${className || ''}`}>
        <style dangerouslySetInnerHTML={{ __html: shineCss }} />

        {/* ======================================================= */}
        {/* THE NAVBAR STICKY LOCK */}
        {/* ======================================================= */}
        <div className="absolute inset-0 pointer-events-none z-[999]">
          <div className="sticky top-20 md:top-24 w-full flex justify-end px-6 md:px-12 pt-4">
             <AudioWaveButton 
               isMuted={isMuted} 
               onClick={(e) => {
                 e.preventDefault();
                 if (!videoRef.current) return;
                 const nextMuted = !isMutedRef.current;
                 videoRef.current.muted = nextMuted;
                 setIsMuted(nextMuted);
                 isMutedRef.current = nextMuted;
               }} 
             />
          </div>
        </div>

        {/* Video Sticky Container */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">

          {/* Video Zoom Wrapper (Clip-Path) */}
          <div 
            ref={wrapperRef} 
            className="relative w-full h-full flex flex-col items-center justify-center will-change-transform bg-cosmo-ink"
            style={{
              clipPath: 'inset(8vh 15vw round 48px)',
              filter: 'grayscale(100%)', 
              transform: 'translateZ(0)'
            }}
          >
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              className="absolute inset-0 w-full h-full object-cover z-0"
              autoPlay 
              muted={true} 
              loop={false} 
              playsInline
              onTimeUpdate={onTimeUpdate}
              onEnded={() => setActiveSceneId('s15')} 
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50 z-10 pointer-events-none" />

            {/* Dynamic Sequence Engine Container */}
            <div className="absolute inset-0 z-20 w-full h-full pointer-events-none">
              {TIMELINE.map(scene => (
                <AnimatedScene key={scene.id} scene={scene} isActive={activeSceneId === scene.id} />
              ))}
            </div>
            
          </div>
        </div>
      </section>
    );
  }
);

export default CosmolixVideoTeaser;