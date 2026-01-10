"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import {
  Plus,
  Upload,
  X,
  Package,
  Tag,
  Image as ImageIcon,
  DollarSign,
  Box,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";
import CreatableSelect from "react-select/creatable";
import { Image } from "@heroui/react";
import { useTags } from "@/app/hooks/useTags";
import { slugify } from "@/utils/utils";
import { Types } from "mongoose";

interface TagsAttribute {
  name: string;
  slug: string;
}
interface ProductFormData {
  productName: string;
  regularPrice?: string;
  salePrice?: string;
  wholesalePrice?: string;
  sku?: string;
  quantity?: number;
  sortDescription?: string;
  tags?: TagsAttribute[];
  images?: string[];
  status?: "draft" | "published";
  category?: string;
  subCategory?: string;
}

interface Category {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  icon: string;
  subcategories: string[];
}

type UploadImage = {
  file: File | string;
  url?: string;
  progress?: number;
  uploading?: boolean;
};

const MobileAddProduct = ({ isShow }: { isShow?: boolean }) => {
  const router = useRouter();
  const {tags }= useTags()
     const [allTags, setAllTags] = useState<TagsAttribute[]>(tags);
  const [formData, setFormData] = useState<ProductFormData>({
    productName: "",
    regularPrice: "",
    salePrice: "",
    wholesalePrice: "",
    quantity: 0,
    sortDescription: "",
    tags: [],
    images: [],
    status: "draft",
    category: "",
    subCategory: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<UploadImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to load categories"
        );
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      const selectedCategory = categories.find(
        (cat) => cat.name === formData.category
      );
      if (selectedCategory) {
        setSubcategories(selectedCategory.subcategories);
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  }, [formData.category, categories]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      subCategory: "", // Reset subcategory when category changes
    }));
  };

  // Handle drag and drop events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    // Check if adding these files would exceed the limit
    if (imagePreviews.length + files.length > 10) {
      toast.error("You can upload a maximum of 10 images");
      return;
    }

    for (const file of files) {
      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }

      // Check file type
      if (!file.type.match("image/(jpeg|jpg|png|webp)")) {
        toast.error(`File ${file.name} is not a supported image format.`);
        continue;
      }

      const temp: UploadImage = {
        file,
        url: "", // Will be set after object URL creation
        uploading: true,
        progress: 0,
      };

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      temp.url = objectUrl;
      setImagePreviews((prev) => [...prev, temp]);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setImagePreviews((prev) =>
              prev.map((img) =>
                img.file === file ? { ...img, progress: percent } : img
              )
            );
          }
        };

        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              const res = JSON.parse(xhr.responseText);
              setImagePreviews((prev) =>
                prev.map((img) =>
                  img.file === file
                    ? { ...img, url: res.urls[0], uploading: false }
                    : img
                )
              );
            } else {
              // Show error and remove the failed image
              toast.error(`Failed to upload ${file.name}`);
              setImagePreviews((prev) =>
                prev.filter((img) => img.file !== file)
              );
              // Revoke the object URL to free memory
              URL.revokeObjectURL(objectUrl);
            }
          }
        };

        xhr.open("POST", "/api/upload");
        xhr.send(formData);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${file.name}`);
        setImagePreviews((prev) => prev.filter((img) => img.file !== file));
        URL.revokeObjectURL(objectUrl);
      }
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      const removedImage = newPreviews[index];
      // If it's a blob URL, revoke it to free memory
      if (
        typeof removedImage.file === "object" &&
        removedImage.file instanceof File
      ) {
        URL.revokeObjectURL(removedImage.url as string);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const images = imagePreviews
        .map((img) => img.url)
        .filter(Boolean) as string[];

      const payload = {
        ...formData,
        images: images,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  // Custom styles for CreatableSelect
  const selectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "#fff",
      borderColor: "#d1d5db",
      minHeight: "42px",
      borderRadius: "0.5rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    input: (provided: any) => ({
      ...provided,
      color: "#1f2937",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#fff",
      borderRadius: "0.5rem",
      marginTop: "0.25rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#eff6ff"
        : state.isFocused
          ? "#f3f4f6"
          : "#fff",
      color: state.isSelected ? "#1d4ed8" : "#1f2937",
      padding: "0.5rem 1rem",
      cursor: "pointer",
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#eff6ff",
      borderRadius: "0.25rem",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#1d4ed8",
      padding: "0.25rem 0.5rem",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#1d4ed8",
      borderRadius: "0 0.25rem 0.25rem 0",
      paddingLeft: "0.25rem",
      paddingRight: "0.25rem",
      "&:hover": {
        backgroundColor: "#dbeafe",
        color: "#1e40af",
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#6b7280",
      },
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#6b7280",
      },
    }),
  };

  return (
    <div
      className={` bg-gradient-to-br from-blue-50 to-indigo-100 ${!isShow ? "md:hidden" : "block"} p-2 md:p-4`}
    >
      <Head>
        <title>Quick Add Product</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-md shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Package className="h-6 w-6 mr-2" />
              Quick Add Product
            </h1>
            <p className="text-blue-100 mt-1">
              Add a new product with essential details
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Package className="h-4 w-4 mr-1 text-blue-600" />
                  Product Name <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter product name"
                />
              </div>

              {/* Category and Subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  {categoriesLoading ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100">
                      Loading categories...
                    </div>
                  ) : (
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category,i) => (
                        <option key={i} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Sub Category
                  </label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    disabled={!formData.category || subcategories.length === 0}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      !formData.category || subcategories.length === 0
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    <option value="">
                      {formData.category
                        ? "Select a subcategory"
                        : "Select category first"}
                    </option>
                    {subcategories.map((subcategory, index) => (
                      <option key={index} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
                    WholeSale Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      name="wholesalePrice"
                      value={formData.wholesalePrice}
                      onChange={handleChange}
                      className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
                    Regular Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      name="regularPrice"
                      value={formData.regularPrice}
                      onChange={handleChange}
                      className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
                    Sale Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleChange}
                      className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Box className="h-4 w-4 mr-1 text-blue-600" />
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="0"
                />
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  name="sortDescription"
                  value={formData.sortDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter a brief description of the product..."
                />
              </div>

              {/* Tags */}
              <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Tag className="h-4 w-4 mr-1 text-blue-600" />
                  Tags
                </label>
                <CreatableSelect
    isMulti
    isDisabled={loading}
    placeholder="Add or select tags"
    value={
      formData.tags?.map((tag) => ({ label: tag.name, value: tag.slug })) || []
    }
    onChange={async (newValue) => {
      const mapped = await Promise.all(
        newValue.map(async (option) => {
          const slug = option.value || slugify(option.label);

          // check if tag already exists
          const exists = tags.some((t) => t.slug === slug);

          if (!exists) {
            // ✅ Create the tag in DB
            const res = await fetch("/api/tags", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: option.label, slug }),
            });

            if (res.ok) {
              const createdTag = await res.json();
              // ✅ Add newly created tag to local tags state
              setAllTags((prev) => [...prev, createdTag]);
            }
          }

          return { name: option.label, slug };
        })
      );

      // ✅ Update formData state
      setFormData((prev) => ({
        ...prev,
        tags: mapped,
      }));
    }}
    options={tags.map((tag) => ({
      value: tag.slug,
      label: tag.name,
    }))}
    className="react-select-container"
    classNamePrefix="react-select"
  />
              </div>

              {/* Image Upload */}
              <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <ImageIcon className="h-4 w-4 mr-1 text-blue-600" />
                  Product Images
                </label>

                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4"
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {imagePreviews.map((img, idx) => {
                    const src =
                      typeof img.file === "object" && img.file instanceof File
                        ? URL.createObjectURL(img.file)
                        : img.url;
                    return (
                      <div key={idx} className="relative group">
                        <div className="aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50 transition-all duration-200 hover:shadow-md">
                          <Image
                            src={src}
                            alt={`Product image ${idx + 1}`}
                            className="w-full h-full object-contain p-2"
                          />
                          {/* Upload progress overlay */}
                          {img.uploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                <div
                                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                  style={{ width: `${img.progress}%` }}
                                />
                              </div>
                              <span className="text-white text-sm font-medium">
                                {img.progress}%
                              </span>
                            </div>
                          )}
                          {/* Hover overlay with remove button */}
                          {!img.uploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 group-hover:bg-opacity-50 group-hover:opacity-100 transition-all duration-200">
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform scale-90 group-hover:scale-100"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                          {/* Image index badge */}
                          <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                            {idx + 1}
                          </div>
                          {/* Upload status indicator */}
                          {img.uploading && (
                            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs rounded-full px-2 py-1 flex items-center">
                              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                              Uploading
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Upload button */}
                  <label
                    className={`aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group ${isDragging ? "border-blue-500 bg-blue-50" : ""}`}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                    </div>
                    <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                      Upload Image
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      or drag & drop
                    </span>
                  </label>
                </div>

                {/* Tips and requirements */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">
                    Image Requirements
                  </h3>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Recommended dimensions: 800x800px or higher</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Supported formats: JPG, PNG, WEBP</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Maximum file size: 5MB per image</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Upload up to 10 images</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/admin/products")}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200 flex items-center"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAddProduct;
