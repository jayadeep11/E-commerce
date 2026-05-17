import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SlidingHoverList Component
 * A highly reusable, isolated React component that implements a smooth sliding and stretching
 * background pill hover animation using Tailwind CSS and Framer Motion's shared layout spring physics.
 * Fades out smoothly when the cursor leaves the container.
 * 
 * @param {Array} items - List of items to display. Each item should have { name, desc, icon: LucideIcon, action }
 * @param {Number} activeIndex - Currently active (focused or keyboard selected) index.
 * @param {Function} onItemSelect - Callback when an item is clicked.
 */
const SlidingHoverList = ({ items = [], activeIndex = 0, onItemSelect }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div 
      className="w-full flex flex-col gap-1"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isHovered = idx === hoveredIndex;
        const isActive = idx === activeIndex;

        return (
          <div
            key={item.name}
            onClick={() => {
              if (onItemSelect) onItemSelect(idx);
              if (item.action) item.action();
            }}
            onMouseEnter={() => setHoveredIndex(idx)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer select-none text-left relative overflow-hidden transition-colors duration-150 ${
              isHovered
                ? 'text-slate-950 font-bold'
                : isActive
                ? 'text-slate-900 font-bold bg-slate-100'
                : 'text-slate-700'
            }`}
          >
            {/* Shared layout active gliding/stretching pill background */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  layoutId="sliding-hover-pill"
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-900/[0.06] rounded-xl -z-10"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30
                  }}
                />
              )}
            </AnimatePresence>

            {Icon && (
              <Icon 
                size={18} 
                className={`shrink-0 relative z-10 transition-colors ${
                  isHovered ? 'text-slate-800' : isActive ? 'text-slate-700' : 'text-slate-400'
                }`} 
              />
            )}
            
            <div className="flex-grow flex items-center justify-between min-w-0 relative z-10">
              <span className="text-sm truncate leading-none">
                {item.name}
              </span>
              {item.desc && (
                <span className={`text-[11px] truncate ml-3 font-semibold hidden sm:inline transition-colors ${
                  isHovered ? 'text-slate-500' : isActive ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {item.desc}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SlidingHoverList;
