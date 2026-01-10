'use client'
// components/ProductShowcaseHorizontal.tsx

import { motion } from 'framer-motion';
import ProductCard from '../cards/ProductCards';
import SkeletonCard from '../skeletons/SkeletonCard';
import { TProduct } from '@/app/hooks/useProducts';

interface ProductShowcaseProps {
  title: string;
  subtitle?: string;
  products: TProduct[];
  background?: 'white' | 'gray';
  loading?: boolean;
}



const ProductShowcaseHorizontal = ({ 
  title, 
  subtitle, 
  products, 
  background = 'white',
  loading = false 
}: ProductShowcaseProps) => {
  const bgColor = background === 'gray' ? 'bg-gray-50/5 backdrop-blur-sm' : 'bg-white/5 backdrop-blur-sm';
  
  return (
    <section className={` ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold dark:text-yellow-50 text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p 
              className="text-gray-600 dark:text-yellow-100 mt-2 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        
        {/* Product grid with horizontal scroll on mobile */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 md:overflow-visible md:px-0 scroll-smooth">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 min-w-max md:min-w-0">
            {loading ? (
              // Show skeleton cards while loading
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-[200px] md:w-auto">
                  <SkeletonCard />
                </div>
              ))
            ) : (
              // Show actual products when loaded
              products.map((product, index) => (
                <motion.div
                  key={index}
                  className="shrink-0 w-50 md:w-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.06}}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseHorizontal;