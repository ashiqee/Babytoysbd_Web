"use client";

import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import toast from "react-hot-toast";
import { CategoryFormType } from "../../admin/categories/page";

const colorOptions = [
  { value: "Red", label: "Red" },
  { value: "Green", label: "Green" },
  { value: "Blue", label: "Blue" },
];

const sizeOptions = [
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large" },
];

const productSchema = z.object({
  productName: z.string().min(1, "Required"),
  brandName: z.string().optional(),
  category: z.string(),
  subCategory: z.string().optional(),
  regularPrice: z.string().optional(),
  salePrice: z.string().optional(),
  discount: z.string().optional(),
  sku: z.string(),
  stockStatus: z.string().optional(),
  quantity: z.number().int().min(0),
  stockAlert: z.number().int().min(0).optional(),
  units: z.string().optional(),
  attributes: z.array(
    z.object({
      name: z.string(),
      value: z.any(), // Accepts string/array/mixed
    })
  ).optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
});


type UploadImage = {
  file: File | string;
  url?: string; // final Cloudinary URL
  progress?: number; // upload progress (0–100)
  uploading?: boolean;
};

type ProductFormType = z.infer<typeof productSchema>;

const categoryData: Record<string, string[]> = {
  Electronics: ["Mobiles", "Laptops", "Cameras"],
  Clothing: ["Men", "Women", "Kids"],
  Accessories: ["Bags", "Watches", "Belts"],
};
const stockStatuses = ["In Stock", "Out of Stock", "Preorder"];
const units = ["Pieces", "Kg", "Liters"];

export default function AddProductPage() {
    const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      attributes: [{ name: "", value: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const watchAttributes = useWatch({ control, name: "attributes" });
  const selectedCategory = watch("category");
  const [submitStatus, setSubmitStatus] = useState<"draft" | "published">("draft");
  const [imagePreviews, setImagePreviews] = useState<UploadImage[]>([]);
  const [categories, setCategories] = useState<CategoryFormType[]>([]);




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




  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    for (const file of files) {
      const previewObj: UploadImage = {
        file,
        uploading: true,
        progress: 0,
      };

      // Add temp preview to UI
      setImagePreviews((prev) => [...prev, previewObj]);

      const formData = new FormData();
      formData.append("file", file);

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
          const res = JSON.parse(xhr.responseText);

          console.log(res);
          
          if (xhr.status === 200) {
            setImagePreviews((prev) =>
                prev.map((img,i) =>
        img.file === file
          ? { ...img, url: res.urls[i], uploading: false }
          : img
      )
            );
          } else {
            console.error("Upload error", res.error);
            setImagePreviews((prev) => prev.filter((img) => img.file !== file));
          }
        }
      };

      xhr.open("POST", "/api/upload");
      xhr.send(formData);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

const onSubmit = async (data: ProductFormType) => {


  
  try {
    const productDataWithImages = {
      ...data,
      status: submitStatus,
      images: imagePreviews.map((img) => img.url).filter(Boolean),
    };
 
    const toastId = toast.loading("Saving product...");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productDataWithImages),
    });

    const result = await res.json();

    if (res.ok) {
      toast.success("Product saved successfully!", { id: toastId });
      reset()
    } else {
      toast.error(result.error || "Failed to save product", { id: toastId });
    }
  } catch (error) {
    console.error("Submit Error:", error);
    toast.error("Something went wrong", { id: toast.loading("Submitting...") });
  }
};


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" dark:text-white text-black rounded space-y-6"
    >
      <h2 className="text-xl font-semibold">Add New Product</h2>
      <div className="md:grid-cols-2 grid grid-cols-1 gap-6">
        <section className="shadow-md space-y-6 rounded-md p-6 border border-gray-800/25 ">
          {/* Product Images Upload */}
          <div>
            <label>Product Images</label>
            <div className="grid grid-cols-4 gap-4">
              {imagePreviews.map((img, index) => {
                const src =
                  img.file instanceof File
                    ? URL.createObjectURL(img.file)
                    : typeof img.file === "string"
                      ? img.file
                      : (img.url ?? "");

                return (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt="preview"
                      className="w-full h-44 object-contain rounded border border-slate-700"
                    />

                    {img.uploading && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs text-white text-center py-1 rounded-b">
                        Uploading... {img.progress}%
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                );
              })}

              <label  className="w-full h-44 border border-dashed flex items-center justify-center text-sm text-gray-800 dark:text-gray-400 rounded cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                Browse Image
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label >Description</label>
            <textarea
              {...register("description")}
              rows={10}
              className="w-full px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
            />
          </div>
        </section>

        <section className="shadow-md rounded-md p-6 border border-gray-800/25 ">
          {/* General Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label htmlFor="productName">Product Name</label>
              <input
                {...register("productName")}
                className="w-full px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
              />
              {errors.productName && (
                <p className="text-red-500 text-sm">
                  {errors.productName.message}
                </p>
              )}
            </div>

            <div className=" col-span-2 flex gap-4 ">
              <div className="w-full">
                <label htmlFor="Brand">Brand</label>
                <input
                  {...register("brandName")}
                  className="w-full px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
                />
              </div>
              {/* Category */}
              <div className="w-full">
                <label htmlFor="category">Category</label>
                <select
                  {...register("category")}
                  className="w-full px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
                >
                  <option value="">Select Category</option>
                  {Object.keys(categoryData).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              {selectedCategory && (
                <div className="w-full">
                  <label htmlFor="subCategory">Sub Category</label>
                  <select
                    {...register("subCategory")}
                    className="w-full px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
                  >
                    <option value="">Select Sub Category</option>
                    {categoryData[selectedCategory]?.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="col-span-2 flex gap-4">
              <div className="w-full">
                <label htmlFor="regularPrice">Regular Price</label>
                <input
                  type="text"
                  {...register("regularPrice")}
                  className="w-full px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
                />
              </div>

              <div className="w-full">
                <label htmlFor="salePrice">Sale Price</label>
                <input
                  type="text"
                  {...register("salePrice")}
                  className="w-full px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
                />
              </div>
              <div className="w-full">
                <label htmlFor="discount">Discount</label>
                <input
                  type="text"
                  {...register("discount")}
                  className="w-full px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
                />
              </div>
            </div>

            <div className="col-span-2 flex gap-4">
              <div>
                <label htmlFor="stockStatus">Stock Status</label>
                <select
                  {...register("stockStatus")}
                  className="w-36 px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
                >
                  {stockStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  {...register("quantity", { valueAsNumber: true })}
                  className="w-full px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
                />
              </div>

              <div className="w-full">
                <label htmlFor="stockAlert">Stock Alert</label>
                <input
                  type="number"
                  {...register("stockAlert", { valueAsNumber: true })}
                  className="w-full px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
                />
              </div>
            </div>

            <div className="col-span-2 flex gap-4  ">
              <div>
                <label htmlFor="units">Units</label>
                <select
                  {...register("units")}
                  className="w-36 px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label htmlFor="dimensions">Dimensions (L*W*H)</label>
                <input
                  {...register("dimensions")}
                  className="w-full px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
                />
              </div>

              <div className="w-full">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  {...register("weight")}
                  className="w-full px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
                />
              </div>
            </div>
          </div>
          {/* Attributes */}
          <div className=" mt-4">
            <label htmlFor="attributes">Attributes</label>
            {fields.map((field, index) => {
              const currentAttrName = watchAttributes?.[index]?.name;
              return (
                <div key={field.id} className="flex items-center  gap-4 mb-4">
                  <select
                    {...register(`attributes.${index}.name`)}
                    className="w-36 px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
                  >
                    <option value="">Select Attribute</option>
                    <option value="Color">Color</option>
                    <option value="Size">Size</option>
                    <option value="Custom">Custom</option>
                  </select>

                  {currentAttrName === "Color" ? (
                    <Controller
                      control={control}
                      name={`attributes.${index}.value`}
                      render={({ field }) => (
                        <CreatableSelect
                          isMulti
                          options={colorOptions}
                          onChange={(val) =>
                            field.onChange(val.map((v) => v.value))
                          }
                          className="text-black w-full basic-multi-select"
                        />
                      )}
                    />
                  ) : currentAttrName === "Size" ? (
                    <Controller
                      control={control}
                      name={`attributes.${index}.value`}
                      render={({ field }) => (
                        <CreatableSelect
                          isMulti
                          options={sizeOptions}
                          onChange={(val) =>
                            field.onChange(val.map((v) => v.value))
                          }
                          className="text-black bg-slate-900 w-full basic-multi-select"
                        />
                      )}
                    />
                  ) : (
                    <input
                      {...register(`attributes.${index}.value`)}
                      placeholder="Value"
                      className="px-3 py-1 rounded dark:bg-gray-800 border border-gray-600"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500"
                  >
                    Remove Attribute
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => append({ name: "", value: "" })}
              className="border ml-2 hover:bg-slate-800 text-blue-500 p-1 rounded-md px-2"
            >
              + Add Attribute
            </button>
          </div>
        </section>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
  <button
  type="button"
  onClick={() => {
    setSubmitStatus("draft");
    handleSubmit(onSubmit)();
  }}
  className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
>
  Save to Drafts
</button>

<button
  type="button"
  onClick={() => {
    setSubmitStatus("published");
    handleSubmit(onSubmit)();
  }}
  className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded"
>
  Publish Product
</button>

{Object.keys(errors).length > 0 && (
  <div className="text-red-500 text-sm">
    Please fix the highlighted fields above.
  </div>
)}
</div>

    </form>
  );
}