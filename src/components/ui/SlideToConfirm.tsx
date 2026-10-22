import React, { useState, useRef } from 'react';

export interface SlideToConfirmProps {
  label?: string;
  onConfirm: () => void;
  disabled?: boolean;
}

export const SlideToConfirm: React.FC<SlideToConfirmProps> = ({
  label = 'Glisser pour sceller l’offre',
  onConfirm,
  disabled = false,
}) => {
  const [sliderPos, setSliderPos] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (disabled || isConfirmed) return;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current || isConfirmed) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const maxOffset = rect.width - 52;
    const currentOffset = Math.max(0, Math.min(clientX - rect.left - 24, maxOffset));
    setSliderPos(currentOffset);

    // Si on atteint 90% de la largeur, validation automatique
    if (currentOffset >= maxOffset * 0.9) {
      isDraggingRef.current = false;
      setSliderPos(maxOffset);
      setIsConfirmed(true);
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(50);
        } catch {}
      }
      onConfirm();
    }
  };

  const handleTouchEnd = () => {
    if (!isConfirmed) {
      isDraggingRef.current = false;
      setSliderPos(0);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`
        relative w-full h-14 rounded-2xl select-none overflow-hidden flex items-center justify-center p-1
        transition-colors
        ${disabled ? 'bg-neutral-100 dark:bg-neutral-800 opacity-50 cursor-not-allowed' : 'bg-neutral-200 dark:bg-neutral-800 cursor-grab active:cursor-grabbing'}
        ${isConfirmed ? 'bg-emerald-600 text-white' : ''}
      `}
    >
      <div
        className="absolute left-1 top-1 bottom-1 bg-emerald-500/20 rounded-xl transition-all"
        style={{ width: `${sliderPos + 48}px` }}
      />

      <span className="text-xs font-semibold tracking-wide uppercase text-neutral-600 dark:text-neutral-300 pointer-events-none z-0">
        {isConfirmed ? 'Offre scellée avec succès' : label}
      </span>

      <div
        onMouseDown={handleTouchStart}
        onTouchStart={handleTouchStart}
        style={{ transform: `translateX(${sliderPos}px)` }}
        className={`
          absolute left-1.5 w-11 h-11 rounded-xl flex items-center justify-center text-white
          shadow-md transition-transform duration-75
          ${isConfirmed ? 'bg-emerald-600' : 'bg-emerald-700 dark:bg-emerald-500'}
        `}
      >
        {isConfirmed ? (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        )}
      </div>
    </div>
  );
};
