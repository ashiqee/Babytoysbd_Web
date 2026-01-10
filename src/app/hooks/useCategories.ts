"use client";

import { Types } from "mongoose";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useEffect, useState } from "react";

export type Category = {
  image: string | StaticImport;
   _id: Types.ObjectId;
  name: string;
  slug: string;
  metaTitle:string;
  description: string;
  metaDescription:string;
  icon: string;
  subcategories: string[];
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load categories");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { categories, loading, error };
}
