
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { landingSite } from '../config/landingSite';


const OfferPriceCard = () => {

    const ref = useRef(null);
  const isInView = useInView(ref, { once: true }); // `once: true` ensures the animation triggers only once


    return (
        <motion.div
        ref={ref}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        className="card-wrapper md:mx-auto lg:my-3 h-[100px] shadow-md shadow-sky-500/45 mx-2 lg:w-[800px]"
        initial={{ opacity: 0, scale: 0.5 }}
      
        
        transition={{ duration: 0.5 }}>
        <div className="card-content  gap-2 flex flex-col text-xl md:text-2xl font-bold items-center justify-center ">
          <h2 className='mt-4'>
            রেগুলার প্রাইজঃ{" "}
            <span className="line-through">
              {landingSite.productDetails.price}
            </span>{" "}
            টাকা
          </h2>
          <h2 className="text-sky-400">
            অফার প্রাইজঃ {landingSite.productDetails.offerPrice} টাকা
          </h2>
        </div>
      </motion.div>
    );
};

export default OfferPriceCard;