// app/hooks/useProducts.ts
import { IProduct } from '@/lib/models/products/Product';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Types } from 'mongoose';

// Types
export interface TProduct extends IProduct {
  _id: Types.ObjectId;
}

interface ProductResponse {
  products: TProduct[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface FilterOptions {
  search: string;
  status: string;
  category: string;
  tags: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface UseProductsOptions {
  initialLimit?: number;
  debounceMs?: number;
  disableCategorySync?: boolean; // New option to disable category sync
}

export const useCategoriesProducts = (options: UseProductsOptions = {}) => {
  const { initialLimit = 12, debounceMs = 300, disableCategorySync = false } = options;
  
  // Router hooks for URL management
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for products data
  const [products, setProducts] = useState<TProduct[]>([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: initialLimit,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  
  // Filter state - initialize from URL parameters
  const [filters, setFilters] = useState<FilterOptions>({
    search: searchParams.get('q') || '',
    status: '',
    category: searchParams.get('category') || '',
    tags: searchParams.get('tags') || '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  // Ref to track if we're updating URL programmatically
  const isUpdatingUrl = useRef(false);
  
  // Ref to track the latest fetch request
  const fetchControllerRef = useRef<AbortController | null>(null);
  
  // Ref to store the latest state
  const stateRef = useRef({
    pagination,
    filters,
    debouncedSearch: filters.search,
  });
  
  // Update the ref whenever state changes
  useEffect(() => {
    stateRef.current = {
      pagination,
      filters,
      debouncedSearch: filters.search,
    };
  }, [pagination, filters]);
  
  // Function to update URL parameters
  const updateUrlParams = useCallback((newFilters: Partial<FilterOptions>) => {
    isUpdatingUrl.current = true;
    
    const params = new URLSearchParams(searchParams.toString());
    
    // Update search parameter
    if (newFilters.search !== undefined) {
      if (newFilters.search) {
        params.set('q', newFilters.search);
      } else {
        params.delete('q');
      }
    }
    
    // Update category parameter (only if not disabled)
    if (!disableCategorySync && newFilters.category !== undefined) {
      if (newFilters.category) {
        params.set('category', newFilters.category);
      } else {
        params.delete('category');
      }
    }
    
    // Update tags parameter
    if (newFilters.tags !== undefined) {
      if (newFilters.tags) {
        params.set('tags', newFilters.tags);
      } else {
        params.delete('tags');
      }
    }
    
    // Update the URL without triggering a navigation
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    
    // Reset the flag after a short delay
    setTimeout(() => {
      isUpdatingUrl.current = false;
    }, 100);
  }, [searchParams, disableCategorySync]);
  
  // Sync filters with URL parameters (modified to respect disableCategorySync)
  useEffect(() => {
    if (isUpdatingUrl.current) return;
    
    const search = searchParams.get('q') || '';
    const category = disableCategorySync ? filters.category : (searchParams.get('category') || '');
    const tags = searchParams.get('tags') || '';
    
    setFilters(prev => ({
      ...prev,
      search,
      category,
      tags
    }));
  }, [searchParams, disableCategorySync, filters.category]);
  
  // Function to fetch products
  const fetchProducts = useCallback(async () => {
    // Cancel any ongoing fetch request
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }
    
    // Create a new AbortController for this request
    const controller = new AbortController();
    fetchControllerRef.current = controller;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get the latest state from the ref
      const { pagination, filters } = stateRef.current;
      
      // Build query string
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: filters.search,
        status: filters.status,
        category: filters.category,
        tags: filters.tags,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      
      const response = await fetch(`/api/products?${params}`, {
        signal: controller.signal,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data: ProductResponse = await response.json();
      
      // Ensure products is always an array
      setProducts(data.products || []);
      
      // Ensure pagination has default values
      setPagination(data.pagination || {
        total: 0,
        page: 1,
        limit: initialLimit,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });
    } catch (err) {
      // Ignore errors caused by aborting
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Set empty products array on error
      setProducts([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [initialLimit]);
  
  // Effect to trigger fetch when needed
  useEffect(() => {
    fetchProducts();
    
    // Cleanup function to abort fetch when component unmounts
    return () => {
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      if (filters.search.trim() !== '') {
        setSearching(true);
      }
      fetchProducts();
    }, debounceMs);
    
    return () => {
      clearTimeout(timer);
    };
  }, [filters.search, debounceMs, fetchProducts]);
  
  // Function to update filters
  const updateFilter = useCallback((key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL parameters for search, category, and tags
    if (key === 'search' || key === 'tags' || (!disableCategorySync && key === 'category')) {
      updateUrlParams({ [key]: value });
    }
    
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [filters, updateUrlParams, disableCategorySync]);
  
  // Function to change page
  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);
  
  // Function to change limit
  const changeLimit = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);
  
  // Function to refresh products
  const refresh = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  // Function to delete a product
  const deleteProduct = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      // Refresh products list
      refresh();
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      return false;
    }
  }, [refresh]);
  
  // Memoized computed values
  const publishedCount = useMemo(() => 
    (products || []).filter(p => p?.status === 'published').length, 
    [products]
  );
  
  const draftCount = useMemo(() => 
    (products || []).filter(p => p?.status === 'draft').length, 
    [products]
  );
  
  const lowStockCount = useMemo(() => 
    (products || []).filter(p => (p?.quantity || 0) < 10).length, 
    [products]
  );
  
  return {
    // Data
    products: products || [], // Ensure products is always an array
    pagination,
    
    // Loading states
    loading,
    searching,
    error,
    
    // Stats
    publishedCount,
    draftCount,
    lowStockCount,
    filters,
    
    // Actions
    updateFilter,
    goToPage,
    changeLimit,
    refresh,
    deleteProduct,
  };
};

function setDebouncedSearch(search: string) {
    throw new Error('Function not implemented.');
}
