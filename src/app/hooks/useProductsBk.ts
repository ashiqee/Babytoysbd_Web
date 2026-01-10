"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { IProduct } from "@/lib/models/products/Product";
import { Types } from "mongoose";

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
  error?: string;
}

interface FilterOptions {
  search: string;
  status: string;
  category: string;
  tags: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface UseProductsOptions {
  initialLimit?: number;
  debounceMs?: number;
}

export const useProductsBk = (options: UseProductsOptions = {}) => {
  const { initialLimit = 12, debounceMs = 300 } = options;

  // Products data
  const [products, setProducts] = useState<TProduct[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: initialLimit,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: "",
    category: "",
    tags: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Debounced search term
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: debouncedSearch,
        status: filters.status,
        category: filters.category,
        tags: filters.tags,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const res = await fetch(`/api/products/admin?${params.toString()}`, {
         next: { tags: ['products'] },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const result: ProductResponse = await res.json();
      if (result.error) throw new Error(result.error);

      setProducts(result.products);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, filters]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      if (filters.search.trim() !== "") {
        setSearching(true);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [filters.search, debounceMs]);

  // Refetch when filters/pagination change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update filter
  const updateFilter = useCallback(
    (key: keyof FilterOptions, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPagination((prev) => ({ ...prev, page: 1 })); // reset page
    },
    []
  );

  // Change page
  const goToPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  // Change limit
  const changeLimit = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  // Refresh products
  const refresh = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Delete product
  const deleteProduct = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this product?")) return;

      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete product");

        refresh();
        return true;
      } catch (err) {
        console.error("Error deleting product:", err);
        setError(err instanceof Error ? err.message : "Failed to delete product");
        return false;
      }
    },
    [refresh]
  );

  const updateProduct = useCallback(async (id: Types.ObjectId, updatedProduct: Partial<IProduct>) => {
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

  // Stats
  const publishedCount = useMemo(
    () => products.filter((p) => p.status === "published").length,
    [products]
  );
  const draftCount = useMemo(
    () => products.filter((p) => p.status === "draft").length,
    [products]
  );
  const lowStockCount = useMemo(
    () => products.filter((p) => (p.quantity || 0) < 10).length,
    [products]
  );

  return {
    products,
    pagination,
    loading,
    searching,
    error,
    publishedCount,
    draftCount,
    lowStockCount,
    filters,
    updateFilter,
    goToPage,
    changeLimit,
    refresh,
    deleteProduct,
    updateProduct
  };
};
