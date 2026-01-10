'use client';

import React from 'react';

interface ProductDescriptionProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  value = '',
  onChange,
  placeholder = 'Enter a detailed product description...',
}) => {
  return (
    <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-700 mb-4"
      >
        Product Description
      </label>

      <textarea
        id="description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-primary-500
                   resize-y bg-white"
      />

      <p className="text-xs text-gray-500 mt-2">
        You can use line breaks for readability. HTML & markdown can be added later.
      </p>
    </div>
  );
};

export default ProductDescription;
