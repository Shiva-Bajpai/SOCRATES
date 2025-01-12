import { cubicBezier } from "framer-motion";

const textVar = {
  initial: {
    top: 100,
    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
  },
  animate: {
    top: 0,
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    transition: {
      ease: cubicBezier(0, 0.55, 0.45, 1),
      duration: 0.75,
    },
  },
};

const slideUp = {
  initial: {
    y: 50, // Starts below the view
    opacity: 0, // Hidden initially
  },
  animate: {
    y: 0, // Moves to its final position
    opacity: 1, // Becomes visible
    transition: {
      type: "spring", // Spring animation for smoothness
      stiffness: 100, // Adjust stiffness for bounce effect
      damping: 20, // Control the spring damping
    },
  },
};

export { textVar, slideUp };
