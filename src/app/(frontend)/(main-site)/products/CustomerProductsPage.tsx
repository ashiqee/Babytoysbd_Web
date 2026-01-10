"use client"
import { useState, useEffect, useCallback } from 'react';
import { useProducts } from '@/app/hooks/useProducts';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '../../_components/cards/ProductCards';
import CartButton from '../../_components/shared/CartButton';
import { Filter } from 'lucide-react';
import CartSidebar from '../../_components/shared/CartSideBar';

const CustomerProductsPage = () => {
  const { 
    products, 
    pagination, 
    loading, 
    searching, 
    error, 
    filters,
    updateFilter,
    goToPage,
    changeLimit
  } = useProducts();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for UI controls
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [viewFilterMode, setFilterViewMode] = useState(false);
  const [viewSearch, setViewSearch] = useState('');
  
  // Initialize with published products only
  useEffect(() => {
    updateFilter('status', 'published');
  }, [updateFilter]);
  

   
  // Sync URL parameters with component state on mount
  useEffect(() => {

       const search = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const tags = searchParams.get('tags') || '';
    if (search) updateFilter('search', search);
    if (category)updateFilter('category', category);
    if (tags)updateFilter('tags', tags);


  }, [searchParams, updateFilter]);
  
  // Product categories
  const categories = [
    'All',
    'Building Toys',
    'Dolls & Plush',
    'Action Figures',
    'STEM & Educational',
    'Outdoor & Sports',
    'Games & Puzzles',
    'Arts & Crafts',
    'Pretend Play',
    'Remote Control & Vehicles'
  ];
  
  // Age groups
  const ageGroups = [
    'All',
    'Newborn Toys (0-6 Months)',
    'Baby Toys (6-12 Months)',
    'Toddler Toys (1-3 Years)',
    'Preschool Toys (3-5 Years)',
    'Kids Toys (5-8 Years)',
    'Tween Toys (9-12 Years)',
    'Mother Care'
  ];
  
  // Sorting options
  const sortOptions = [
    { value: 'createdAt_desc', label: 'Newest Arrivals' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'popularity_desc', label: 'Most Popular' }
  ];
  
  // Handle filter changes
  const handleCategoryChange = (category: string) => {
    updateFilter('category', category === 'All' ? '' : category);
    updateFilter('search', '');
    updateFilter('tags', '');
      setFilterViewMode(!viewFilterMode)
      setViewSearch(category)
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split('_');
    updateFilter('sortBy', sortBy);
    updateFilter('sortOrder', sortOrder as 'asc' | 'desc');
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('search', e.target.value);
    updateFilter('tags', '');
    updateFilter('category', '');
      setFilterViewMode(!viewFilterMode)
      setViewSearch(e.target.value)
  };
  
  const handlePriceChange = (values: [number, number]) => {
    setPriceRange(values);
    // In a real implementation, you would update the filter with these values
  };
  
  const handleAgeChange = (age: string) => {
    updateFilter('tags', age === 'All' ? '' : age);
    updateFilter('category', '');
    updateFilter('search', '');
     setViewSearch(age)
     setFilterViewMode(!viewFilterMode)
  };
  
  // Function to update URL with current filters
  const updateUrlWithFilters = useCallback(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('q', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.tags) params.set('tags', filters.tags);
    
    const queryString = params.toString();
    const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;
  
    // Update URL without triggering navigation
    window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
  }, [filters]);
  
  // Update URL when filters change
  useEffect(() => {
    updateUrlWithFilters();
    
  }, [filters, updateUrlWithFilters]);
  
  // Product Card Component
  const ProductCardTwo = ({ product }: { product: any }) => {
    const discount = product.originalPrice && product.originalPrice > product.price 
      ? Math.round((1 - product.price / product.originalPrice) * 100) 
      : 0;
    
    return (
      <div className="bg-white/45 rounded-md shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg group">
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
            {product.quantity === 0 && (
              <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
            <button className="bg-white/45 p-2 rounded-full shadow-md hover:bg-gray-100">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button className="bg-white/45 p-2 rounded-full shadow-md hover:bg-gray-100">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
              <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium text-gray-700 ml-1">4.8</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
              <p className="text-lg font-bold text-indigo-600">${product.price}</p>
            </div>
            
            <button 
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                product.quantity > 0 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              disabled={product.quantity === 0}
              onClick={() => {
                // Add to cart logic
                alert(`Added ${product.name} to cart!`);
              }}
            >
              {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    );
  };

 
  
  
  return (
    <div className='pt-10 z-50'>
      {/* Header */}
      <header className="bg-white/45 dark:bg-black/25 shadow-sm">
        <div className="container mx-auto px-4 py-6 md:px-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="md:text-3xl text-xl font-bold dark:text-yellow-100 text-gray-900">Shop the Best Toys Collection Online for Kids</h1>
              <h2 className="dark:text-yellow-50 text-gray-600">Discover amazing toys for all ages</h2>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search toys..."
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filters.search}
                  onChange={handleSearchChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button 
                  onClick={() => setFilterViewMode(!viewFilterMode)}
                  className={`p-2 md:hidden rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                 <Filter className='h-5 w-5'/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto  py-4 ">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className={`w-full lg:w-64 ${viewFilterMode ? "":"hidden md:block"} md:flex-shrink-0`}>
            <div className="bg-white/45 dark:bg-black/25 rounded-md shadow p-6 sticky top-6">
              <h2 className="text-lg font-bold dark:text-yellow-50 text-gray-900 mb-4">Filters</h2>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium dark:text-yellow-50 text-gray-900 mb-2">Category</h3>
                <ul className="space-y-1">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          (category === 'All' && filters.category === '') || 
                          filters.category === category
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-gray-700 dark:text-yellow-50 dark:hover:bg-slate-600/25 hover:bg-gray-100'
                        }`}
                        onClick={() => handleCategoryChange(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Age Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium dark:text-yellow-50 text-gray-900 mb-2">Age Group</h3>
                <ul className="space-y-1">
                  {ageGroups.map((age) => (
                    <li key={age}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          (age === 'All' && filters.tags === '') || 
                          filters.tags === age
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-gray-700 dark:text-yellow-50 dark:hover:bg-slate-600/25 hover:bg-gray-100'
                        }`}
                        onClick={() => handleAgeChange(age)}
                      >
                        {age}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Price Range Filter */}
              {/* <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Price Range</h3>
                <div className="px-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div> */}
              
              {/* Reset Filters */}
              <button 
                className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white/45 hover:bg-gray-50"
                onClick={() => {
                  updateFilter('category', '');
                  updateFilter('search', '');
                  updateFilter('tags', '');
                  setPriceRange([0, 100]);
                  setFilterViewMode(!viewFilterMode)
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          {/* Main Content - Products */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-white/45 rounded-md shadow p-4">
              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> {viewSearch} products
              </div>
              
              <div className="flex justify-between items-center space-x-4">
                <div>
                  <label htmlFor="sort" className="sr-only">Sort by</label>
                  <select
                    id="sort"
                    className="block w-full pl-3  py-2 md:text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm rounded-md"
                    onChange={handleSortChange}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="limit" className="sr-only">Items per page</label>
                  <select
                    id="limit"
                    className="block w-full pl-3  py-2 md:text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm rounded-md"
                    onChange={(e) => changeLimit(parseInt(e.target.value))}
                  >
                    <option value="12">12 per page</option>
                    <option value="24">24 per page</option>
                    <option value="48">48 per page</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            {error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            ) : loading || searching ? (
              <div className="py-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white/45 rounded-md shadow-md overflow-hidden animate-pulse">
                      <div className="bg-gray-200 h-48"/>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"/>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"/>
                        <div className="flex justify-between">
                          <div className="h-6 bg-gray-200 rounded w-16"/>
                          <div className="h-8 bg-gray-200 rounded w-20"/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : products.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product,i) => (
                  <ProductCard key={i} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white/45 rounded-md shadow p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you&apos;re looking for.</p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      updateFilter('search', '');
                      updateFilter('category', '');
                      updateFilter('tags', '');
                      setPriceRange([0, 100]);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Pagination */}
            {products.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white/45 text-sm font-medium ${
                      pagination.hasPrev ? 'text-gray-500 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(pagination.totalPages - 4, pagination.page - 2)) + i;
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.page === page
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white/45 border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white/45 text-sm font-medium ${
                      pagination.hasNext ? 'text-gray-500 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>
      <CartSidebar/>
    </div>
  );
};

export default CustomerProductsPage;