import { gsap } from "gsap";

export const useMotion = (el) => {
  const animateIn = (delay) => {
    gsap.fromTo(
      el.value.querySelectorAll(".label"),
      { x: 50, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        ease: "expo.out",
        duration: 1,
        stagger: 0.075,
        delay,
      }
    );
  };

  return { animateIn };
};
