import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

export const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // 1. Mobile Check: Disable on touch devices to prevent performance hit
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    setIsVisible(true);

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    // Snappy, premium feel
    const speed = 0.25;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement;
      const isPointer = window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]');

      setIsHovering(!!isPointer);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const animate = () => {
      const distX = mouseX - cursorX;
      const distY = mouseY - cursorY;

      cursorX += distX * speed;
      cursorY += distY * speed;

      if (cursor) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={cn(
        "fixed top-0 left-0 z-[100] pointer-events-none transition-opacity duration-300 ease-out",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* 
        PRESTIGE DESIGN V3:
        1. Default: A Solid Dark Dot with border for visibility on any background
        2. Hover: A Tighter, Gold Ring
      */}
      <div
        className={cn(
          "relative flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isHovering
            ? "w-10 h-10 border-[1.5px] border-amber-500/80 rounded-full scale-100 bg-transparent" // The Tighter Ring
            : "w-3 h-3 bg-[#2c2418] rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_0_0_2px_rgba(0,0,0,0.1)] scale-100" // Dark dot with white outline
        )}
        style={{
          transform: isClicking ? 'scale(0.8) translate(-50%, -50%)' : undefined
        }}
      >
        {/* The center dot remains visible during hover for precision */}
        <div className={cn(
          "absolute inset-0 m-auto bg-amber-500 rounded-full transition-all duration-300",
          isHovering ? "w-1.5 h-1.5 opacity-100" : "w-full h-full opacity-0"
        )} />
      </div>
    </div>
  );
};