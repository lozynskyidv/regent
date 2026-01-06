import { useState, useRef, useEffect } from 'react';
import { Trash2, Edit2 } from 'lucide-react';

interface SwipeableItemProps {
  children: React.ReactNode;
  onDelete: () => void;
  onEdit?: () => void;
  showEdit?: boolean;
}

export function SwipeableItem({ children, onDelete, onEdit, showEdit = true }: SwipeableItemProps) {
  const [offset, setOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 60;
  const BUTTON_WIDTH = 80;
  const TOTAL_WIDTH = (showEdit && onEdit) ? BUTTON_WIDTH * 2 : BUTTON_WIDTH;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOffset(0);
      }
    };

    if (offset !== 0) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [offset]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    currentX.current = e.touches[0].clientX;
    const diff = startX.current - currentX.current;
    
    if (diff > 0) {
      setOffset(Math.min(diff, TOTAL_WIDTH));
    } else {
      setOffset(0);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    
    if (offset > SWIPE_THRESHOLD) {
      setOffset(TOTAL_WIDTH);
    } else {
      setOffset(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping) return;
    
    currentX.current = e.clientX;
    const diff = startX.current - currentX.current;
    
    if (diff > 0) {
      setOffset(Math.min(diff, TOTAL_WIDTH));
    } else {
      setOffset(0);
    }
  };

  const handleMouseUp = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    
    if (offset > SWIPE_THRESHOLD) {
      setOffset(TOTAL_WIDTH);
    } else {
      setOffset(0);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative rounded-xl"
      style={{
        touchAction: 'pan-y',
        overflow: 'hidden'
      }}
    >
      {/* Swipeable content */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isSwiping) {
            handleMouseUp();
          }
        }}
        className="relative rounded-xl"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
          cursor: isSwiping ? 'grabbing' : 'default',
          backgroundColor: 'var(--card)',
          zIndex: 1
        }}
      >
        {children}
      </div>

      {/* Action buttons - muted private banking colors */}
      <div 
        className="absolute right-0 top-0 bottom-0 flex rounded-xl"
        style={{
          width: `${TOTAL_WIDTH}px`,
          zIndex: 0,
          overflow: 'hidden',
          boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.1)'
        }}
      >
        {showEdit && onEdit && (
          <button
            onClick={handleEdit}
            className="flex items-center justify-center transition-all active:scale-95 hover:brightness-95"
            style={{
              width: `${BUTTON_WIDTH}px`,
              backgroundColor: '#64748b' // Muted slate gray
            }}
          >
            <Edit2 size={18} strokeWidth={2} color="white" />
          </button>
        )}
        <button
          onClick={handleDelete}
          className="flex items-center justify-center transition-all active:scale-95 hover:brightness-95"
          style={{
            width: `${BUTTON_WIDTH}px`,
            backgroundColor: '#991b1b' // Muted burgundy red
          }}
        >
          <Trash2 size={18} strokeWidth={2} color="white" />
        </button>
      </div>
    </div>
  );
}
