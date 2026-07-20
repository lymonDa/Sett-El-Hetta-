import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const INTRO_DURATION = 3200;
const BRAND_NAME = 'Sett El Heta';
const TAGLINE = 'Luxury Jewelry · Handcrafted';

interface CinematicIntroProps {
  onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');
  const [showParticles, setShowParticles] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase('hold'), 2400);
    const exitTimer = setTimeout(() => setPhase('exit'), INTRO_DURATION - 800);
    const completeTimer = setTimeout(() => onComplete(), INTRO_DURATION);

    const particlesTimer = setTimeout(() => setShowParticles(true), 600);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
      clearTimeout(particlesTimer);
    };
  }, [onComplete]);

  // Gold particles canvas
  useEffect(() => {
    if (!showParticles || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      life: number;
      maxLife: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnParticle = () => {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 400,
        y: canvas.height * 0.4 + Math.random() * canvas.height * 0.6,
        size: Math.random() * 2.5 + 0.5,
        speedY: -(Math.random() * 0.6 + 0.2),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.15,
        life: 0,
        maxLife: Math.random() * 180 + 100,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.life * 0.03) * 0.3;

        const lifeRatio = 1 - p.life / p.maxLife;
        const alpha = p.opacity * lifeRatio;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 160, 23, ${alpha})`;
        ctx.fill();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      if (particles.length < 55) spawnParticle();
      if (Math.random() < 0.3 && particles.length < 55) spawnParticle();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [showParticles]);

  const letterVariants = {
    hidden: { opacity: 0, y: 60, rotateX: -40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay: 0.6 + i * 0.08,
        ease: [0.25, 0.8, 0.25, 1],
      },
    }),
  };

  const taglineChars = TAGLINE.split('');

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          key="cinematic-overlay"
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden"
          style={{ background: '#080604' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.6, 0, 0.4, 1] }}
        >
          {/* Central gold glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(212,160,23,0.18) 0%, rgba(212,160,23,0.05) 40%, transparent 70%)',
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          />

          {/* Subtle top light beam */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[45%] pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(212,160,23,0.25) 60%, transparent 100%)',
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          />

          {/* Particles canvas */}
          {showParticles && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none"
            />
          )}

          {/* Main content */}
          <div className="relative z-10 text-center px-6">
            {/* Ornamental top line */}
            <motion.div
              className="mx-auto mb-8 md:mb-10"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.8, 0.25, 1] }}
            >
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  className="h-px bg-gradient-to-l from-gold-400 to-transparent"
                  style={{ width: 60 }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-gold-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7, type: 'spring' }}
                />
                <motion.div
                  className="h-px bg-gradient-to-r from-gold-400 to-transparent"
                  style={{ width: 60 }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                />
              </div>
            </motion.div>

            {/* Brand name - letter by letter */}
            <div className="flex items-center justify-center flex-wrap gap-1 mb-5 md:mb-6">
              {BRAND_NAME.split('').map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
                  style={{
                    color: char === ' ' ? 'transparent' : '#D4A017',
                    textShadow: '0 0 80px rgba(212,160,23,0.3), 0 2px 4px rgba(0,0,0,0.6)',
                    width: char === ' ' ? '0.35em' : 'auto',
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Tagline */}
            <motion.div
              className="flex items-center justify-center flex-wrap gap-x-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              {taglineChars.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.5 + i * 0.025 }}
                  className="inline-block font-body text-base md:text-lg tracking-wider"
                  style={{
                    color: '#8C7B66',
                    width: char === ' ' ? '0.25em' : 'auto',
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* Bottom ornamental diamond */}
            <motion.div
              className="mt-8 md:mt-10 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.8, type: 'spring' }}
            >
              <motion.div
                animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 bg-gold-400/30 rotate-45"
              />
            </motion.div>
          </div>

          {/* Bottom fade line */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px pointer-events-none"
            style={{
              background: 'linear-gradient(to right, transparent 0%, rgba(212,160,23,0.3) 20%, rgba(212,160,23,0.6) 50%, rgba(212,160,23,0.3) 80%, transparent 100%)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: '60%' }}
            transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
          />
        </motion.div>
      ) : (
        /* Curtain exit - two panels splitting from center */
        <motion.div
          key="cinematic-curtains"
          className="fixed inset-0 z-[99999] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Left curtain (in RTL, this goes to the right side visually) */}
          <motion.div
            className="absolute top-0 left-0 h-full"
            style={{ background: '#080604' }}
            initial={{ width: '50%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.6, 0, 0.4, 1] }}
          />
          {/* Right curtain */}
          <motion.div
            className="absolute top-0 right-0 h-full"
            style={{ background: '#080604' }}
            initial={{ width: '50%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.6, 0, 0.4, 1] }}
          />
          {/* Center gold line that fades */}
          <motion.div
            className="absolute top-0 bottom-0 left-1/2 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(212,160,23,0.8) 30%, rgba(212,160,23,0.8) 70%, transparent 100%)' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}