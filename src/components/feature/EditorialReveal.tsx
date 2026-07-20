import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';

// ─── Reveal — Fade + directional slide ─────────────────────────

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  dir?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  once?: boolean;
}

export function Reveal({ children, className = '', delay = 0, dir = 'up', distance = 48, duration = 0.8, once = true }: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-60px' });
  const dirMap: Record<string, object> = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dirMap[dir] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...dirMap[dir] }}
      transition={{ duration, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── SpringReveal — Fade + spring physics ───────────────────────

interface SpringRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  dir?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export function SpringReveal({ children, className = '', delay = 0, dir = 'up', distance = 48 }: SpringRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const dirMap: Record<string, object> = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dirMap[dir] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...dirMap[dir] }}
      transition={{ type: 'spring', stiffness: 200, damping: 24, mass: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── ScaleReveal — Scale from 92% to 100% ──────────────────────

interface ScaleRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScaleReveal({ children, className = '', delay = 0 }: ScaleRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── LineDraw — Horizontal line draws itself ────────────────────

interface LineDrawProps {
  className?: string;
  delay?: number;
  width?: string;
  color?: string;
}

export function LineDraw({ className = '', delay = 0, width = 'w-16', color = 'bg-gold-300' }: LineDrawProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.22, 0.61, 0.36, 1] }}
        className={`h-px ${width} ${color} origin-right`}
      />
    </div>
  );
}

// ─── ParallaxImage — Scale-in entrance + parallax scroll ───────

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  enterDelay?: number;
}

export function ParallaxImage({ src, alt, className = '', speed = 0.2, enterDelay = 0 }: ParallaxImageProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.3, 1], [1.08, 1, 1]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, delay: enterDelay, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ y, scale: imgScale }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export function SectionHeader({ label, title, description, delay = 0, align = 'center' }: {
  children?: React.ReactNode;
  label: string;
  title: string;
  description?: string;
  delay?: number;
  align?: 'center' | 'left';
}) {
  return (
    <div className={`mb-16 md:mb-20 ${align === 'center' ? 'text-center' : ''}`}>
      <Reveal delay={delay} dir="none" duration={0.6}>
        <span className="font-heading text-[11px] font-semibold tracking-[0.3em] text-gold-500 uppercase">
          {label}
        </span>
      </Reveal>
      <SpringReveal delay={delay + 0.1} dir="up" distance={40}>
        <h2 className={`font-heading font-black text-3xl md:text-5xl lg:text-6xl text-espresso-900 mt-4 mb-5 leading-tight ${align === 'center' ? '' : ''}`}>
          {title.split('<br/>').map((line, i) => (
            <span key={i}>
              {i > 0 && <br className="md:hidden" />}
              {line}
            </span>
          ))}
        </h2>
      </SpringReveal>
      <LineDraw delay={delay + 0.25} className={align === 'center' ? 'mx-auto' : ''} />
      {description && (
        <Reveal delay={delay + 0.35} dir="up" distance={20} duration={0.7}>
          <p className={`font-body text-base md:text-lg text-espresso-500 mt-5 leading-relaxed max-w-md ${align === 'center' ? 'mx-auto' : ''}`}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

// ─── PageHeader — Simple editorial header for inner pages ─────

export function PageHeader({ label, title, description, bgImage }: {
  label?: string;
  title: string;
  description?: string;
  bgImage?: string;
}) {
  if (bgImage) {
    return (
      <section className="relative min-h-[280px] md:min-h-[360px] flex items-center overflow-hidden">
        <ParallaxImage src={bgImage} alt={title} className="absolute inset-0" speed={0.08} enterDelay={0} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent z-10" />
        <div className="relative z-20 section-padding w-full py-16">
          <div className="max-w-2xl">
            {label && (
              <Reveal delay={0.2} dir="none" duration={0.6}>
                <span className="font-heading text-xs sm:text-sm font-semibold tracking-[0.25em] text-gold-300 uppercase mb-3 block">
                  {label}
                </span>
              </Reveal>
            )}
            <SpringReveal delay={0.3} dir="up" distance={40}>
              <h1 className="font-heading font-black text-3xl md:text-5xl text-white leading-tight" style={{ textShadow: '0 2px 40px rgba(0,0,0,0.3)' }}>
                {title}
              </h1>
            </SpringReveal>
            {description && (
              <Reveal delay={0.45} dir="up" distance={24} duration={0.7}>
                <p className="font-body text-base md:text-lg text-white/80 leading-relaxed mt-4 max-w-lg" style={{ textShadow: '0 1px 20px rgba(0,0,0,0.4)' }}>
                  {description}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-white border-b border-cream-200">
      <div className="section-padding py-10 md:py-14">
        <Reveal delay={0} dir="none" duration={0.6}>
          {label && (
            <span className="font-heading text-[11px] font-semibold tracking-[0.3em] text-gold-500 uppercase block mb-3">
              {label}
            </span>
          )}
        </Reveal>
        <SpringReveal delay={0.1} dir="up" distance={30}>
          <h1 className="font-heading font-black text-3xl md:text-4xl text-espresso-900 leading-tight">
            {title}
          </h1>
        </SpringReveal>
        {description && (
          <Reveal delay={0.2} dir="up" distance={20} duration={0.7}>
            <p className="font-body text-base md:text-lg text-espresso-500 mt-3 max-w-lg leading-relaxed">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

// ─── StatusBadge — Editorial status badges ─────────────────────

export function StatusBadge({ status, config }: {
  status: string;
  config: Record<string, { label: string; icon: string; bg: string; text: string }>;
}) {
  const cfg = config[status] || config[Object.keys(config)[0]];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-semibold ${cfg.bg} ${cfg.text}`}>
      <i className={cfg.icon}></i>
      {cfg.label}
    </span>
  );
}

// ─── EditorialCard — Consistent card styling ──────────────────

export function EditorialCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-cream-200 p-5 md:p-6 transition-all duration-300 hover:border-gold-200 ${className}`}>
      {children}
    </div>
  );
}

// ─── PullQuote — Editorial quote with border draw ─────────────

export function PullQuote({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="relative pr-6 my-8 overflow-hidden">
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.22, 0.61, 0.36, 1] }}
        className="absolute right-0 top-0 bottom-0 w-0.5 bg-gold-400 origin-top rounded-full"
      />
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.7, delay: delay + 0.3, ease: [0.22, 0.61, 0.36, 1] }}
        className="font-heading text-xl md:text-2xl text-espresso-800 leading-relaxed italic"
      >
        {children}
      </motion.p>
    </div>
  );
}