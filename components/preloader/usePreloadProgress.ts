// components/preloader/usePreloadProgress.ts
import { useState, useEffect } from 'react';
import { TIMING, SIGNAL_WEIGHTS } from './constants';

export function usePreloadProgress() {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    let currentVisual = 0;
    let targetActual = 0;
    let raf: number;

    const checkReady = () => {
      if (targetActual >= 0.99) {
        setTimeout(() => {
          if (mounted) setIsReady(true);
        }, TIMING.hold);
      }
    };

    // 1. Await Typography
    document.fonts.ready.then(() => {
      targetActual += SIGNAL_WEIGHTS.fonts;
      checkReady();
    });

    // 2. Await critical tagged images
    const images = document.querySelectorAll<HTMLImageElement>('img[data-preload]');
    if (images.length > 0) {
      const weightPerImage = (1 - SIGNAL_WEIGHTS.fonts) / images.length;
      images.forEach(img => {
        if (img.complete) {
          targetActual += weightPerImage;
          checkReady();
        } else {
          img.addEventListener('load', () => { targetActual += weightPerImage; checkReady(); });
          img.addEventListener('error', () => { targetActual += weightPerImage; checkReady(); }); // Don't hang on error
        }
      });
    } else {
      targetActual += (1 - SIGNAL_WEIGHTS.fonts);
      checkReady();
    }

    // Smooth Lerp Loop
    const lerp = () => {
      if (!mounted) return;
      currentVisual += (targetActual - currentVisual) * 0.06; // Lerp factor
      setProgress(currentVisual * 100);
      
      if (currentVisual < 0.99) {
        raf = requestAnimationFrame(lerp);
      } else {
        setProgress(100);
      }
    };
    raf = requestAnimationFrame(lerp);

    // Hard fallback to ensure we never trap the user
    const failsafe = setTimeout(() => {
      targetActual = 1;
      checkReady();
    }, TIMING.maxVisible);

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
    };
  }, []);

  return { progress, isReady };
}