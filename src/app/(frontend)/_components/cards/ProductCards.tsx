// components/ProductCard.tsx
"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Image as ImageICON } from 'lucide-react';
import WishlistButton from '../pages/products/WishListBtn';
import AddToCartButton from '../pages/products/AddToCartButton';
import { TProduct } from '@/app/hooks/useProducts';
import ProductImageGallery from './ProductImageGallery';


interface ProductCardProps {
  product: TProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
     // Convert string prices to numbers for calculations
  const regularPrice = parseFloat(product.regularPrice as string) || 0;
  const salePrice = product.salePrice ? parseFloat(product.salePrice as string) : 0;
  
  // Calculate discount percentage
  const discountPercentage = salePrice > 0 && regularPrice > 0 
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      className=" backdrop-blur-md  font-montserrat rounded-md shadow-lg overflow-hidden border border-gray-100/25  transition-all duration-300 h-full flex flex-col"
    >
      {/* Product Image Area */}
      <div className="relative h-fit bg-gradient-to-br from-yellow-50/5 to-pink-50/5 overflow-hidden">
       
     
       
        <ProductImageGallery product={product} />
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            {discountPercentage}% OFF
          </div>
        )}
       <div className='absolute top-1 right-1'>
         <WishlistButton product={product}/>
       </div>
        
        {/* Add to Cart Button (appears on hover) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-3 right-3 bg-pink-500 text-white p-2 rounded-full shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
        >
          <ShoppingCartIcon className="h-5 w-5" />
        </motion.button>
      </div>
      
      {/* Product Info Area */}
      <div className="p-2 flex-grow flex flex-col">
        <div className="flex-grow">
            <Link  href={`/${product.slug}`}>
          <h3 className="font-normal md:font-medium  mb-1 line-clamp-2 text-[13px]">{product.productName}</h3>
            </Link>
          {/* <p className="text-gray-600 text-[12px] mb-3">{product.brandName || "Kids Toy"}</p> */}
          
          {/* Rating and Sales */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className={`h-4 w-4 ${i < 3 ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="text-gray-500 text-[11px] ml-1">(0)</span>
            </div>
            <span className="text-gray-500 text-[11px]">36 Sold</span>
          </div>
        </div>
        
        {/* Price Area */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {salePrice > 0 ? (
              <div className="flex items-center space-x-2">
                <span className="font-bold  text-md">৳{salePrice.toFixed(2)}</span>
                <span className="text-gray-500 line-through text-sm">৳{regularPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="font-bold text-gray-800 text-lg">৳{regularPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
        
        {/* Button Area */}
        <div className="flex items-center justify-between space-x-2">
            
          <Link href={`/${product.slug}`} className="  flex-grow">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full  text-xs py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-800 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300"
            >
              View Details
            </motion.button>
          </Link>
        
       <AddToCartButton cardBtn={true} product={product} qShow={false} 
       
       inStock={product.stockStatus === "In Stock"}
       />
        </div>

      </div>
    </motion.div>
  );
};

export default ProductCard;