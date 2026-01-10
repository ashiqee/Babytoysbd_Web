"use client";


import { Types } from "mongoose";
import { useEffect, useState } from "react";

export type Tag = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  metaTitle:string;
  description: string;
  metaDescription:string;

};

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/tags");
        if (!res.ok) throw new Error("Failed to fetch tags");
        const data: Tag[] = await res.json();
        setTags(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load tags");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { tags, loading, error };
}
