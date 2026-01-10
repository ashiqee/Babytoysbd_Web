// app/(backend)/admin/products/page.tsx

import { getProducts } from "@/app/actions/products/getProducts";
import ProductTable from "../../_components/tables/ProductTable";


interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    category?: string;
    tags?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>;
}

export default async function AllProductsPage({ searchParams }: ProductsPageProps) {
  // ✅ Await searchParams (new in Next.js 15)
  const params = await searchParams;

  console.log(params,"P");
  

  const query = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 12,
    search: params.search || "",
    status: params.status || "",
    category: params.category || "",
    tags: params.tags || "",
    sortBy: params.sortBy || "createdAt",
    sortOrder: params.sortOrder || "desc",
  };

  const products = await getProducts(query);

  return (
    <div>
      {/* <ProductTable productsData={products} initialParams={query} /> */}
      <ProductTable  />
    </div>
  );
}
