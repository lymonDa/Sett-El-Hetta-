import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LightboxProps {
  images: { url: string; alt: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ProductLightbox({ images, currentIndex, isOpen, onClose, onPrev, onNext }: LightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    resetZoom();
  }, [currentIndex, resetZoom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        resetZoom();
        onClose();
      }
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.5, 4));
      if (e.key === '-') {
        setZoom((z) => {
          const newZoom = Math.max(z - 0.5, 1);
          if (newZoom === 1) setPan({ x: 0, y: 0 });
          return newZoom;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext, resetZoom]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      resetZoom();
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, resetZoom]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => {
      const delta = e.deltaY > 0 ? -0.3 : 0.3;
      const newZoom = Math.min(Math.max(z + delta, 1), 4);
      if (newZoom === 1) setPan({ x: 0, y: 0 });
      return newZoom;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPanStart({ x: pan.x, y: pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setPan({ x: panStart.x + dx, y: panStart.y + dy });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const current = images[currentIndex];
  if (!current) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={() => { resetZoom(); onClose(); }}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 md:py-4"
            onClick={(e) => e.stopPropagation()}>
            <span className="font-heading text-sm text-white/60">
              {currentIndex + 1} / {images.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom((z) => {
                  const newZoom = Math.min(z + 0.5, 4);
                  return newZoom;
                })}
                className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <i className="ri-zoom-in-line text-lg"></i>
              </button>
              <button
                onClick={() => {
                  setZoom((z) => {
                    const newZoom = Math.max(z - 0.5, 1);
                    if (newZoom === 1) setPan({ x: 0, y: 0 });
                    return newZoom;
                  });
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <i className="ri-zoom-out-line text-lg"></i>
              </button>
              <button
                onClick={() => { resetZoom(); onClose(); }}
                className="w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-2"
                title="Close"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); resetZoom(); onPrev(); }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-s-line text-xl md:text-2xl"></i>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); resetZoom(); onNext(); }}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <i className="ri-arrow-right-s-line text-xl md:text-2xl"></i>
              </button>
            </>
          )}

          {/* Image container */}
          <div
            ref={imageRef}
            className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <motion.img
              key={currentIndex}
              src={current.url}
              alt={current.alt}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: zoom,
                x: pan.x,
                y: pan.y,
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="max-w-[90vw] max-h-[90vh] object-contain pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Thumbnail strip at bottom */}
          {images.length > 1 && (
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2"
              onClick={(e) => e.stopPropagation()}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { resetZoom(); }}
                  onDoubleClick={() => {
                    if (i === currentIndex) return;
                    if (i < currentIndex) onPrev();
                    else onNext();
                  }}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    i === currentIndex ? 'border-gold-400 scale-110' : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}