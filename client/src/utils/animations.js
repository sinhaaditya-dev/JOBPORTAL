export const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const itemFadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

export const itemScaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const viewportOnce = {
  once: true,
  amount: 0.2,
};

export const springPreset = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
};

export const hoverScaleSmall = {
  scale: 1.02,
};

export const tapScaleSmall = {
  scale: 0.98,
};
