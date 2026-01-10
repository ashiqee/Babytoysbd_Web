// components/ProductGallery.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-gray-500">No images available</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[selectedImage] || '/placeholder-product.jpg'}
          alt={`${productName} - Image ${selectedImage + 1}`}
          fill
          className="object-contain hover:scale-150 duration-1000 hover:cursor-pointer"
          priority
        />
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`aspect-square relative overflow-hidden rounded-md border-2 ${
                selectedImage === index ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image || '/placeholder-product.jpg'}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}