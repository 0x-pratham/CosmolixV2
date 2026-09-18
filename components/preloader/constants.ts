// components/preloader/constants.ts

export const TIMING = {
  minVisible: 900,  // Minimum ms the loader stays on screen
  maxVisible: 4000, // Hard exit fallback
  hold: 350,        // The silence before the impression
};

export const SIGNAL_WEIGHTS = {
  fonts: 0.40, // Heaviest, as the brand relies on the serif wordmark
  // The remaining 0.60 is divided dynamically among [data-preload] images
};

export const EASINGS = {
  expoOut: "cubic-bezier(0.19, 1, 0.22, 1)",
  expoInOut: "cubic-bezier(0.87, 0, 0.13, 1)",
};