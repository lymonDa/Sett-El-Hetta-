import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import MainLayout from '@/components/feature/MainLayout';
import { Reveal, SpringReveal, ScaleReveal, ParallaxImage, SectionHeader, LineDraw, PullQuote } from '@/components/feature/EditorialReveal';
import JsonLd from '@/components/feature/JsonLd';

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://settelhetta.com';

export default function OurStoryPage() {
  return (
    <MainLayout>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        '@id': `${siteUrl}/our-story#about`,
        'name': 'قصتنا | ست الحتة',
        'description': 'اكتشفي قصة ست الحتة — من أزقة خان الخليلي إلى معصمك. حكاية حرفة يدوية أصيلة توارثناها جيلاً بعد جيل. إكسسوارات مطلية بالذهب عيار ١٨، مصنوعة بحب وعناية في قلب القاهرة.',
        'url': `${siteUrl}/our-story`,
        'isPartOf': {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
        },
        'about': {
          '@type': 'JewelryStore',
          '@id': `${siteUrl}/#store`,
        },
      }} />

      {/* ══════════════════ CINEMATIC HERO ══════════════════ */}
      <section className="relative min-h-[420px] md:min-h-[520px] flex items-center overflow-hidden">
        <ParallaxImage
          src="https://readdy.ai/api/search-image?query=Egyptian%20artisan%20craftswoman%20hands%20working%20on%20delicate%20gold%20jewelry%20in%20traditional%20Khan%20El%20Khalili%20workshop%20Cairo%2C%20warm%20golden%20ambient%20light%20streaming%20through%20latticed%20wooden%20shutters%2C%20authentic%20vintage%20brass%20tools%20on%20aged%20wooden%20workbench%2C%20rich%20warm%20sepia%20and%20deep%20gold%20tones%2C%20editorial%20documentary%20photography%2C%20cinematic%20composition%2C%20sense%20of%20timeless%20heritage&width=1600&height=700&seq=story-hero&orientation=landscape"
          alt="Our Story"
          className="absolute inset-0"
          enterDelay={0}
          speed={0.08}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent z-10" />
        <div className="relative z-20 section-padding w-full py-16">
          <div className="max-w-lg">
            <Reveal delay={0.3} dir="none" duration={0.6}>
              <span className="font-heading text-xs sm:text-sm font-semibold tracking-[0.25em] text-gold-300 uppercase mb-3 block">
                Get to Know Us
              </span>
            </Reveal>
            <SpringReveal delay={0.45} dir="up" distance={40}>
              <h1 className="font-heading font-black text-3xl md:text-5xl text-white mb-4 leading-tight"
                style={{ textShadow: '0 2px 40px rgba(0,0,0,0.3)' }}>
                Our Story
              </h1>
            </SpringReveal>
            <Reveal delay={0.6} dir="up" distance={24} duration={0.7}>
              <p className="font-body text-lg text-white/80 leading-relaxed"
                style={{ textShadow: '0 1px 20px rgba(0,0,0,0.4)' }}>
                From the heart of Khan El Khalili to your wrist — a tale of authentic craftsmanship
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════ OPENING NARRATIVE ══════════════════ */}
      <section className="relative py-20 md:py-28 bg-white overflow-hidden">
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
              <ScaleReveal delay={0.1} className="order-2 lg:order-1">
                <ParallaxImage
                  src="https://readdy.ai/api/search-image?query=Close%20up%20Egyptian%20artisan%20hands%20carefully%20crafting%20and%20polishing%20a%20delicate%2018k%20gold%20bracelet%2C%20warm%20workshop%20lighting%2C%20authentic%20vintage%20gold%20and%20brass%20tools%20visible%20on%20weathered%20wooden%20surface%2C%20shallow%20depth%20of%20field%2C%20editorial%20documentary%20photography%2C%20rich%20warm%20sepia%20tones%20and%20glowing%20gold%20highlights%2C%20sense%20of%20heritage%20and%20craftsmanship&width=900&height=900&seq=story-artisan-hands&orientation=squarish"
                  alt="The Artisan"
                  className="aspect-square rounded-2xl"
                  speed={0.15}
                  enterDelay={0.1}
                />
              </ScaleReveal>

              <div className="order-1 lg:order-2">
                <Reveal delay={0.15} dir="none" duration={0.5}>
                  <span className="font-heading text-[11px] font-semibold tracking-[0.3em] text-gold-500 uppercase">
                    A Beginning in Cairo
                  </span>
                </Reveal>

                <SpringReveal delay={0.25} dir="up" distance={40}>
                  <h2 className="font-heading font-black text-3xl md:text-4xl text-espresso-900 mt-4 mb-6 leading-tight">
                    Born in the Alleys<br />of Khan El Khalili
                  </h2>
                </SpringReveal>

                <Reveal delay={0.4} dir="up" distance={24} duration={0.7}>
                  <p className="font-body text-base md:text-lg text-espresso-500 leading-relaxed mb-5">
                    Sett El Heta was born in the ancient alleyways of Khan El Khalili, where the scent of oud intertwines with the gleam of polished metals.
                    The story began with our founder Samah Al-Abyad's passion for the authentic Egyptian handcrafts she inherited from her mother and grandmother.
                  </p>
                </Reveal>

                <PullQuote delay={0.55}>
                  &ldquo;Every piece we craft carries the spirit of the place and the warmth of the hands that made it&rdquo;
                </PullQuote>

                <Reveal delay={0.7} dir="up" distance={24} duration={0.7}>
                  <p className="font-body text-base text-espresso-500 leading-relaxed">
                    Every piece we create carries within it the spirit of the place — the warmth of Egyptian gold, the purity of stainless steel that withstands the test of time,
                    and the loving care of the artisan who pours a piece of her soul into every creation.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ QUALITY SECTION ══════════════════ */}
      <section className="py-20 md:py-28 bg-cream-50">
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              label="Our Craft"
              title="Materials & Quality"
              description="We use medical-grade stainless steel plated with 18-karat gold, ensuring longevity and resistance to oxidation. Every piece goes through dozens of manual steps before reaching you."
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: 'ri-medal-line',
                  title: 'Exceptional Quality',
                  desc: 'Medical-grade steel plated with 18K gold — resistant, durable, and beautiful for years to come.',
                },
                {
                  icon: 'ri-hand-heart-line',
                  title: 'Fully Handcrafted',
                  desc: 'Every piece is shaped, assembled, and polished by hand — no two are exactly alike.',
                },
                {
                  icon: 'ri-map-pin-line',
                  title: 'From the Heart of Cairo',
                  desc: 'Khan El Khalili — the cultural heart of Egypt — is where every Sett El Heta piece begins its journey.',
                },
              ].map((feat, i) => (
                <ScaleReveal key={feat.title} delay={0.1 + i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className="p-8 rounded-2xl bg-white border border-cream-200 text-center transition-colors hover:border-gold-200"
                  >
                    <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-gold-50">
                      <i className={`${feat.icon} text-2xl text-gold-500`}></i>
                    </div>
                    <h3 className="font-heading font-bold text-base text-espresso-900 mb-2">{feat.title}</h3>
                    <p className="font-body text-sm text-espresso-500 leading-relaxed">{feat.desc}</p>
                  </motion.div>
                </ScaleReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ WORKSHOP SCENE ══════════════════ */}
      <section className="relative py-20 md:py-28 bg-white overflow-hidden">
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
              <div>
                <Reveal delay={0.1} dir="none" duration={0.5}>
                  <span className="font-heading text-[11px] font-semibold tracking-[0.3em] text-gold-500 uppercase">
                    The Workshop
                  </span>
                </Reveal>

                <SpringReveal delay={0.2} dir="up" distance={40}>
                  <h2 className="font-heading font-black text-3xl md:text-4xl text-espresso-900 mt-4 mb-6 leading-tight">
                    Where Every<br />Piece Begins
                  </h2>
                </SpringReveal>

                <Reveal delay={0.35} dir="up" distance={24} duration={0.7}>
                  <p className="font-body text-base md:text-lg text-espresso-500 leading-relaxed mb-5">
                    In our workshop tucked in the historic lanes of Khan El Khalili, we learned the secrets of the trade from master artisans,
                    passing them down generation after generation. We believe a piece of jewelry is not just an adornment —
                    it is an extension of your personality.
                  </p>
                </Reveal>

                <Reveal delay={0.5} dir="up" distance={20} duration={0.7}>
                  <p className="font-body text-base text-espresso-500 leading-relaxed">
                    A story you tell with every piece of Sett El Heta you wear. Each anklet, bracelet, and chain carries within it
                    decades of tradition and the loving hands of skilled craftswomen.
                  </p>
                </Reveal>
              </div>

              <ScaleReveal delay={0.15} className="lg:order-2">
                <ParallaxImage
                  src="https://readdy.ai/api/search-image?query=Traditional%20Khan%20El%20Khalili%20Cairo%20jewelry%20workshop%20interior%2C%20warm%20afternoon%20light%20through%20ornate%20wooden%20lattice%20windows%2C%20ancient%20stone%20walls%2C%20gold%20and%20silver%20jewelry%20displayed%20on%20weathered%20wooden%20shelves%2C%20authentic%20Egyptian%20artisan%20atmosphere%2C%20rich%20warm%20amber%20and%20gold%20tones%2C%20cinematic%20editorial%20documentary%20photography&width=900&height=700&seq=story-workshop-interior&orientation=landscape"
                  alt="Our Workshop"
                  className="aspect-[4/3] rounded-2xl"
                  speed={0.15}
                  enterDelay={0.15}
                />
              </ScaleReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="relative py-20 md:py-28 bg-espresso-900 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 0.12, scale: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="absolute inset-0"
        >
          <img
            src="https://readdy.ai/api/search-image?query=Macro%20shot%20of%20intricate%20gold%20jewelry%20texture%20close%20up%2C%20abstract%20pattern%20of%20golden%20metal%20links%20and%20delicate%20chains%2C%20dark%20moody%20background%2C%20ultra%20high%20detail%2C%20artistic%20macro%20photography&width=1600&height=700&seq=story-cta-bg&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="relative z-10 section-padding">
          <div className="max-w-2xl mx-auto text-center">
            <Reveal delay={0.1} dir="none" duration={0.6}>
              <span className="font-heading text-[11px] font-semibold tracking-[0.3em] text-gold-400 uppercase block mb-4">
                The Collection
              </span>
            </Reveal>
            <SpringReveal delay={0.2} dir="up" distance={40}>
              <h2 className="font-heading font-black text-3xl md:text-5xl text-white mb-4 leading-tight">
                Discover Our Collection
              </h2>
            </SpringReveal>
            <LineDraw delay={0.3} className="mx-auto mb-6" color="bg-gold-400" />
            <Reveal delay={0.4} dir="up" distance={20} duration={0.7}>
              <p className="font-body text-base md:text-lg text-white/75 mb-8 max-w-lg mx-auto leading-relaxed">
                Browse our latest handcrafted pieces made with care and love — each one a story waiting to be worn
              </p>
            </Reveal>
            <SpringReveal delay={0.5} dir="up" distance={24}>
              <Link to="/products" className="btn-primary px-10 py-4">
                Browse Products
              </Link>
            </SpringReveal>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}