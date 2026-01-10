"use client";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { string, z } from "zod";
import CreatableSelect from "react-select/creatable";
import toast from "react-hot-toast";
import { useCategories } from "@/app/hooks/useCategories";
import { useTags } from "@/app/hooks/useTags";
import { slugify } from "@/utils/utils";

interface TagsAttribute {
  name: string;
  slug: string;
}



const productSchema = z.object({
  productName: z.string().min(1),
  brandName: z.string().optional(),
  category: z.string().min(1),
  subCategory: z.string().optional(),
  sku: z.string().min(1).optional(),
  regularPrice: z.string().optional(),
  salePrice: z.string().optional(),
  wholesalePrice: z.string().optional(),
  discount: z.string().optional(),
  stockStatus: z.enum(["In Stock", "out_of_stock", "backorder"]).optional(),
  quantity: z.number().int().min(0),
  stockAlert: z.number().int().optional(),
  images: z.array(z.string().url()),
  units: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  description: z.string().optional(),
  sortDescription: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  tags: z.array(z.object({
  name: z.string(),
  slug: z.string()
})).optional(),
  variations: z
    .array(
      z.object({
        attributes: z.array(
          z.object({
            name: z.string(),
            value: z.any(),
          })
        ),
        regularPrice: z.string().optional(),
        salePrice: z.string().optional(),
        sku: z.string().optional(),
        image: z.string().url().optional(),
        quantity: z.number().int().min(0).optional(),
      })
    )
    .optional(),
});

type ProductFormType = z.infer<typeof productSchema>;

type Props = {
  defaultValues?: Partial<ProductFormType>;
  onSubmitHandler: (data: ProductFormType & { images: string[]; status: string }) => Promise<void>;
};

const categoryData: Record<string, string[]> = {
  Electronics: ["Mobiles", "Laptops", "Cameras"],
  Clothing: ["Men", "Women", "Kids"],
  Toys: ["Baby Toys", "Puzzle Toys", "Board Games"],
};

const colorOptions = ["Red", "Green", "Blue"].map((c) => ({ value: c, label: c }));
const sizeOptions = ["S", "M", "L"].map((s) => ({ value: s, label: s }));
const stockStatuses = ["In Stock", "out_of_stock", "backorder"];
const units = ["Pieces", "Kg", "Liters"];

const existingTags = ["Educational", "Baby", "Toy", "Wooden", "Plastic", "Puzzle", "Board Game", "Outdoor",
  'Newborn Toys (0-12 Months)',
    'Toddler Toys (1-3 Years)',
    'Preschool Toys (3-5 Years)',
    'Kids Toys (5-8 Years)',
    'Tween Toys (9+ Years)',
    'Mother Care'
];

type UploadImage = {
  file: File | string;
  url?: string;
  progress?: number;
  uploading?: boolean;
};

export default function ProductEditForm({ defaultValues, onSubmitHandler }: Props) {

  const { categories, loading, error } = useCategories();
  const { tags, loading : tagLoading, error:tagsError } = useTags();

  const [imagePreviews, setImagePreviews] = useState<UploadImage[]>(
    (defaultValues?.images || []).map((img: any) => ({ file: img, url: img, uploading: false }))
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProductFormType>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues as ProductFormType,
  });

  const { fields: variationFields, append: appendVariation, remove: removeVariation } = useFieldArray({ 
    control, 
    name: "variations" 
  });
  

  
  
  
  const watchCategory = watch("category");
  const watchVariations = useWatch({ control, name: "variations" });

  const selectedCategory = categories.find(c => c.name === watchCategory);
const subcats = selectedCategory?.subcategories ?? [];

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset,categories]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    for (const file of files) {
      const temp: UploadImage = { file, uploading: true, progress: 0 };
      setImagePreviews((prev) => [...prev, temp]);
      const formData = new FormData();
      formData.append("file", file);
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setImagePreviews((prev) =>
            prev.map((img) => (img.file === file ? { ...img, progress: percent } : img))
          );
        }
      };
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status === 200) {
            setImagePreviews((prev) =>
              prev.map((img) =>
                img.file === file ? { ...img, url: res.urls[0], uploading: false } : img)
            );
          } else {
            toast.error("Image upload failed");
            setImagePreviews((prev) => prev.filter((img) => img.file !== file));
          }
        }
      };
      xhr.open("POST", "/api/upload");
      xhr.send(formData);
    }
  };

  const handleRemoveImage = (i: number) => {
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addAttributeToVariation = (variationIndex: number) => {
    const currentAttributes = getValues(`variations.${variationIndex}.attributes`) || [];
    setValue(`variations.${variationIndex}.attributes`, [...currentAttributes, { name: "", value: "" }]);
  };

  // const removeAttributeFromVariation = (variationIndex: number, attrIndex: number) => {
  //   const currentAttributes = getValues(`variations.${variationIndex}.attributes`);
  //   const newAttributes = [...currentAttributes];
  //   newAttributes.splice(attrIndex, 1);
  //   setValue(`variations.${variationIndex}.attributes`, newAttributes);
  // };

  const onSubmit = async (data: ProductFormType,status: any) => {

  
    
    const payload = {
      ...data,
      status: status,
      images: imagePreviews.map((img) => img.url).filter(Boolean) as string[],
    };
    await onSubmitHandler(payload);
  };

  const inputClass = "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const sectionClass = "bg-white p-6 rounded-lg shadow-sm border border-gray-200";
  const sectionTitleClass = "text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Product Information</h1>
        
        {/* Image Upload Section */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Product Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {imagePreviews.map((img, idx) => {
              const src = img.file instanceof File ? URL.createObjectURL(img.file) : img.url!;
              return (
                <div key={idx} className="relative group">
                  <img src={src} alt="Product preview" className="h-32 w-full object-cover border rounded-lg" />
                  {img.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <div className="text-white text-center">
                        <div className="text-sm font-medium">Uploading</div>
                        <div className="text-xs">{img.progress}%</div>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              );
            })}
            <label className="h-32 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-sm rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              <span className="text-gray-600">Upload Image</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>
        
        {/* General Information Section */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="productName" className={labelClass}>Product Name *</label>
              <input {...register("productName")} className={inputClass} />
              {errors.productName && <p className="mt-1 text-sm text-red-600">{errors.productName.message}</p>}
            </div>
            <div>
              <label htmlFor="brandName" className={labelClass}>Brand Name</label>
              <input {...register("brandName")} className={inputClass} />
            </div>
           
           <div>
      {/* Category */}
<div>
  <label htmlFor="category" className="block mb-1">Category *</label>
  <select {...register("category")} className="border p-2 w-full" disabled={loading}>
    <option value="">
      {loading ? "Loading..." : "-- Select Category --"}
    </option>
    {categories.map((c,i) => (
      <option key={i} value={c.name}>
        {c.name}
      </option>
    ))}
  </select>
  {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
</div>




      {/* Loading/Error States */}
      {loading && <p className="text-sm text-gray-500">Loading categories...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>

    <div>
      {/* Subcategory */}
{watchCategory && (
  <div>
    <label htmlFor="subCategory" className="block mb-1">Subcategory</label>
    <select
      {...register("subCategory")}
      className="border p-2 w-full"
      disabled={!subcats.length}
    >
      <option value="">
        {subcats.length ? "-- Select Subcategory --" : "No subcategories"}
      </option>
      {subcats.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  </div>
)}
    </div>
            <div>
             <label htmlFor="tags" className={labelClass}>Tags</label>
<Controller
  control={control}
  name="tags"
  render={({ field }) => (
    <CreatableSelect
      isMulti
      placeholder="Add or select tags"
      value={
        field.value?.map(tag => ({
          label: tag.name,
          value: tag.slug
        })) || []
      }
      onChange={async (newValue) => {
        const mapped = await Promise.all(
          newValue.map(async option => {
            const slug = option.value || slugify(option.label);
            
            // check if this slug already exists in your provided tags list
            const exists = tags.some(t => t.slug === slug);

            if (!exists) {
              // ✅ Create the tag in DB
              const slugFY = slugify(slug)
              await fetch("/api/tags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: option.label, slug:slugFY })
              });
            }

            return { name: option.label, slug };
          })
        );

        field.onChange(mapped);
      }}
      options={tags.map(tag => ({
        value: tag.slug,
        label: tag.name
      }))}
      className="react-select-container"
      classNamePrefix="react-select"
    />
  )}
/>

            </div>
          </div>
        </div>
        
        {/* Pricing Section */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label htmlFor="regularPrice" className={labelClass}>Regular Price</label>
              <input {...register("regularPrice")} className={inputClass} />
            </div>
            <div>
              <label htmlFor="salePrice" className={labelClass}>Sale Price</label>
              <input {...register("salePrice")} className={inputClass} />
            </div>
            <div>
              <label htmlFor="wholesalePrice" className={labelClass}>Wholesale Price</label>
              <input {...register("wholesalePrice")} className={inputClass} />
            </div>
            <div>
              <label htmlFor="discount" className={labelClass}>Discount</label>
              <input {...register("discount")} className={inputClass} />
            </div>
          </div>
        </div>
        
        {/* Inventory Section */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="stockStatus" className={labelClass}>Stock Status</label>
              <select {...register("stockStatus")} className={inputClass}>
                <option value="">-- Select Status --</option>
                {stockStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="quantity" className={labelClass}>Quantity</label>
              <input type="number" {...register("quantity", { valueAsNumber: true })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="stockAlert" className={labelClass}>Stock Alert</label>
              <input type="number" {...register("stockAlert", { valueAsNumber: true })} className={inputClass} />
            </div>
          </div>
        </div>
        
        {/* Shipping/Physical Section */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Shipping & Physical Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="units" className={labelClass}>Units</label>
              <select {...register("units")} className={inputClass}>
                <option value="">-- Select Unit --</option>
                {units.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="dimensions" className={labelClass}>Dimensions</label>
              <input {...register("dimensions")} className={inputClass} />
            </div>
            <div>
              <label htmlFor="weight" className={labelClass}>Weight</label>
              <input {...register("weight")} className={inputClass} />
            </div>
          </div>
        </div>
        
        {/* Variations Section */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Product Variations</h2>
          {variationFields.map((variation, variationIndex) => (
            <div key={variation.id} className="border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800">Variation {variationIndex + 1}</h3>
                <button 
                  type="button" 
                  onClick={() => removeVariation(variationIndex)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove Variation
                </button>
              </div>
              
              {/* Variation Attributes */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Attributes</h4>
                {getValues(`variations.${variationIndex}.attributes`)?.map((attr: any, attrIndex: number) => (
                  <div key={attrIndex} className="flex gap-3 mb-3">
                    <select 
                      {...register(`variations.${variationIndex}.attributes.${attrIndex}.name`)} 
                      className="w-40 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Color">Color</option>
                      <option value="Size">Size</option>
                      <option value="Custom">Custom</option>
                    </select>
                    {attr.name === "Color" || attr.name === "Size" ? (
                      <Controller
                        control={control}
                        name={`variations.${variationIndex}.attributes.${attrIndex}.value`}
                        render={({ field }) => (
                          <CreatableSelect
                            isMulti
                            options={attr.name === "Color" ? colorOptions : sizeOptions}
                            onChange={(val) => field.onChange(val.map((v) => v.value))}
                            className="w-full react-select-container"
                            classNamePrefix="react-select"
                          />
                        )}
                      />
                    ) : (
                      <input 
                        {...register(`variations.${variationIndex}.attributes.${attrIndex}.value`)} 
                        className="flex-1 p-2 border border-gray-300 rounded-md" 
                      />
                    )}
                  
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addAttributeToVariation(variationIndex)}
                  className="text-blue-500 hover:text-blue-700 text-sm transition-colors"
                >
                  + Add Attribute
                </button>
              </div>
              
              {/* Variation Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Regular Price</label>
                  <input 
                    {...register(`variations.${variationIndex}.regularPrice`)} 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Sale Price</label>
                  <input 
                    {...register(`variations.${variationIndex}.salePrice`)} 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">SKU</label>
                  <input 
                    {...register(`variations.${variationIndex}.sku`)} 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Quantity</label>
                  <input 
                    {...register(`variations.${variationIndex}.quantity`, { valueAsNumber: true })} 
                    type="number" 
                    className={inputClass} 
                  />
                </div>
              </div>
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => appendVariation({ 
              attributes: [{ name: "", value: "" }], 
              regularPrice: "", 
              salePrice: "", 
              sku: "", 
              quantity: 0 
            })}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            + Add Variation
          </button>
        </div>
        
        {/* Descriptions Section */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Product Descriptions</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="description" className={labelClass}>Full Description</label>
              <textarea 
                {...register("description")} 
                rows={5} 
                className={inputClass} 
                placeholder="Detailed product description..."
              />
            </div>
            <div>
              <label htmlFor="sortDescription" className={labelClass}>Short Description</label>
              <textarea 
                {...register("sortDescription")} 
                rows={3} 
                className={inputClass} 
                placeholder="Brief product description..."
              />
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button 
            type="button" 
            
              onClick={handleSubmit((data) => onSubmit(data, "draft"))}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Save Draft
          </button>
          <button 
            type="button" 
              onClick={handleSubmit((data) => onSubmit(data, "published"))}
            className="px-6 py-2 border border-transparent text-white font-medium rounded-md shadow-sm bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Publish Product
          </button>
        </div>
      </div>
    </form>
  );
}