import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { useTranslation } from 'react-i18next';
import type { AdminRole } from '@/types';

interface AdminGuardProps {
  children: React.ReactNode;
  requireRole?: AdminRole;
}

export default function AdminGuard({ children, requireRole }: AdminGuardProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, isAuthenticated } = useAdminAuthStore();

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAdminAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    if (useAdminAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return () => {
      unsub();
    };
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="flex items-center gap-2 text-espresso-500 font-body text-sm">
          <i className="ri-loader-4-line animate-spin text-lg"></i>
          {t('common.loading')}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !admin) {
    const returnUrl = location.pathname + location.search;
    return <Navigate to={`/admin/login?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
  }

  if (!admin.active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-red-50 text-red-500 mb-5">
            <i className="ri-user-unfollow-line text-2xl"></i>
          </div>
          <h2 className="font-heading font-bold text-lg text-espresso-900 mb-2">{t('admin.guard.accountDisabled')}</h2>
          <p className="font-body text-sm text-espresso-500 mb-5">{t('admin.guard.accountDisabledDesc')}</p>
          <button
            onClick={() => {
              useAdminAuthStore.getState().logout();
              navigate('/admin/login');
            }}
            className="px-6 py-2.5 rounded-xl bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 transition-colors cursor-pointer whitespace-nowrap"
          >
            {t('admin.guard.backToLogin')}
          </button>
        </div>
      </div>
    );
  }

  if (requireRole && admin.role !== requireRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-yellow-50 text-yellow-600 mb-5">
            <i className="ri-shield-keyhole-line text-2xl"></i>
          </div>
          <h2 className="font-heading font-bold text-lg text-espresso-900 mb-2">{t('admin.guard.accessDenied')}</h2>
          <p className="font-body text-sm text-espresso-500 mb-5">{t('admin.guard.accessDeniedDesc')}</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-6 py-2.5 rounded-xl bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 transition-colors cursor-pointer whitespace-nowrap"
          >
            {t('admin.guard.goToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}