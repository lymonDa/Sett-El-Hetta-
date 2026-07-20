import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCustomerAuthStore } from '@/stores/customerAuthStore';
import MainLayout from '@/components/feature/MainLayout';
import { Reveal, SpringReveal, ScaleReveal, PageHeader } from '@/components/feature/EditorialReveal';

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, authError, clearError, user } = useCustomerAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    clearError();
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/account/orders', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    const success = await login(email.trim(), password);
    if (success) {
      navigate('/account/orders', { replace: true });
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Login" description="Sign in to track your orders and check their status" />

      <section className="bg-cream-50 min-h-[calc(100vh-80px)]">
        <div className="section-padding py-12 md:py-20">
          <div className="max-w-md mx-auto">
            <ScaleReveal delay={0.1}>
              <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {authError && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-body border border-red-200">
                      <i className="ri-error-warning-line shrink-0"></i>
                      <span>{authError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all"
                      dir="ltr"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || !email.trim() || !password.trim()}
                    className="w-full py-3 rounded-full bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <i className="ri-loader-4-line animate-spin"></i>
                        Logging in...
                      </span>
                    ) : (
                      'Login'
                    )}
                  </motion.button>
                </form>

                <div className="mt-6 pt-5 border-t border-cream-200 text-center">
                  <p className="font-body text-sm text-espresso-500">
                    Don&apos;t have an account?{' '}
                    <Link to="/account/signup" className="font-heading font-semibold text-gold-600 hover:text-gold-700 transition-colors">
                      Create Account
                    </Link>
                  </p>
                </div>
              </div>
            </ScaleReveal>

            <Reveal delay={0.3} dir="up" distance={16}>
              <div className="mt-6 text-center">
                <Link to="/track-order" className="inline-flex items-center gap-1.5 font-body text-sm text-espresso-500 hover:text-gold-600 transition-colors">
                  <i className="ri-truck-line"></i>
                  Track order without logging in
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}