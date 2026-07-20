import { useState } from 'react';
import { motion } from 'motion/react';
import MainLayout from '@/components/feature/MainLayout';
import { Reveal, SpringReveal, ScaleReveal, PageHeader } from '@/components/feature/EditorialReveal';
import JsonLd from '@/components/feature/JsonLd';

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://settelhetta.com';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '', website_alt: '',
  });
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.website_alt.trim()) {
      setStatus('success');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const formElement = e.currentTarget;
    const payload = new FormData(formElement);
    payload.delete('website_alt');

    const body = new URLSearchParams();
    payload.forEach((value, key) => {
      body.append(key, value as string);
    });

    try {
      const res = await fetch('https://readdy.ai/api/form/d9ejraedn0rfb35c66ag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      const responseText = await res.text();
      let parsed: { code?: string; meta?: { message?: string; detail?: string } } = {};
      try { parsed = JSON.parse(responseText); } catch { /* not JSON */ }

      const serverMsg = parsed?.meta?.message || parsed?.meta?.detail || responseText;
      const isSpam = typeof serverMsg === 'string' && serverMsg.toLowerCase().includes('spam');

      if (res.ok && parsed?.code === 'OK' && !isSpam) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', website_alt: '' });
      } else {
        setStatus('error');
        setErrorMessage(isSpam ? 'Message rejected. Please try again.' : (serverMsg || 'An error occurred, please try again.'));
      }
    } catch {
      setStatus('error');
      setErrorMessage('Could not connect to server, please try again later.');
    }
  };

  return (
    <MainLayout>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        '@id': `${siteUrl}/contact#contact`,
        'name': 'اتصل بنا | ست الحتة',
        'description': 'للاستفسارات عن منتجات ست الحتة، الطلبات الخاصة، أو أي سؤال — يسعدنا التواصل معك. نجيب على رسائلكم من خان الخليلي، القاهرة.',
        'url': `${siteUrl}/contact`,
        'isPartOf': {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
        },
      }} />

      <PageHeader
        label="Get in Touch"
        title="Contact Us"
        description="We'd be happy to answer your inquiries"
        bgImage="https://readdy.ai/api/search-image?query=Elegant%20hand%20writing%20calligraphy%20letter%20on%20cream%20parchment%20paper%20with%20gold%20fountain%20pen%2C%20warm%20soft%20natural%20light%2C%20delicate%20gold%20jewelry%20in%20soft%20focus%20background%2C%20editorial%20still%20life%20photography%2C%20warm%20cream%20and%20gold%20tones%2C%20luxurious%20refined%20atmosphere&width=1600&height=600&seq=contact-hero&orientation=landscape"
      />

      <section className="bg-cream-50 py-12 md:py-16">
        <div className="section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <SpringReveal delay={0.1} dir="up" distance={40}>
                  <div className="p-10 rounded-2xl bg-white border border-cream-200 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-50 border border-green-200">
                      <i className="ri-check-line text-3xl text-green-600"></i>
                    </div>
                    <h2 className="font-heading font-bold text-xl text-espresso-900 mb-2">
                      Thank You for Contacting Us
                    </h2>
                    <p className="font-body text-base text-espresso-500">
                      Your message has been received and we will get back to you as soon as possible
                    </p>
                  </div>
                </SpringReveal>
              ) : (
                <ScaleReveal delay={0.1}>
                  <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8 space-y-5"
                    data-readdy-form
                    id="contact-form"
                  >
                    <input
                      type="text"
                      name="website_alt"
                      value={formData.website_alt}
                      onChange={(e) => setFormData({ ...formData, website_alt: e.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      readOnly
                      style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '1px', height: '1px', opacity: 0 }}
                    />

                    <Reveal delay={0.05} dir="up" distance={20} duration={0.6}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">Name *</label>
                          <input
                            type="text" name="name" value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">Email *</label>
                          <input
                            type="email" name="email" value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white"
                            placeholder="example@email.com" dir="ltr"
                          />
                        </div>
                      </div>
                    </Reveal>

                    <Reveal delay={0.1} dir="up" distance={20} duration={0.6}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">Phone Number</label>
                          <input
                            type="tel" name="phone" value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white"
                            placeholder="01xxxxxxxxx" dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">Subject *</label>
                          <input
                            type="text" name="subject" value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white"
                            placeholder="Product inquiry, custom order..."
                          />
                        </div>
                      </div>
                    </Reveal>

                    <Reveal delay={0.15} dir="up" distance={20} duration={0.6}>
                      <div>
                        <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">Message *</label>
                        <textarea
                          name="message" value={formData.message}
                          onChange={(e) => {
                            if (e.target.value.length <= 500) setFormData({ ...formData, message: e.target.value });
                          }}
                          required rows={5} maxLength={500}
                          className="w-full px-4 py-3 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all resize-none bg-white"
                          placeholder="Write your message here..."
                        />
                        <p className="text-xs text-espresso-400 text-left mt-1">{formData.message.length}/500</p>
                      </div>
                    </Reveal>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
                        <i className="ri-error-warning-line"></i>{errorMessage}
                      </div>
                    )}

                    <Reveal delay={0.2} dir="up" distance={20} duration={0.6}>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn-primary w-full py-4 text-base disabled:opacity-50"
                      >
                        {status === 'loading' ? (
                          <span className="flex items-center justify-center gap-2">
                            <i className="ri-loader-4-line animate-spin"></i>Sending...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <i className="ri-send-plane-2-line"></i>Send Message
                          </span>
                        )}
                      </motion.button>
                    </Reveal>
                  </form>
                </ScaleReveal>
              )}
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-5">
              <ScaleReveal delay={0.15}>
                <div className="p-6 rounded-2xl bg-white border border-cream-200">
                  <h3 className="font-heading font-bold text-base text-espresso-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    {[
                      { icon: 'ri-map-pin-line', label: 'Address', value: 'Khan El Khalili, Cairo, Egypt' },
                      { icon: 'ri-phone-line', label: 'Phone', value: '+20 10 1234 5678', dir: 'ltr' as const },
                      { icon: 'ri-mail-line', label: 'Email', value: 'hello@sett-el-hetta.com', dir: 'ltr' as const },
                    ].map((info, i) => (
                      <Reveal key={info.label} delay={0.15 + i * 0.08} dir="up" distance={20} duration={0.5}>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gold-50 shrink-0">
                            <i className={`${info.icon} text-gold-500`}></i>
                          </div>
                          <div>
                            <p className="font-heading font-medium text-xs text-espresso-500 mb-0.5">{info.label}</p>
                            <p className="font-body text-sm text-espresso-900" dir={info.dir}>{info.value}</p>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </ScaleReveal>

              <ScaleReveal delay={0.25}>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://wa.me/201012345678?text=Hello"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gold-500 text-white font-heading font-semibold hover:bg-gold-600 transition-colors"
                >
                  <i className="ri-whatsapp-line text-xl"></i>Chat on WhatsApp
                </motion.a>
              </ScaleReveal>

              <ScaleReveal delay={0.3}>
                <div className="flex gap-3">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-cream-300 text-espresso-600 hover:text-gold-600 hover:border-gold-300 transition-colors text-sm font-body"
                  >
                    <i className="ri-instagram-line text-lg"></i>Instagram
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-cream-300 text-espresso-600 hover:text-gold-600 hover:border-gold-300 transition-colors text-sm font-body"
                  >
                    <i className="ri-facebook-fill text-lg"></i>Facebook
                  </motion.a>
                </div>
              </ScaleReveal>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}