import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: t('footer.links'),
      links: [
        { path: '/', label: 'nav.home' },
        { path: '/products', label: 'nav.products' },
        { path: '/our-story', label: 'nav.ourStory' },
        { path: '/gallery', label: 'nav.gallery' },
        { path: '/contact', label: 'nav.contact' },
      ],
    },
    {
      title: t('footer.customerService'),
      links: [
        { path: '/track-order', label: 'nav.trackOrder' },
        { path: '/blog', label: 'nav.blog' },
        { path: '/contact', label: 'nav.contact' },
        { path: '/our-story', label: 'nav.ourStory' },
      ],
    },
  ];

  return (
    <footer className="relative bg-espresso-950 text-cream-200 overflow-hidden mt-auto">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #D4A017 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      <div className="section-padding relative z-10 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="inline-block mb-5">
              <span className="font-heading font-black text-3xl text-gradient-gold">
                {t('footer.brand')}
              </span>
            </Link>
            <p className="font-body text-sm text-cream-400/70 leading-relaxed max-w-sm mb-6">
              {t('footer.tagline')}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: 'ri-instagram-line', href: 'https://instagram.com', label: 'Instagram' },
                { icon: 'ri-facebook-fill', href: 'https://facebook.com', label: 'Facebook' },
                { icon: 'ri-tiktok-line', href: 'https://tiktok.com', label: 'TikTok' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-cream-300 hover:text-gold-400 hover:border-gold-400/30 hover:bg-gold-400/5 transition-all duration-300"
                  aria-label={social.label}
                >
                  <i className={`${social.icon} text-base`}></i>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-heading font-bold text-sm text-cream-200 mb-5">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="font-body text-sm text-cream-400/60 hover:text-gold-400 transition-colors duration-300"
                    >
                      {link.label.startsWith('nav.') ? t(link.label) : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-sm text-cream-200 mb-5">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-400/10 flex items-center justify-center shrink-0 mt-0.5">
                  <i className="ri-map-pin-line text-gold-400 text-sm"></i>
                </div>
                <span className="font-body text-sm text-cream-400/60 leading-relaxed">
                  {t('footer.address')}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-400/10 flex items-center justify-center shrink-0">
                  <i className="ri-phone-line text-gold-400 text-sm"></i>
                </div>
                <span className="font-body text-sm text-cream-400/60">
                  {t('footer.phone')}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-400/10 flex items-center justify-center shrink-0">
                  <i className="ri-mail-line text-gold-400 text-sm"></i>
                </div>
                <span className="font-body text-sm text-cream-400/60">hello@sett-el-hetta.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/5 relative z-10">
        <div className="section-padding py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-cream-400/40">
            {t('footer.copyright', { year: currentYear })}
          </p>
          <p className="font-body text-xs text-cream-400/30">
            {t('footer.madeWith')}
          </p>
        </div>
      </div>
    </footer>
  );
}