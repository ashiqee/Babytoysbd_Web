"use server";

import { dbConnect } from "@/lib/db/dbConnect";
import { Product } from "@/lib/models/products/Product";

// Define interface for query parameters
interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  tags?: string | string[]; // array now, not comma string
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Define valid sort fields
const VALID_SORT_FIELDS = [
  "createdAt",
  "productName",
  "regularPrice",
  "salePrice",
  "quantity",
  "status",
  "category",
  "tags",
] as const;

type ValidSortField = typeof VALID_SORT_FIELDS[number];

export const getProducts = async (query: ProductQuery = {}) => {
  try {
    await dbConnect();

    // Defaults
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

    if (query.search) {
      filter.$or = [
        { productName: { $regex: query.search, $options: "i" } },
        { productId: { $regex: query.search, $options: "i" } },
        { description: { $regex: query.search, $options: "i" } },
        { tags: { $regex: query.search, $options: "i" } },
      ];
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.tags && query.tags.length > 0) {
      filter.tags = { $in: query.tags };
    }

    // Validate and set sort
    let sortBy: ValidSortField = "createdAt";
    if (query.sortBy && VALID_SORT_FIELDS.includes(query.sortBy as ValidSortField)) {
      sortBy = query.sortBy as ValidSortField;
    }

    const sort: any = {};
    sort[sortBy] = query.sortOrder || "desc";

    // Fetch
    const products = await Product.find(filter)
      .select("-wholesalePrice")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    
    

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      error: "Failed to fetch products",
    };
  }
};
