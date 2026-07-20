import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

const languages = [
  { code: 'en', label: 'EN', native: 'English' },
  { code: 'ar', label: 'عربي', native: 'العربية' },
];

interface LanguageSwitcherProps {
  scrolled?: boolean;
}

export default function LanguageSwitcher({ scrolled = false }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
  };

  const isAr = i18n.language === 'ar';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLang}
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-heading font-semibold text-xs transition-all duration-300 cursor-pointer ${
        scrolled
          ? 'text-espresso-700 hover:bg-gold-50 border border-cream-300'
          : 'text-white/80 hover:text-white hover:bg-white/10 border border-white/20'
      }`}
      title={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <span className="text-[10px] opacity-50">🌐</span>
      <span>{isAr ? 'EN' : 'عربي'}</span>
    </motion.button>
  );
}