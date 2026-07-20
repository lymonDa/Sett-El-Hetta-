import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useCustomerAuthStore } from '@/stores/customerAuthStore';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import LanguageSwitcher from '@/components/feature/LanguageSwitcher';

const navLinks = [
  { path: '/', label: 'nav.home' },
  { path: '/products', label: 'nav.products' },
  { path: '/blog', label: 'nav.blog' },
  { path: '/our-story', label: 'nav.ourStory' },
  { path: '/gallery', label: 'nav.gallery' },
  { path: '/contact', label: 'nav.contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user } = useCustomerAuthStore();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-panel shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="section-padding">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <motion.span
                whileHover={{ scale: 1.03 }}
                className="font-heading font-extrabold text-xl md:text-2xl tracking-tight"
                style={{
                  color: scrolled ? '#B88913' : undefined,
                  background: scrolled
                    ? undefined
                    : 'linear-gradient(135deg, #FFF8DC 0%, #FFD700 50%, #DAA520 100%)',
                  WebkitBackgroundClip: scrolled ? undefined : 'text',
                  WebkitTextFillColor: scrolled ? undefined : 'transparent',
                  backgroundClip: scrolled ? undefined : 'text',
                  textShadow: scrolled ? '0 1px 2px rgba(0,0,0,0.05)' : '0 1px 3px rgba(0,0,0,0.2)',
                }}
              >
                {t('brand.name')}
              </motion.span>
              <motion.span
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-lg opacity-80"
                style={{ color: scrolled ? '#D4A017' : '#FFD700' }}
              >
                ✦
              </motion.span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative font-heading font-medium text-sm px-4 py-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? scrolled
                          ? 'text-gold-700 bg-gold-50'
                          : 'text-white bg-white/10'
                        : scrolled
                          ? 'text-espresso-700 hover:text-gold-600'
                          : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {t(link.label)}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                        style={{ backgroundColor: scrolled ? '#D4A017' : '#FFD700' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher scrolled={scrolled} />

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/cart"
                  className="relative p-2.5 rounded-full transition-all duration-300 hover:bg-gold-50/50"
                  aria-label={t('nav.cart')}
                >
                  <i
                    className={`ri-shopping-bag-3-line text-lg ${
                      scrolled ? 'text-espresso-700' : 'text-white'
                    }`}
                  ></i>
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-gold-500 text-white text-xs font-bold rounded-full"
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={user ? '/account/orders' : '/account/login'}
                  className="relative p-2.5 rounded-full transition-all duration-300 hover:bg-gold-50/50"
                  aria-label={t('nav.myAccount')}
                >
                  <i
                    className={`ri-user-3-line text-lg ${
                      scrolled ? 'text-espresso-700' : 'text-white'
                    }`}
                  ></i>
                  {user && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </Link>
              </motion.div>

              <Link
                to="/track-order"
                className={`hidden sm:flex items-center gap-1.5 font-heading font-medium text-sm transition-colors ${
                  scrolled ? 'text-espresso-600 hover:text-gold-600' : 'text-white/70 hover:text-white'
                }`}
              >
                <i className="ri-truck-line"></i>
                <span>{t('nav.trackOrder')}</span>
              </Link>

              {/* Mobile menu toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2.5 rounded-full transition-colors hover:bg-white/10"
                aria-label={t('nav.myAccount')}
              >
                <i
                  className={`ri-${mobileOpen ? 'close' : 'menu'}-line text-xl ${
                    scrolled ? 'text-espresso-700' : 'text-white'
                  }`}
                ></i>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }}
              className="md:hidden overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <nav className="section-padding py-5 flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <Link
                        to={link.path}
                        className={`font-heading font-medium py-3.5 px-5 rounded-xl transition-all duration-300 block ${
                          isActive
                            ? 'bg-gold-50 text-gold-700'
                            : 'text-espresso-700 hover:bg-cream-100'
                        }`}
                      >
                        {t(link.label)}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}