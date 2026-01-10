// components/ProductShowcasenAnimation.tsx
import ProductCard from '../cards/ProductCards';
import SearchBar from '../SearchBar';

import SkeletonCard from '../skeletons/SkeletonCard';
import { TProduct } from '@/app/hooks/useProducts';

interface ProductShowcasenAnimationProps {
  title: string;
  subtitle?: string;
  products: TProduct[];
  background?: 'white' | 'gray';
  loading?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  searchQuery?: string; // Add searchQuery prop to receive the current query
}

const ProductShowcasenAnimation = ({ 
  title, 
  subtitle, 
  products, 
  background = 'white',
  loading = false,
  onSearch,
  searchPlaceholder = "Search products...",
  searchQuery = "" // Default to empty string
}: ProductShowcasenAnimationProps) => {
  
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true; // If no search query, show all products
    
    const productName = product.productName || product.productName || ""; // Handle different naming conventions
    const description = product.description || "";
    
    const nameMatch = productName.toLowerCase().includes(searchQuery.toLowerCase());
    const descriptionMatch = description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return nameMatch || descriptionMatch;
  });

  return (
    <section className={`py-16 ${background === 'gray' ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold dark:text-yellow-50 text-gray-800">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 dark:text-yellow-100 mt-2 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Sticky Search Bar */}
        {onSearch && (
          <div className="mb-8">
            <SearchBar 
              onSearch={onSearch} 
              placeholder={searchPlaceholder}
              initialQuery={searchQuery} // Pass initial query to SearchBar
            />
          </div>
        )}
        
        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
          {loading ? (
            // Show skeleton cards while loading
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="w-full">
                <SkeletonCard />
              </div>
            ))
          ) : (
            // Show actual products when loaded
            filteredProducts.map((product,i) => (
              <div
                key={i}
                className="w-full"
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcasenAnimation;