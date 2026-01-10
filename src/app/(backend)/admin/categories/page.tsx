"use client";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { toast } from "react-hot-toast";
import { Image } from "@heroui/react";
import CreatableSelect from "react-select/creatable";
import EmojiPicker from "@/components/ui/EmojiPicker";


const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  emoji: z.string().optional(),
  description: z.string().optional(),
  icon: z.any().optional(),
  subcategories: z
    .array(z.string().min(1, "Subcategory name is required"))
    .optional(),
  _id: z.string().optional(),
});

const slugCheck = async (slug: string) => {
  const res = await fetch("/api/categories/check-slug", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug }),
  });
  const { exists } = await res.json();
  return exists;
};

export type CategoryFormType = z.infer<typeof categorySchema>;
export default function AddCategoryPage() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
    reset,
  } = useForm<CategoryFormType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      subcategories: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subcategories",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedIconUrl, setUploadedIconUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<CategoryFormType[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [slugExists, setSlugExists] = useState(false);
  const itemsPerPage = 5;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    const toastId = toast.loading("Uploading image...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      toast.dismiss(toastId);
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUploadedIconUrl(data.urls[0]);
      toast.success("Image uploaded!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Image upload error", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const slug = slugify(value, { lower: true });
    setValue("name", value);
    setValue("slug", slug);
    if (value.length > 2) {
      const exists = await slugCheck(slug);
      setSlugExists(exists);
      if (exists) {
        toast.error("Slug already exists. Choose a different name.");
      }
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    }
    fetchCategories();
  }, []);

  const onSubmit = async (data: CategoryFormType) => {
    if (slugExists) {
      toast.error("Slug is already in use. Please change the name.");
      return;
    }
    const toastId = toast.loading(
      editIndex !== null ? "Updating..." : "Saving..."
    );
    setFormError(null);
    try {
      const payload = { ...data, icon: uploadedIconUrl };
      const res = await fetch(
        editIndex !== null
          ? `/api/categories/${categories[editIndex]._id}`
          : "/api/categories",
        {
          method: editIndex !== null ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save");
      toast.success(
        editIndex !== null ? "Category updated!" : "Category created!",
        { id: toastId }
      );
      if (editIndex !== null) {
        const updated = [...categories];
        updated[editIndex] = result;
        setCategories(updated);
      } else {
        setCategories((prev) => [...prev, result]);
      }
      setEditIndex(null);
      setImagePreview(null);
      setUploadedIconUrl(null);
      setSlugExists(false);
      reset({ name: "", slug: "", description: "", subcategories: [] });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Custom styles for CreatableSelect
  const selectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "#1f2937",
      borderColor: "#374151",
      color: "white",
      minHeight: "42px",
      borderRadius: "0.5rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#4b5563",
      },
    }),
    input: (provided: any) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#1f2937",
      borderRadius: "0.5rem",
      marginTop: "0.25rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#374151"
        : state.isFocused
          ? "#374151"
          : "#1f2937",
      color: "white",
      padding: "0.5rem 1rem",
      cursor: "pointer",
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#374151",
      borderRadius: "0.25rem",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "white",
      padding: "0.25rem 0.5rem",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "white",
      borderRadius: "0 0.25rem 0.25rem 0",
      paddingLeft: "0.25rem",
      paddingRight: "0.25rem",
      "&:hover": {
        backgroundColor: "#4b5563",
        color: "white",
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
        color: "white",
      },
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "white",
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Category Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create and manage product categories
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Section */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                <h2 className="text-xl font-bold text-white">
                  {editIndex !== null ? "Edit Category" : "Create New Category"}
                </h2>
                <p className="text-blue-100 mt-1">
                  {editIndex !== null
                    ? "Update category details"
                    : "Fill in the details below"}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("name" as const)}
                    onChange={handleNameChange}
                    placeholder="Enter category name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("slug" as const)}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed"
                    placeholder="Auto-generated slug"
                  />
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.slug.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register("description" as const)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter category description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category Icon
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          className="w-full h-full object-cover rounded-lg"
                          alt="Preview"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-xs text-gray-500 mt-1">
                            Upload
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p>JPG, PNG or GIF</p>
                      <p>Max 1MB</p>
                    </div>
                  </div>
                </div>
                <EmojiPicker
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subcategories
                  </label>
                  <Controller
                    name="subcategories"
                    control={control}
                    render={({ field }) => (
                      <CreatableSelect
                        isMulti
                        value={
                          field.value
                            ? field.value.map((item: string) => ({
                                label: item,
                                value: item,
                              }))
                            : []
                        }
                        onChange={(newValue) =>
                          field.onChange(newValue.map((option) => option.value))
                        }
                        placeholder="Add or create subcategories..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={selectStyles}
                      />
                    )}
                  />
                </div>

                {formError && (
                  <p className="text-red-500 text-sm">{formError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={slugExists}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-all ${
                      slugExists
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {editIndex !== null ? "Update Category" : "Create Category"}
                  </button>
                  {editIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditIndex(null);
                        setImagePreview(null);
                        setUploadedIconUrl(null);
                        reset({
                          name: "",
                          slug: "",
                          description: "",
                          subcategories: [],
                        });
                      }}
                      className="py-3 px-4 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Category List
                    </h2>
                    <p className="text-indigo-100 mt-1">
                      Manage existing categories
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg bg-indigo-500 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white"
                      />
                      <svg
                        className="w-5 h-5 absolute left-3 top-2.5 text-indigo-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {paginatedCategories.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                      No categories found
                    </h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                      Try adjusting your search or create a new category.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <th className="p-3">Icon</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Slug</th>
                            <th className="p-3">Subcategories</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {paginatedCategories.map((cat, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                            >
                              <td className="p-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                  {cat.icon ? (
                                    <Image
                                      alt={cat.name}
                                      src={cat.icon}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <svg
                                      className="w-6 h-6 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 font-medium text-gray-900 dark:text-white">
                                {cat.emoji}
                                {cat.name}
                              </td>
                              <td className="p-3 text-gray-500 dark:text-gray-400">
                                {cat.slug}
                              </td>
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1">
                                  {cat.subcategories
                                    ?.slice(0, 3)
                                    .map((sub, i) => (
                                      <span
                                        key={i}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                      >
                                        {sub}
                                      </span>
                                    ))}
                                  {cat.subcategories &&
                                    cat.subcategories.length > 3 && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                        +{cat.subcategories.length - 3}
                                      </span>
                                    )}
                                </div>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => {
                                      setValue("name", cat.name);
                                      setValue("slug", cat.slug);
                                      setValue(
                                        "description",
                                        cat.description || ""
                                      );
                                      setValue(
                                        "subcategories",
                                        cat.subcategories || []
                                      );
                                      setValue("emoji", cat.emoji || "");
                                      setImagePreview(cat.icon || null);
                                      setUploadedIconUrl(cat.icon || null);
                                      setEditIndex(
                                        categories.findIndex(
                                          (c) => c._id === cat._id
                                        )
                                      );
                                    }}
                                    className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
                                    title="Edit"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const confirmed = window.confirm(
                                        "Are you sure you want to delete this category?"
                                      );
                                      if (!confirmed) return;
                                      const toastId =
                                        toast.loading("Deleting...");
                                      try {
                                        const res = await fetch(
                                          `/api/categories/${cat._id}`,
                                          {
                                            method: "DELETE",
                                          }
                                        );
                                        if (!res.ok)
                                          throw new Error("Delete failed");
                                        setCategories(
                                          categories.filter(
                                            (c) => c._id !== cat._id
                                          )
                                        );
                                        toast.success("Category deleted", {
                                          id: toastId,
                                        });
                                      } catch (error) {
                                        toast.error("Delete failed", {
                                          id: toastId,
                                        });
                                      }
                                    }}
                                    className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition-colors"
                                    title="Delete"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {totalPages > 1 && (
                      <div className="md:flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          Showing{" "}
                          <span className="font-medium">
                            {(currentPage - 1) * itemsPerPage + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {Math.min(
                              currentPage * itemsPerPage,
                              filteredCategories.length
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {filteredCategories.length}
                          </span>{" "}
                          results
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            }`}
                          >
                            Previous
                          </button>
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((num) => (
                            <button
                              key={num}
                              onClick={() => setCurrentPage(num)}
                              className={`w-8 h-8 rounded-full ${
                                currentPage === num
                                  ? "bg-indigo-600 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
