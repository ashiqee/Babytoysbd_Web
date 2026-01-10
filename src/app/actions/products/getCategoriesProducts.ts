"use server"
// lib/actions/categories/getCategoriesProducts.ts
import { TProduct } from "@/app/hooks/useProducts";

interface GetCategoriesProductsResponse {
  products: TProduct[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

export async function getCategoriesProducts(slug: string): Promise<GetCategoriesProductsResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/admin?category=${slug}`,
      {
        cache: "no-store", // ensures fresh data on every request
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch products for category: ${slug}`);
    }

    const data: GetCategoriesProductsResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching category products:", error);
    return {
      products: [],
      pagination: { total: 0, page: 1, limit: 0 },
    };
  }
}
