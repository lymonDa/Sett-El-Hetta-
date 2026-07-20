import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

interface WhatsAppButtonProps {
  message?: string;
}

export default function WhatsAppButton({ message }: WhatsAppButtonProps) {
  const { t } = useTranslation();
  const phoneNumber = '201012345678';
  const defaultMessage = message || t('whatsapp.defaultMessage');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg group"
      style={{
        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
      }}
      aria-label={t('home.whatsapp.cta')}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-2xl bg-[#25D366]/30"
      />
      <i className="ri-whatsapp-line text-2xl text-white relative z-10"></i>
    </motion.a>
  );
}