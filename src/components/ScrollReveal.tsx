import React, { useEffect, useRef, useState } from "react";

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: string;
  /** When true, only animates position without opacity — keeps backdrop-filter visible throughout. */
  glass?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  delay = "",
  glass = false,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const hiddenClass = glass ? "top-[30px]" : "top-[30px] opacity-0";
  const visibleClass = glass ? "top-0" : "top-0 opacity-100";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: delay }}
      className={`relative transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? visibleClass : hiddenClass
      } ${className}`}
    >
      {children}
    </div>
  );
}
