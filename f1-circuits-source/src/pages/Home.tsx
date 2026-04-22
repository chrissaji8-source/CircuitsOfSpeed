import { useEffect, useRef, useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import Section1 from "@/components/Section1";
import Section2 from "@/components/Section2";
import Section3 from "@/components/Section3";
import Section4 from "@/components/Section4";
import OutroSection from "@/components/OutroSection";
import NavDots from "@/components/NavDots";

const SECTIONS = 6;

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sectionVisible, setSectionVisible] = useState([true, false, false, false, false, false]);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastScrollTime = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}f1-zoom.mp3?v=2`);
    audio.preload = 'auto';
    audioRef.current = audio;
    return () => { audio.pause(); };
  }, []);

  const playZoomSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.volume = 0.9;
    audio.play().catch(() => {});
  }, []);

  const goToSection = useCallback((idx: number) => {
    if (isAnimating || idx === currentSection || idx < 0 || idx >= SECTIONS) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 800) return;
    lastScrollTime.current = now;

    playZoomSound();
    setIsAnimating(true);
    setCurrentSection(idx);

    setSectionVisible(prev => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });

    setTimeout(() => setIsAnimating(false), 900);
  }, [isAnimating, currentSection, playZoomSound]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 40) goToSection(currentSection + 1);
      else if (e.deltaY < -40) goToSection(currentSection - 1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goToSection(currentSection + 1);
      if (e.key === 'ArrowUp' || e.key === 'PageUp') goToSection(currentSection - 1);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSection(currentSection + 1);
        else goToSection(currentSection - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentSection, goToSection]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      <NavDots current={currentSection} total={SECTIONS} onDotClick={goToSection} />

      <div
        className="flex flex-col transition-transform duration-[900ms]"
        style={{
          transform: `translateY(-${currentSection * 100}vh)`,
          transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
          height: `${SECTIONS * 100}vh`,
        }}
      >
        <HeroSection visible={sectionVisible[0]} isActive={currentSection === 0} />
        <Section1 visible={sectionVisible[1]} isActive={currentSection === 1} />
        <Section2 visible={sectionVisible[2]} isActive={currentSection === 2} />
        <Section3 visible={sectionVisible[3]} isActive={currentSection === 3} />
        <Section4 visible={sectionVisible[4]} isActive={currentSection === 4} />
        <OutroSection visible={sectionVisible[5]} isActive={currentSection === 5} />
      </div>

      {/* Speed lines overlay when animating */}
      {isAnimating && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-70"
              style={{
                top: `${8 + i * 8}%`,
                left: 0,
                right: 0,
                animation: `speed-line ${0.3 + i * 0.05}s ease-out forwards`,
                animationDelay: `${i * 0.02}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
