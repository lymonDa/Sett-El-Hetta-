import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading, loginError } = useAdminAuthStore();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const admin = await login(email, password);
    if (admin) {
      const returnUrl = searchParams.get('returnUrl');
      navigate(returnUrl || '/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="font-heading font-black text-3xl text-espresso-900">{t('brand.name')}</span>
          <div className="w-12 h-px bg-gold-400 mx-auto mt-3 mb-3" />
          <p className="font-body text-sm text-espresso-500">{t('admin.loginSubtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8"
        >
          <h1 className="font-heading font-bold text-xl text-espresso-900 mb-6 text-center">{t('admin.loginTitle')}</h1>

          {loginError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-body mb-4 border border-red-200">
              <i className="ri-error-warning-line"></i>
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.emailLabel')}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white" placeholder="owner@sett-el-hetta.com" dir="ltr" required />
            </div>
            <div>
              <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.passwordLabel')}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white" placeholder="••••••••" dir="ltr" required minLength={4} />
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2"><i className="ri-loader-4-line animate-spin"></i>{t('admin.loggingIn')}</span>
              ) : t('admin.loginButton')}
            </motion.button>
          </form>

          <div className="mt-6 pt-4 border-t border-cream-200">
            <p className="font-body text-xs text-espresso-500 text-center mb-3">{t('admin.testAccounts')}</p>
            <div className="space-y-1.5">
              {[
                { email: 'owner@sett-el-hetta.com', role: t('admin.role.owner'), desc: t('admin.role.ownerDesc'), pass: 'Owner1234' },
                { email: 'staff@sett-el-hetta.com', role: t('admin.role.staff'), desc: t('admin.role.staffDesc'), pass: 'Staff1234' },
                { email: 'delivery@sett-el-hetta.com', role: t('admin.role.delivery'), desc: t('admin.role.deliveryDesc'), pass: 'Deliver1234' },
              ].map((acc) => (
                <motion.button
                  key={acc.email}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                  className="w-full p-2.5 rounded-xl bg-cream-50 hover:bg-cream-100 transition-colors border border-cream-200 cursor-pointer text-left"
                >
                  <p className="font-body text-xs text-espresso-900">{acc.email}</p>
                  <p className="font-body text-xs text-espresso-500">{acc.role} — {acc.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}