"use client";
import { IProduct } from "@/lib/models/products/Product";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import slugify from "slugify";
import toast from "react-hot-toast";

type SeoData = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
};

export default function ProductSeoForm({ 
  defaultValues, 
  existingSlugs = [],
  onSubmitHandler 
}: { 
  defaultValues: IProduct;
  existingSlugs?: string[];
  onSubmitHandler: (data: IProduct) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [slugError, setSlugError] = useState("");
  const [canonicalUrlError, setCanonicalUrlError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SeoData>({
    defaultValues: {
      slug: defaultValues.slug || "",
      metaTitle: defaultValues.metaTitle || "",
      metaDescription: defaultValues.metaDescription || "",
      keywords: (defaultValues.keywords || []).join(", "),
      canonicalUrl: defaultValues.canonicalUrl || `https://babytoysbd.com/${defaultValues.slug}`,
    },
  });

  const watchSlug = watch("slug");
  const watchCanonicalUrl = watch("canonicalUrl");

  // Update canonical URL when slug changes
  useEffect(() => {
    if (watchSlug) {
      setValue("canonicalUrl", `https://babytoysbd.com/${watchSlug}`);
    }
  }, [watchSlug, setValue]);

  // Validate slug
  useEffect(() => {
    if (watchSlug) {
      // Skip check if we're editing and the slug hasn't changed
      if (defaultValues.slug && watchSlug === defaultValues.slug) {
        setSlugError("");
        return;
      }
      
      // Check if slug already exists
      if (existingSlugs.includes(watchSlug)) {
        setSlugError("This slug is already in use. Please choose another.");
      } else {
        setSlugError("");
      }
    }
  }, [watchSlug, existingSlugs, defaultValues.slug]);

  // Validate canonical URL contains slug
  useEffect(() => {
    if (watchSlug && watchCanonicalUrl) {
      if (!watchCanonicalUrl.includes(watchSlug)) {
        setCanonicalUrlError("The canonical URL should include the product slug.");
      } else {
        setCanonicalUrlError("");
      }
    }
  }, [watchSlug, watchCanonicalUrl]);

  const onSubmit = async (data: SeoData) => {
    if (slugError || canonicalUrlError) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert keywords from string to array
      const formattedData = {
        ...data,
        keywords: data.keywords.split(',').map(k => k.trim()).filter(k => k)
      };
      
      
      await onSubmitHandler(formattedData as any);
      toast.success("SEO settings saved successfully");
      setEditing(false);
    } catch (error) {
      console.error("Error saving SEO settings:", error);
      toast.error("Failed to save SEO settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset({
      slug: defaultValues.slug || "",
      metaTitle: defaultValues.metaTitle || "",
      metaDescription: defaultValues.metaDescription || "",
      keywords: (defaultValues.keywords || []).join(", "),
      canonicalUrl: defaultValues.canonicalUrl || `https://babytoysbd.com/${defaultValues.slug}`,
    });
    setSlugError("");
    setCanonicalUrlError("");
    setEditing(false);
  };

  const fallbackUrl = `https://babytoysbd.com/${defaultValues.slug}`;

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 p-4 border border-gray-300 dark:border-gray-700 rounded-md">
      <h2 className="text-lg font-semibold">SEO Metadata</h2>
      
      {!editing ? (
        <>
          {/* SEO Preview Styled Like Google */}
          <div className="space-y-1 bg-white dark:bg-[#1a1a1a] p-4 rounded border border-gray-300 dark:border-gray-700 shadow">
            <h3 className="text-blue-700 dark:text-blue-400 text-xl leading-tight">
              {defaultValues.metaTitle || `${defaultValues.productName} | BabyToysBD`}
            </h3>
            <p className="text-green-700 dark:text-green-400 text-sm">
              {defaultValues.canonicalUrl || fallbackUrl}
            </p>
            <p className="text-gray-800 dark:text-gray-300 text-sm">
              {defaultValues.metaDescription ||
                `Buy ${defaultValues.productName} now at the best price in Bangladesh. Fast delivery and top service.`}
            </p>
          </div>
          
          {/* Show Edit Button */}
          <button
            onClick={() => setEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit SEO
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="slug" className="block font-medium mb-1">Slug *</label>
            <input
              {...register("slug", { required: "Slug is required" })}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
              placeholder="product-url-slug"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
            {slugError && (
              <p className="mt-1 text-sm text-red-600">{slugError}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="metaTitle" className="block font-medium mb-1">Meta Title</label>
            <input
              {...register("metaTitle")}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
              placeholder="Product title for search engines"
            />
          </div>
          
          <div>
            <label htmlFor="metaDescription" className="block font-medium mb-1">Meta Description</label>
            <textarea
              {...register("metaDescription")}
              rows={3}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
              placeholder="A short description shown on Google"
            />
          </div>
          
          <div>
            <label htmlFor="keywords" className="block font-medium mb-1">Keywords (comma-separated)</label>
            <input
              {...register("keywords")}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
              placeholder="toys, baby, gift"
            />
          </div>
          
          <div>
            <label htmlFor="canonicalUrl" className="block font-medium mb-1">Canonical URL</label>
            <input
              {...register("canonicalUrl")}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
              placeholder="https://babytoysbd.com/your-product"
            />
            {errors.canonicalUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.canonicalUrl.message}</p>
            )}
            {canonicalUrlError && (
              <p className="mt-1 text-sm text-red-600">{canonicalUrlError}</p>
            )}
          </div>
          
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save SEO"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-red-500 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}