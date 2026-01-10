import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  icon: z.string().optional(), // Ensure it's a URL string or name
  subcategories: z.array(z.string().min(1, "Subcategory name is required")).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
