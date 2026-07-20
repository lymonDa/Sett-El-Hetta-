import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@/types';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { t } = useTranslation();
  const imageUrl = product.media[0]?.url || '';
  const isOutOfStock = product.stockQty === 0;

  const stockInfo = isOutOfStock
    ? { label: t('products.outOfStock'), color: 'bg-red-50 text-red-700' }
    : product.stockQty <= 5
      ? { label: t('products.lowStock'), color: 'bg-amber-50 text-amber-700' }
      : { label: t('products.inStock'), color: 'bg-emerald-50 text-emerald-700' };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card-luxury group flex flex-col relative"
    >
      {/* Premium warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-50 via-white/90 to-cream-100/70 pointer-events-none" />

      <div className="relative flex flex-col flex-1">
        {/* Image */}
        <Link
          to={`/products/${product.slug}`}
          className="relative block aspect-square overflow-hidden bg-cream-200"
        >
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {product.isBundle && (
            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs font-heading font-bold text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #D4A017, #C8950F)' }}>
              Set
            </div>
          )}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-heading font-semibold ${stockInfo.color}`}>
            {stockInfo.label}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-espresso-900/0 group-hover:bg-espresso-900/10 transition-all duration-500 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="font-heading font-bold text-sm text-white bg-espresso-900/60 backdrop-blur-sm px-6 py-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              {t('products.viewDetails')}
            </motion.span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <Link to={`/products/${product.slug}`} className="block mb-1.5">
            <h3 className="font-heading font-bold text-base text-espresso-900 group-hover:text-gold-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="font-body text-sm text-espresso-400 line-clamp-2 mb-4 flex-1 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between gap-3 mt-auto">
            <span className="font-heading font-black text-lg text-gold-600">
              {product.price.toLocaleString('ar-EG')}{' '}
              <span className="text-sm font-medium text-espresso-400">{t('common.EGP')}</span>
            </span>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isOutOfStock) {
                  addItem(product);
                }
              }}
              disabled={isOutOfStock}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                isOutOfStock
                  ? 'bg-cream-200 text-espresso-300 cursor-not-allowed'
                  : 'bg-espresso-900 text-white hover:bg-gold-600 shadow-sm hover:shadow-md'
              }`}
              aria-label={t('products.addToCart')}
            >
              <i className="ri-shopping-bag-3-line text-lg"></i>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}