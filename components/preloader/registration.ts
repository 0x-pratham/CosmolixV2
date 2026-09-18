// components/preloader/registration.ts
import { EASINGS } from './constants';

export function runRegistrationAndExit(onComplete: () => void) {
  const loaderWordmark = document.querySelector<HTMLElement>('[data-loader-wordmark]');
  const targetWordmark = document.querySelector<HTMLElement>('[data-registration-target]');
  
  const splitTop = document.querySelector<HTMLElement>('.pl-split-top');
  const splitBottom = document.querySelector<HTMLElement>('.pl-split-bottom');
  const otherUI = document.querySelectorAll<HTMLElement>('.pl-fade-out');

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fade out secondary UI immediately
  otherUI.forEach(el => {
    el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 300,
      fill: 'forwards',
      easing: 'ease',
    });
  });

  // FLIP: Calculate origin and destination for the wordmark
  if (loaderWordmark && targetWordmark && !isReduced) {
    const first = loaderWordmark.getBoundingClientRect();
    const last = targetWordmark.getBoundingClientRect();

    const deltaX = last.left - first.left;
    const deltaY = last.top - first.top;
    const scaleX = last.width / first.width;
    const scaleY = last.height / first.height;

    loaderWordmark.animate([
      { transform: 'translate(0, 0) scale(1)' },
      { transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})` }
    ], {
      duration: 800,
      easing: EASINGS.expoInOut,
      fill: 'forwards'
    });
  }

  // Split panel exit choreography
  const exitDuration = isReduced ? 400 : 1000;
  const exitEasing = isReduced ? 'ease' : EASINGS.expoInOut;
  
  // Wait for the wordmark to travel, then split the panels
  setTimeout(() => {
    const topAnim = splitTop?.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(-100%)' }
    ], { duration: exitDuration, easing: exitEasing, fill: 'forwards' });
    
    splitBottom?.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(100%)' }
    ], { duration: exitDuration, easing: exitEasing, fill: 'forwards' });

    if (topAnim) {
      topAnim.onfinish = onComplete;
    } else {
      setTimeout(onComplete, exitDuration);
    }
  }, 400);
}