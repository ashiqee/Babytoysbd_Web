import { getProducts } from "@/app/actions/products/getProducts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = {
    page: Number(searchParams.get("page") || 1),
    limit: Number(searchParams.get("limit") || 12),
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    category: searchParams.get("category") || "",
    tags: searchParams.get("tags")?.split(",").map(t => t.trim()) || [],
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  };
  const result = await getProducts(query);
  return NextResponse.json(result);
}
