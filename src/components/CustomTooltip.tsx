import React, { useState, useRef } from 'react';

interface CustomTooltipProps {
  content: string;
  title?: string;
  badge?: string;
  category?: 'MPR' | 'DPR' | 'EBY Connect' | string;
  children: React.ReactNode;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  MPR: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300',
  DPR: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/40 text-indigo-300',
  'EBY Connect': 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300',
};

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  content,
  title,
  badge,
  category = 'MPR',
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; isTop: boolean }>({ top: 0, left: 0, isTop: true });

  const handleMouseEnter = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Smart position calculation:
      // If cursor/row is near the top of the viewport (< 240px or in upper half), show tooltip BELOW (isTop = false)
      // Otherwise, show tooltip ABOVE (isTop = true)
      const isTop = rect.top >= 240 && rect.top >= viewportHeight / 2;

      let top = isTop ? rect.top - 10 : rect.bottom + 10;
      
      // Calculate horizontal center clamped to screen boundaries
      const tooltipWidth = Math.min(340, viewportWidth - 32);
      let left = rect.left + rect.width / 2;
      left = Math.max(16 + tooltipWidth / 2, Math.min(viewportWidth - 16 - tooltipWidth / 2, left));

      setCoords({ top, left, isTop });
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const badgeClass = CATEGORY_GRADIENTS[category] || 'from-blue-500/20 to-indigo-500/10 border-blue-500/40 text-blue-300';

  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block w-full cursor-pointer"
    >
      {children}

      {/* Floating Viewport-Fixed Tooltip Card (Breaks out of all overflow boundaries) */}
      {isHovered && (
        <div
          className="fixed z-[9999] pointer-events-none transition-all duration-150 ease-out"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            transform: coords.isTop ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
            width: 'min(340px, calc(100vw - 32px))',
          }}
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 text-white font-sans text-xs shadow-2xl shadow-slate-950/70 leading-relaxed border-t-slate-600/80">
            {/* Header Badge */}
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800">
              <span className={`bg-gradient-to-r ${badgeClass} border px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider`}>
                {category}
              </span>
              {badge && (
                <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[160px]">
                  {badge}
                </span>
              )}
            </div>

            {/* Title Header */}
            {title && (
              <p className="font-extrabold text-blue-300 text-xs mb-1">
                {title}
              </p>
            )}

            {/* Full Content */}
            <p className="font-bold text-slate-100 leading-normal text-xs break-words">
              "{content}"
            </p>

            <div className="mt-2.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <span>ℹ️</span> Teks Lengkap Nama Kegiatan
              </span>
              <span className="text-emerald-400 font-bold uppercase">Terverifikasi</span>
            </div>
          </div>

          {/* Pointer Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent ${
              coords.isTop
                ? 'top-full border-t-8 border-t-slate-900/95'
                : 'bottom-full border-b-8 border-b-slate-900/95'
            }`}
          />
        </div>
      )}
    </div>
  );
};

