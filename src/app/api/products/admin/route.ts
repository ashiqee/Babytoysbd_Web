import { dbConnect } from "@/lib/db/dbConnect";
import { Product } from "@/lib/models/products/Product";
import { NextRequest, NextResponse } from "next/server";

// Define interface for query parameters
interface ProductQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  category?: string;
  tags?: string; // comma-separated list like "Educational,Car"
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

function decodeCategorySlug(slug: string): string {
  return slug
    .replace(/-/g, " ") // turn dashes back to spaces
    .replace(/\band\b/g, "&"); // turn 'and' back to '&'
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

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const query: ProductQuery = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "12",
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "",
      category: searchParams.get("category") || "",
      tags: searchParams.get("tags") || "", // will handle below
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    };


   
    
    // Convert to numbers
    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "12");
    const skip = (page - 1) * limit;

    // Build filter object
const filter: any = {};

// ✅ Text search across multiple fields (including tags)
if (query.search) {
  filter.$or = [
    { productName: { $regex: query.search, $options: "i" } },
    { productId: { $regex: query.search, $options: "i" } },
    { description: { $regex: query.search, $options: "i" } },
    { "tags.name": { $regex: query.search, $options: "i" } },
    { "tags.slug": { $regex: query.search, $options: "i" } }
  ];
}

// ✅ Status filter
if (query.status) {
  filter.status = query.status;
}

// ✅ Category filter
if (query.category) {
  const decodedCategory = decodeCategorySlug(query.category);
  filter.category = { $regex: `^${decodedCategory}$`, $options: "i" };
}

// Tag filter with comma-separated tags
if (query.tags) {
  const tagsArray = query.tags.split(",").map((t) => t.trim());
  // filter["tags.slug"] = { $in: tagsArray };
  filter["tags.name"] = { $in: tagsArray };
}


// ✅ Sorting
let sortBy: ValidSortField = "createdAt";
if (query.sortBy && VALID_SORT_FIELDS.includes(query.sortBy as ValidSortField)) {
  sortBy = query.sortBy as ValidSortField;
}
const sort: any = {};
sort[sortBy] = query.sortOrder || "desc";

// ✅ Fetch products
const products = await Product.find(filter)
  .select("-wholesalePrice")
  .sort(sort)
  .skip(skip)
  .limit(limit)
  .lean()
  .exec();

  
      

    // ✅ Get total count for pagination
    const total = await Product.countDocuments(filter);

    // ✅ Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
