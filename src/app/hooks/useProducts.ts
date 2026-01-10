import { IProduct } from '@/lib/models/products/Product';
import { Types } from 'mongoose';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';


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
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { initialLimit = 12, debounceMs = 300 } = options;

  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  const [pagination, setPagination] = useState({
    total: 0, page: 1, limit: initialLimit, totalPages: 0, hasNext: false, hasPrev: false,
  });

  const [filters, setFilters] = useState<FilterOptions>({
    search: '', status: '', category: '', tags: '', sortBy: 'createdAt', sortOrder: 'desc',
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const fetchIdRef = useRef(0); // for debugging/cancel semantics

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setSearching(filters.search.trim() !== '');
    }, debounceMs);
    return () => clearTimeout(t);
  }, [filters.search, debounceMs]);

  // Build params helper: only include non-empty values
  const buildSearchParams = (opts: {
    page: number;
    limit: number;
    search: string;
    filters: FilterOptions;
  }) => {
    const params = new URLSearchParams();
    params.set('page', String(opts.page));
    params.set('limit', String(opts.limit));

    if (opts.search && opts.search.trim() !== '') params.set('search', opts.search.trim());
    if (opts.filters.status) params.set('status', opts.filters.status);
    if (opts.filters.category) params.set('category', opts.filters.category);
    if (opts.filters.tags) params.set('tags', opts.filters.tags);
    if (opts.filters.sortBy) params.set('sortBy', opts.filters.sortBy);
    if (opts.filters.sortOrder) params.set('sortOrder', opts.filters.sortOrder);

    return params.toString();
  };

  // Fetch products: inside useEffect so it always reads latest state
  useEffect(() => {
    const controller = new AbortController();
    const currentFetchId = ++fetchIdRef.current;
    setLoading(true);
    setError(null);

    const doFetch = async () => {
      try {
        const qs = buildSearchParams({
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearch,
          filters,
        });

        // debug log
        // console.log(`[fetchProducts #${currentFetchId}] qs:`, qs);

        const res = await fetch(`/api/products/admin?${qs}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);

        const data: ProductResponse = await res.json();

        // Only set state if this fetch is the latest (simple race guard)
        if (fetchIdRef.current === currentFetchId) {
          setProducts(data.products);
          setPagination(data.pagination);
        }
      } catch (err) {
        if ((err as any).name === 'AbortError') {
          // aborted — ignore
          // console.log('[fetchProducts] aborted');
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (fetchIdRef.current === currentFetchId) {
          setLoading(false);
          setSearching(false);
        }
      }
    };

    doFetch();

    return () => {
      controller.abort();
    };
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    filters.status,
    filters.category,
    filters.tags,
    filters.sortBy,
    filters.sortOrder,
  ]);

  // Batch update filters (preferred) — avoids multiple renders/fetches
  const setFiltersBatch = useCallback((next: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...next }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const updateFilter = useCallback((key: keyof FilterOptions, value: string) => {
    // simple single-field updater kept for convenience
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const changeLimit = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  const refresh = useCallback(() => {
    // bump a no-op property to retrigger effect OR simply call fetch by toggling page temporarily
    setPagination(prev => ({ ...prev }));
  }, []);

  // updateProduct and deleteProduct same as before (call refresh() after success)...

  const publishedCount = useMemo(() => products.filter(p => p.status === 'published').length, [products]);
  const draftCount = useMemo(() => products.filter(p => p.status === 'draft').length, [products]);
  const lowStockCount = useMemo(() => products.filter(p => (p.quantity || 0) < 10).length, [products]);


// inside useProducts hook
const updateProduct = useCallback(async (id: string, updatedProduct: Partial<IProduct>) => {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to update product");
    }

    // ✅ After successful update, refresh product list
    refresh();
    return true;
  } catch (err) {
    console.error("Error updating product:", err);
    setError(err instanceof Error ? err.message : "Failed to update product");
    return false;
  }
}, [refresh]);



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
  

  
  return {
    // Data
    products,
    pagination,
    
    // Loading states
    loading,
    searching, // New searching state
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
    updateProduct
  };
};