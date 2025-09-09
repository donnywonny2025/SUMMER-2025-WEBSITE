import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';

const HeroHeading = () => {
  const headingRef = useRef(null);
  const text = "Jeff Kerr produces compelling visual content while building AI-enhanced workflows that change how creative work gets done.";
  const words = text.split(' ');

  useLayoutEffect(() => {
    if (headingRef.current) {
      const wordSpans = headingRef.current.querySelectorAll('.hero-word');
      // Set initial state
      gsap.set(wordSpans, { opacity: 0, filter: 'blur(8px)', y: 20 });

      // Animate to final state
      gsap.to(wordSpans, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.04,
        delay: 0.2, // A small delay to ensure rendering is complete
      });
    }
  }, []);

  return (
    <h1 ref={headingRef} className="hero-heading-container">
      {words.map((word, index) => (
        <span key={index} className="hero-word" style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}>
          {word}&nbsp;
        </span>
      ))}
    </h1>
  );
};

export default HeroHeading;
