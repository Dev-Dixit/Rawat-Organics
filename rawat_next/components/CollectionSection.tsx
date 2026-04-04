'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

const products = [
  {
    title: 'Organic Grains',
    description: 'Ancient varieties preserved through generations, harvested at their nutritional peak.',
    imgSrc: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    imgAlt: 'Organic whole grains in wooden bowls on rustic stone table',
    icon: 'grass',
  },
  {
    title: 'Heritage Spices',
    description: 'Single-origin aromatics that transform the kitchen into a sensory workshop.',
    imgSrc: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
    imgAlt: 'Vibrant exotic spices saffron cinnamon star anise on dark background',
    icon: 'restaurant',
  },
  {
    title: 'Pure Oils',
    description: 'Cold-pressed elixirs retaining the vital nutrients and intense flavors of the source.',
    imgSrc: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80',
    imgAlt: 'Golden cold-pressed organic oil poured into clear glass bottle',
    icon: 'water_drop',
  },
  {
    title: 'Exotic Dry Fruits',
    description: 'Sun-dried treasures from around the world, handled with artisan care.',
    imgSrc: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80',
    imgAlt: 'Dried apricots figs almonds on marble platter',
    icon: 'nutrition',
  },
]

export default function CollectionSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 bg-surface-container-low" id="collection" ref={ref}>
      <div className="max-w-screen-2xl mx-auto px-8">
        {/* Header */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-primary font-headline font-extrabold text-4xl md:text-5xl mb-4">
            Curated Collections
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {products.map((product, i) => (
            <motion.div
              key={product.title}
              className="group relative overflow-hidden rounded-[2rem] editorial-shadow bg-surface-container-lowest"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Image */}
              <div className="aspect-[16/10] overflow-hidden relative">
                <Image
                  src={product.imgSrc}
                  alt={product.imgAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Category badge */}
                <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    {product.icon}
                  </span>
                  {product.title}
                </div>
              </div>

              {/* Card body */}
              <div className="p-10">
                <h3 className="text-primary font-headline font-bold text-3xl mb-4">
                  {product.title}
                </h3>
                <p className="text-on-surface/70 mb-8 leading-relaxed">{product.description}</p>
                <button className="px-8 py-3 bg-primary-container text-on-primary-container rounded-full font-headline font-bold text-sm transition-all duration-300 hover:bg-primary hover:text-on-primary active:scale-95">
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
