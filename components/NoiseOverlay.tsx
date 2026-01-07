import React, { useEffect, useRef } from 'react';

export const NoiseOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Track mouse/touch position. Active decays over time.
  const inputRef = useRef({ x: -1000, y: -1000, intensity: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // 1. Generate Static Noise Pattern (Cached for performance)
    const patternSize = 200; 
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    const patternCtx = patternCanvas.getContext('2d');
    
    if (patternCtx) {
        const imgData = patternCtx.createImageData(patternSize, patternSize);
        const buffer = new Uint32Array(imgData.data.buffer);
        
        for (let i = 0; i < buffer.length; i++) {
            // High contrast grain: Alpha ~30-40 out of 255
            if (Math.random() < 0.15) { 
                // Little white specks
                buffer[i] = (35 << 24) | (255 << 16) | (255 << 8) | 255; 
            }
        }
        patternCtx.putImageData(imgData, 0, 0);
    }
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      // Downsample 2x for performance, CSS scales it up
      canvas.width = width / 2;
      canvas.height = height / 2;
    };
    
    // --- INPUT HANDLING (Mobile "Wow" Logic) ---
    const updateInput = (x: number, y: number) => {
        inputRef.current.x = x;
        inputRef.current.y = y;
        // Bump intensity to max when moving
        inputRef.current.intensity = 1.0; 
    };

    const handleMouseMove = (e: MouseEvent) => updateInput(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      // Mobile: Update position based on touch
      if (e.touches[0]) {
        updateInput(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    
    const render = () => {
      // 1. Decay intensity (fades out the light trail)
      inputRef.current.intensity *= 0.96; // Fade speed

      ctx.clearRect(0, 0, width / 2, height / 2);
      
      // 2. Draw Noise Pattern
      const pattern = ctx.createPattern(patternCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.save();
        // Jitter noise every frame for "Alive" TV static feel
        ctx.translate(-Math.random() * 50, -Math.random() * 50);
        ctx.fillRect(0, 0, (width / 2) + 50, (height / 2) + 50);
        ctx.restore();
      }

      // 3. The "Liquid Light" Effect
      // We draw a radial gradient at the touch/mouse position.
      // We use 'destination-out' to CLEAR the noise at that spot, 
      // creating a "clean glass" look where you touch.
      
      if (inputRef.current.intensity > 0.01) {
          const { x, y, intensity } = inputRef.current;
          const drawX = x / 2;
          const drawY = y / 2;
          const radius = 100 + (intensity * 50); // Pulse radius based on movement intensity

          const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, radius); 
          // Center is fully transparent (removes noise fully), edge fades out
          gradient.addColorStop(0, `rgba(0, 0, 0, ${1 * intensity})`); 
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width / 2, height / 2);
          ctx.globalCompositeOperation = 'source-over';
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    handleResize();
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60] w-full h-full opacity-30 mix-blend-overlay"
      style={{
        imageRendering: 'pixelated'
      }}
    />
  );
};