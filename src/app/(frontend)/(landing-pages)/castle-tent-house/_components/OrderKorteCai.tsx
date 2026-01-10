
'use client'


import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';

const OrderKorteCai = () => {
  // Use a ref for the section to detect when it comes into view
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true }); // `once: true` ensures the animation triggers only once
const router= useRouter()
  const handleAddToCart = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: 'Castle Tent House',
      value: 2350,
      currency: 'BDT',
    });
  }
  router.push("#order-form")
};

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      <section className="flex justify-center">
        
          <div className="md:mx-auto my-3 max-w-72 mx-2">
            <Button onPress={handleAddToCart} className="text-gray-50 p-8 md:p-10 animate-pulse transition-shadow shadow-xl shadow-sky-600 duration-1000 hover:bg-sky-500 bg-pink-400 gap-2 flex flex-col text-xl md:text-3xl font-bold items-center justify-center">
              অর্ডার করতে চাই !
            </Button>
          </div>
       
      </section>
    </motion.div>
  );
};

export default OrderKorteCai;
