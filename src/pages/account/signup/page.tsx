import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCustomerAuthStore } from '@/stores/customerAuthStore';
import MainLayout from '@/components/feature/MainLayout';
import { Reveal, SpringReveal, ScaleReveal, PageHeader } from '@/components/feature/EditorialReveal';

export default function CustomerSignupPage() {
  const navigate = useNavigate();
  const { signUp, isLoading, authError, clearError, user } = useCustomerAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    setLocalError('');

    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setLocalError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (!/^01[0-9]{9}$/.test(phone.trim())) {
      setLocalError('Please enter a valid Egyptian phone number');
      return;
    }

    const success = await signUp(name.trim(), phone.trim(), email.trim(), password);
    if (success) {
      setSuccessMessage('Account created successfully! Redirecting to your orders...');
      setTimeout(() => {
        navigate('/account/orders', { replace: true });
      }, 1500);
    }
  };

  const displayError = localError || authError;

  return (
    <MainLayout>
      <PageHeader title="Create Account" description="Create your account to easily track your orders" />

      <section className="bg-cream-50 min-h-[calc(100vh-80px)]">
        <div className="section-padding py-12 md:py-20">
          <div className="max-w-md mx-auto">
            <ScaleReveal delay={0.1}>
              <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8">
                {successMessage ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center border border-green-200">
                      <i className="ri-check-line text-2xl text-green-600"></i>
                    </div>
                    <p className="font-heading font-semibold text-base text-espresso-900">{successMessage}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {displayError && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-body border border-red-200">
                        <i className="ri-error-warning-line shrink-0"></i>
                        <span>{displayError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">Full Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" required className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all" />
                    </div>

                    <div>
                      <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">Phone Number</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" required className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all" dir="ltr" />
                    </div>

                    <div>
                      <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">Email</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" required className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all" dir="ltr" />
                    </div>

                    <div>
                      <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">Password</label>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all" dir="ltr" />
                    </div>

                    <div>
                      <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">Confirm Password</label>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all" dir="ltr" />
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-full bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2"><i className="ri-loader-4-line animate-spin"></i>Creating account...</span>
                      ) : (
                        'Create Account'
                      )}
                    </motion.button>
                  </form>
                )}

                {!successMessage && (
                  <div className="mt-6 pt-5 border-t border-cream-200 text-center">
                    <p className="font-body text-sm text-espresso-500">
                      Already have an account?{' '}
                      <Link to="/account/login" className="font-heading font-semibold text-gold-600 hover:text-gold-700 transition-colors">
                        Login
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </ScaleReveal>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}