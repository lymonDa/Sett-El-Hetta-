import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  children: ReactNode;
}

const HINT_STORAGE_KEY = 'admin_sidebar_swipe_hint_seen';
const HINT_AUTO_DISMISS_MS = 10000;

const staggerItem = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.75,
    filter: 'blur(10px)',
    rotateX: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 220,
      damping: 10,
      mass: 1.1,
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.85,
    filter: 'blur(6px)',
    rotateX: -10,
    transition: { duration: 0.24, ease: [0.55, 0.085, 0.68, 0.53] },
  },
};

const sidebarPanelVariants = {
  hidden: (rtl: boolean) => ({ x: rtl ? '100%' : '-100%' }),
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 24,
      mass: 0.7,
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
  exit: (rtl: boolean) => ({
    x: rtl ? '100%' : '-100%',
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: 'afterChildren',
      type: 'spring',
      stiffness: 320,
      damping: 28,
    },
  }),
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, admin, logout } = useAdminAuthStore();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [edgeGlow, setEdgeGlow] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [hintFadingOut, setHintFadingOut] = useState(false);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchActive = useRef(false);
  const edgeZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seen = localStorage.getItem(HINT_STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => setShowSwipeHint(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!showSwipeHint || hintFadingOut) return;
    const timer = setTimeout(() => {
      markHintSeen();
    }, HINT_AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [showSwipeHint, hintFadingOut, markHintSeen]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const markHintSeen = useCallback(() => {
    if (showSwipeHint && !hintFadingOut) {
      setHintFadingOut(true);
      setTimeout(() => {
        setShowSwipeHint(false);
        localStorage.setItem(HINT_STORAGE_KEY, '1');
      }, 400);
    }
  }, [showSwipeHint, hintFadingOut]);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    markHintSeen();
  }, [markHintSeen]);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
    setEdgeGlow(false);
    markHintSeen();
  }, [markHintSeen]);

  const handleEdgeTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchActive.current = true;

    const atEdge = isRtl
      ? touchStartX.current > window.innerWidth - 32
      : touchStartX.current < 32;
    if (!atEdge) {
      touchActive.current = false;
    }
  }, [isRtl]);

  const handleEdgeTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchActive.current) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);

    if (deltaY > Math.abs(deltaX)) {
      touchActive.current = false;
      setEdgeGlow(false);
      return;
    }

    const threshold = 50;
    const movingInward = isRtl ? deltaX < -threshold : deltaX > threshold;

    if (movingInward) {
      touchActive.current = false;
      openSidebar();
    } else if (isRtl ? deltaX < -15 : deltaX > 15) {
      setEdgeGlow(true);
    }
  }, [isRtl, openSidebar]);

  const handleEdgeTouchEnd = useCallback(() => {
    touchActive.current = false;
    setEdgeGlow(false);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { path: '/admin/dashboard', icon: 'ri-dashboard-line', label: t('admin.dashboard'), roles: ['OWNER', 'STAFF', 'DELIVERY_COORDINATOR'] },
    { path: '/admin/orders', icon: 'ri-shopping-bag-3-line', label: t('admin.navOrders'), roles: ['OWNER', 'STAFF', 'DELIVERY_COORDINATOR'] },
    { path: '/admin/products', icon: 'ri-price-tag-3-line', label: t('admin.navProducts'), roles: ['OWNER', 'STAFF'] },
    { path: '/admin/inventory', icon: 'ri-stack-line', label: t('admin.navInventory'), roles: ['OWNER', 'STAFF'] },
    { path: '/admin/blog', icon: 'ri-article-line', label: t('admin.navBlog'), roles: ['OWNER', 'STAFF'] },
    { path: '/admin/reports', icon: 'ri-bar-chart-line', label: t('admin.navReports'), roles: ['OWNER'] },
    { path: '/admin/users', icon: 'ri-user-settings-line', label: t('admin.navUsers'), roles: ['OWNER'] },
  ];

  const roleLabels: Record<string, string> = {
    OWNER: t('admin.role.owner'),
    STAFF: t('admin.role.staff'),
    DELIVERY_COORDINATOR: t('admin.role.delivery'),
  };

  const allowedNav = navItems.filter((item) => item.roles.includes(admin?.role || ''));

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <motion.div
        variants={staggerItem}
        className="p-5 md:p-6 border-b border-cream-200"
      >
        <Link to="/" className="block" onClick={closeSidebar}>
          <span className="font-heading font-black text-lg md:text-xl text-espresso-900">{t('brand.name')}</span>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-5 h-px bg-gold-400"></div>
            <p className="font-body text-xs text-espresso-500">{t('admin.dashboard')}</p>
          </div>
        </Link>
      </motion.div>

      <nav className="flex-1 p-3 md:p-4 space-y-0.5 md:space-y-1 overflow-y-auto">
        {allowedNav.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <motion.div key={item.path} variants={staggerItem} style={{ perspective: 800 }}>
              <Link
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl font-heading font-medium text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gold-50 text-gold-700 border border-gold-200'
                    : 'text-espresso-600 hover:bg-cream-50 hover:text-espresso-900 border border-transparent'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <i className={`${item.icon} text-base`}></i>
                </div>
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <motion.div
        variants={staggerItem}
        className="p-3 md:p-4 border-t border-cream-200"
      >
        <div className="flex items-center gap-3 mb-3 p-2.5 md:p-3 rounded-xl bg-cream-50">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gold-100 text-gold-700 font-heading font-bold text-sm shrink-0">
            {admin?.name?.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading font-semibold text-sm text-espresso-900 truncate">{admin?.name}</p>
            <p className="font-body text-xs text-espresso-500">{roleLabels[admin?.role || ''] || admin?.role}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-cream-300 text-espresso-600 text-xs font-body hover:bg-cream-50 transition-colors cursor-pointer whitespace-nowrap"
            target="_blank"
            onClick={closeSidebar}
          >
            <i className="ri-store-2-line text-sm"></i>{t('admin.navStore')}
          </Link>
          <button
            onClick={() => {
              closeSidebar();
              logout();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-cream-300 text-red-500 text-xs font-body hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-logout-box-r-line text-sm"></i>{t('admin.navLogout')}
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-50" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-cream-200 flex items-center justify-between px-4 h-14">
        <button
          onClick={openSidebar}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-cream-100 text-espresso-600 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <i className="ri-menu-line text-lg"></i>
        </button>
        <span className="font-heading font-black text-lg text-espresso-900">{t('brand.name')}</span>
        <div className="w-9 h-9 flex items-center justify-center">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gold-100 text-gold-700 font-heading font-bold text-xs">
            {admin?.name?.charAt(0)}
          </div>
        </div>
      </div>

      <aside className={`hidden lg:flex w-64 bg-white flex-col fixed top-0 h-full z-20 ${isRtl ? 'border-l right-0' : 'border-r left-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 md:p-6 border-b border-cream-200">
            <Link to="/" className="block">
              <span className="font-heading font-black text-lg md:text-xl text-espresso-900">{t('brand.name')}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-5 h-px bg-gold-400"></div>
                <p className="font-body text-xs text-espresso-500">{t('admin.dashboard')}</p>
              </div>
            </Link>
          </div>
          <nav className="flex-1 p-3 md:p-4 space-y-0.5 md:space-y-1 overflow-y-auto">
            {allowedNav.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl font-heading font-medium text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gold-50 text-gold-700 border border-gold-200'
                      : 'text-espresso-600 hover:bg-cream-50 hover:text-espresso-900 border border-transparent'
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <i className={`${item.icon} text-base`}></i>
                  </div>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 md:p-4 border-t border-cream-200">
            <div className="flex items-center gap-3 mb-3 p-2.5 md:p-3 rounded-xl bg-cream-50">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gold-100 text-gold-700 font-heading font-bold text-sm shrink-0">
                {admin?.name?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading font-semibold text-sm text-espresso-900 truncate">{admin?.name}</p>
                <p className="font-body text-xs text-espresso-500">{roleLabels[admin?.role || ''] || admin?.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-cream-300 text-espresso-600 text-xs font-body hover:bg-cream-50 transition-colors cursor-pointer whitespace-nowrap"
                target="_blank"
              >
                <i className="ri-store-2-line text-sm"></i>{t('admin.navStore')}
              </Link>
              <button
                onClick={() => logout()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-cream-300 text-red-500 text-xs font-body hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-logout-box-r-line text-sm"></i>{t('admin.navLogout')}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={closeSidebar}
            />

            <motion.aside
              variants={sidebarPanelVariants}
              custom={isRtl}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag="x"
              dragConstraints={isRtl ? { left: 0, right: 0 } : { left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                const threshold = 80;
                const velocity = 400;
                const shouldClose = isRtl
                  ? info.offset.x > threshold || info.velocity.x > velocity
                  : info.offset.x < -threshold || info.velocity.x < -velocity;
                if (shouldClose) closeSidebar();
              }}
              dragSnapToOrigin={false}
              style={{ perspective: 1200 }}
              className={`fixed top-0 h-full w-72 max-w-[85vw] bg-white z-50 flex flex-col lg:hidden ${
                isRtl ? 'right-0 border-l border-cream-200 rounded-tl-2xl rounded-bl-2xl' : 'left-0 border-r border-cream-200 rounded-tr-2xl rounded-br-2xl'
              }`}
            >
              {sidebarContent}

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-cream-300 opacity-70 pointer-events-none" />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Edge swipe zone */}
      <div
        ref={edgeZoneRef}
        onTouchStart={handleEdgeTouchStart}
        onTouchMove={handleEdgeTouchMove}
        onTouchEnd={handleEdgeTouchEnd}
        onTouchCancel={handleEdgeTouchEnd}
        className={`lg:hidden fixed top-0 h-full w-8 z-35 cursor-pointer select-none ${
          isRtl ? 'right-0' : 'left-0'
        }`}
      >
        {/* Glow bar */}
        <motion.div
          className={`absolute top-1/2 -translate-y-1/2 h-28 w-2.5 rounded-full pointer-events-none ${
            isRtl ? 'right-1.5' : 'left-1.5'
          }`}
          style={{
            background: edgeGlow
              ? `linear-gradient(to bottom, transparent, rgba(212, 160, 60, 0.95), rgba(180, 130, 30, 0.85), rgba(212, 160, 60, 0.95), transparent)`
              : `linear-gradient(to bottom, transparent, rgba(180, 140, 70, 0.45), rgba(160, 120, 50, 0.35), rgba(180, 140, 70, 0.45), transparent)`,
            boxShadow: edgeGlow
              ? '0 0 18px 4px rgba(200, 150, 60, 0.5), 0 0 40px 8px rgba(200, 150, 60, 0.2)'
              : 'none',
          }}
          animate={{
            opacity: edgeGlow ? 1 : [0.5, 1, 0.5],
            scaleY: edgeGlow ? 1.25 : [0.85, 1.05, 0.85],
          }}
          transition={{
            opacity: edgeGlow ? { duration: 0.1 } : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
            scaleY: edgeGlow ? { duration: 0.1 } : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* Chevron onboarding hint — shows once, then fades forever */}
        <AnimatePresence>
          {showSwipeHint && (
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 8 : -8 }}
              animate={{ opacity: hintFadingOut ? 0 : 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? 8 : -8 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none ${
                isRtl ? 'right-3.5' : 'left-3.5'
              }`}
            >
              <motion.div
                animate={{
                  x: hintFadingOut ? 0 : (isRtl ? [0, -6, 0] : [0, 6, 0]),
                  scale: hintFadingOut ? 1 : [1, 1.3, 1],
                }}
                transition={{
                  x: hintFadingOut ? { duration: 0.3 } : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                  scale: hintFadingOut ? { duration: 0.3 } : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                <i
                  className={`${isRtl ? 'ri-arrow-left-s-line' : 'ri-arrow-right-s-line'} text-gold-600 text-sm`}
                  style={{ textShadow: '0 0 8px rgba(200, 150, 60, 0.5)' }}
                ></i>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <main className={`min-h-screen lg:${isRtl ? 'mr-64' : 'ml-64'}`}>
        {children}
      </main>
    </div>
  );
}