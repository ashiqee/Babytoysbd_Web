"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Plus, Minus, X, Upload, Save, Package, Tag, Image as ImageIcon, DollarSign, Box } from "lucide-react";
import toast from "react-hot-toast";
import CreatableSelect from "react-select/creatable";
import { Image } from "@heroui/react";
import { slugify } from "@/utils/utils";
import { useTags } from "@/app/hooks/useTags";
import ProductDescription from "../richEditor/ProductDescription";
import { Types } from "mongoose";

interface Attribute {
  name: string;
  value: any;
}

interface TagsAttribute {
  name: string;
  slug: string;
}
type UploadImage = {
  file: File | string;
  url?: string;
  progress?: number;
  uploading?: boolean;
};

interface Category {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  icon: string;
  subcategories: string[];
}

interface Variation {
  attributes: Attribute[];
  regularPrice?: string;
  salePrice?: string;
  sku?: string;
  image?: string;
  quantity?: number;
}

interface ProductFormData {
  productName: string;
  brandName?: string;
  category?: string;
  subCategory?: string;
  regularPrice?: string;
  salePrice?: string;
  wholesalePrice?: string;
  discount?: string;
  sku?: string;
  stockStatus?: string;
  quantity?: number;
  stockAlert?: number;
  units?: string;
  variations: Variation[];
  dimensions?: string;
  weight?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: TagsAttribute[];
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  status?: "draft" | "published";
  images?: string[];
}

const AddProductPage = () => {
  const router = useRouter();
  const {tags }= useTags()
   const [allTags, setAllTags] = useState<TagsAttribute[]>(tags);
  const [formData, setFormData] = useState<ProductFormData>({
    productName: "",
    brandName: "",
    category: "",
    subCategory: "",
    regularPrice: "",
    salePrice: "",
    wholesalePrice: "",
    discount: "",
    sku: "",
    stockStatus: "In Stock",
    quantity: 0,
    stockAlert: 5,
    units: "piece",
    variations: [
      {
        attributes: [{ name: "", value: "" }],
        regularPrice: "",
        salePrice: "",
        sku: "",
        image: "",
        quantity: 0,
      },
    ],
    dimensions: "",
    weight: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    tags: [],
    ogImage: "",
    canonicalUrl: "",
    status: "draft",
    images: [""],
  });
  const [imagePreviews, setImagePreviews] = useState<UploadImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(
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

 const handleChange = (name: string, value: string | number) => {
  setFormData((prev) => ({
    ...prev,
    [name]:
      name === "quantity" || name === "stockAlert" ? Number(value) : value,
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

  const handleChooseImage = (variationIndex: number, url: string) => {
    handleVariationChange(variationIndex, "image", url);
  };

  const addVariation = () => {
    setFormData((prev) => ({
      ...prev,
      variations: [
        ...prev.variations,
        {
          attributes: [{ name: "", value: "" }],
          regularPrice: "",
          salePrice: "",
          sku: "",
          image: "",
          quantity: 0,
        },
      ],
    }));
  };

  const removeVariation = (index: number) => {
    if (formData.variations.length === 1) return;
    const newVariations = [...formData.variations];
    newVariations.splice(index, 1);
    setFormData((prev) => ({ ...prev, variations: newVariations }));
  };

  const handleVariationAttributeChange = (
    variationIndex: number,
    attributeIndex: number,
    field: keyof Attribute,
    value: string
  ) => {
    const newVariations = [...formData.variations];
    const newAttributes = [...newVariations[variationIndex].attributes];
    newAttributes[attributeIndex] = {
      ...newAttributes[attributeIndex],
      [field]: value,
    };
    newVariations[variationIndex] = {
      ...newVariations[variationIndex],
      attributes: newAttributes,
    };
    setFormData((prev) => ({ ...prev, variations: newVariations }));
  };

  const addVariationAttribute = (variationIndex: number) => {
    const newVariations = [...formData.variations];
    newVariations[variationIndex] = {
      ...newVariations[variationIndex],
      attributes: [
        ...newVariations[variationIndex].attributes,
        { name: "", value: "" },
      ],
    };
    setFormData((prev) => ({ ...prev, variations: newVariations }));
  };

  const removeVariationAttribute = (
    variationIndex: number,
    attributeIndex: number
  ) => {
    const newVariations = [...formData.variations];
    if (newVariations[variationIndex].attributes.length === 1) return;
    const newAttributes = [...newVariations[variationIndex].attributes];
    newAttributes.splice(attributeIndex, 1);
    newVariations[variationIndex] = {
      ...newVariations[variationIndex],
      attributes: newAttributes,
    };
    setFormData((prev) => ({ ...prev, variations: newVariations }));
  };

  const handleVariationChange = (
    variationIndex: number,
    field: keyof Variation,
    value: string | number
  ) => {
    const newVariations = [...formData.variations];
    newVariations[variationIndex] = {
      ...newVariations[variationIndex],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, variations: newVariations }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    // Check if adding these files would exceed the limit
    if (imagePreviews.length + files.length > 10) {
      toast.error("You can upload a maximum of 10 images");
      return;
    }
    
    for (const file of files) {
      // Check file size
      if (file.size > 5 * 1024 * 1024) { // 5MB
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



  const images = imagePreviews
    .map((img) => img.url)
    .filter(Boolean) as string[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const filteredVariations = formData.variations
        .map((variation) => ({
          ...variation,
          attributes: variation.attributes.filter(
            (attr) => attr.name.trim() !== "" && attr.value !== ""
          ),
        }))
        .filter((variation) => variation.attributes.length > 0);
      
      const payload = {
        ...formData,
        variations: filteredVariations,
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
      backgroundColor: '#fff',
      borderColor: '#d1d5db',
      minHeight: '42px',
      borderRadius: '0.5rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#9ca3af',
      },
    }),
    input: (provided: any) => ({
      ...provided,
      color: '#1f2937',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#fff',
      borderRadius: '0.5rem',
      marginTop: '0.25rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#eff6ff' : state.isFocused ? '#f3f4f6' : '#fff',
      color: state.isSelected ? '#1d4ed8' : '#1f2937',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#eff6ff',
      borderRadius: '0.25rem',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#1d4ed8',
      padding: '0.25rem 0.5rem',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#1d4ed8',
      borderRadius: '0 0.25rem 0.25rem 0',
      paddingLeft: '0.25rem',
      paddingRight: '0.25rem',
      '&:hover': {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: '#9ca3af',
      '&:hover': {
        color: '#6b7280',
      },
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: '#9ca3af',
      '&:hover': {
        color: '#6b7280',
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Add Product | Admin</title>
      </Head>
      
      <div>
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Add New Product</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Create a new product with all the necessary details, variations, and images</p>
        </div>
        
        <div className="bg-white rounded-md shadow-xl overflow-hidden">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
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
          
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Basic Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <Package className="h-6 w-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Enter product name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        id="brandName"
                        name="brandName"
                        value={formData.brandName}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Enter brand name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      {categoriesLoading ? (
                        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100">
                          Loading categories...
                        </div>
                      ) : (
                        <select
                          id="category"
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
                    
                    <div>
                      <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">
                        Sub Category
                      </label>
                      <select
                        id="subCategory"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
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
                    
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Pricing */}
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <DollarSign className="h-6 w-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">Pricing</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="regularPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Regular Price
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="text"
                          id="regularPrice"
                          name="regularPrice"
                          value={formData.regularPrice}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                          className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Sale Price
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="text"
                          id="salePrice"
                          name="salePrice"
                          value={formData.salePrice}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                          className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="wholesalePrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Wholesale Price
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="text"
                          id="wholesalePrice"
                          name="wholesalePrice"
                          value={formData.wholesalePrice}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                          className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                        Discount
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">%</span>
                        </div>
                        <input
                          type="text"
                          id="discount"
                          name="discount"
                          value={formData.discount}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                          className="w-full pr-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Inventory */}
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <Box className="h-6 w-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">Inventory</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="stockStatus" className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Status
                      </label>
                      <select
                        id="stockStatus"
                        name="stockStatus"
                        value={formData.stockStatus}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="backorder">Backorder</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="stockAlert" className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Alert
                      </label>
                      <input
                        type="number"
                        id="stockAlert"
                        name="stockAlert"
                        value={formData.stockAlert}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-1">
                        Units
                      </label>
                      <input
                        type="text"
                        id="units"
                        name="units"
                        value={formData.units}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="e.g. pieces, kg, liters"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-1">
                        Dimensions
                      </label>
                      <input
                        type="text"
                        id="dimensions"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="L x W x H"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                        Weight
                      </label>
                      <input
                        type="text"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="e.g. 500g, 2kg"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Description */}
        <ProductDescription
  value={formData.description}
  onChange={(value /*, delta, source, editor */) => handleChange('description', value)}
/>
                
                {/* Tags */}
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <Tag className="h-6 w-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">Tags</h2>
                  </div>
                  
                  <div>
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
                </div>
                
                {/* Variations */}
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Package className="h-6 w-6 text-blue-600 mr-2" />
                      <h2 className="text-xl font-bold text-gray-900">Product Variations</h2>
                    </div>
                    <button
                      type="button"
                      onClick={addVariation}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      <Plus className="h-5 w-5 mr-1" /> Add Variation
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {formData.variations.map((variation, variationIndex) => (
                      <div
                        key={variationIndex}
                        className="bg-white rounded-md p-6 border border-gray-200 shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Variation {variationIndex + 1}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeVariation(variationIndex)}
                            disabled={formData.variations.length === 1}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full disabled:opacity-50 transition duration-200"
                          >
                            <Minus className="h-5 w-5" />
                          </button>
                        </div>
                        
                        {/* Attributes */}
                        <div className="space-y-3 mb-6">
                          <label className="block text-sm font-medium text-gray-700">
                            Attributes
                          </label>
                          {variation.attributes.map((attribute, attributeIndex) => (
                            <div
                              key={attributeIndex}
                              className="flex flex-col gap-3 md:flex-row items-center "
                            >
                              <input
                                type="text"
                                placeholder="Name (e.g. Color)"
                                value={attribute.name}
                                onChange={(e) =>
                                  handleVariationAttributeChange(
                                    variationIndex,
                                    attributeIndex,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                              />
                              <input
                                type="text"
                                placeholder="Value (e.g. Red)"
                                value={attribute.value}
                                onChange={(e) =>
                                  handleVariationAttributeChange(
                                    variationIndex,
                                    attributeIndex,
                                    "value",
                                    e.target.value
                                  )
                                }
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeVariationAttribute(
                                    variationIndex,
                                    attributeIndex
                                  )
                                }
                                disabled={variation.attributes.length === 1}
                                className="p-3 text-red-600 hover:bg-red-100 rounded-lg disabled:opacity-50 transition duration-200"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addVariationAttribute(variationIndex)}
                            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Attribute
                          </button>
                        </div>
                        
                        {/* Prices */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Regular Price
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                              </div>
                              <input
                                type="text"
                                value={variation.regularPrice || ""}
                                onChange={(e) =>
                                  handleVariationChange(
                                    variationIndex,
                                    "regularPrice",
                                    e.target.value
                                  )
                                }
                                className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Sale Price
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                              </div>
                              <input
                                type="text"
                                value={variation.salePrice || ""}
                                onChange={(e) =>
                                  handleVariationChange(
                                    variationIndex,
                                    "salePrice",
                                    e.target.value
                                  )
                                }
                                className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* SKU and Quantity */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              SKU
                            </label>
                            <input
                              type="text"
                              value={variation.sku || ""}
                              onChange={(e) =>
                                handleVariationChange(
                                  variationIndex,
                                  "sku",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                              placeholder="Enter SKU"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quantity
                            </label>
                            <input
                              type="number"
                              value={variation.quantity || 0}
                              onChange={(e) =>
                                handleVariationChange(
                                  variationIndex,
                                  "quantity",
                                  Number(e.target.value)
                                )
                              }
                              min="0"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        
                        {/* Image */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Variation Image
                          </label>
                          {images.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-3">
                              {images.map((url, i) => (
                                <button
                                  key={i}
                                  onClick={() =>
                                    handleChooseImage(variationIndex, url)
                                  }
                                  className={`relative cursor-pointer rounded-lg border-2 p-1 ${
                                    variation.image === url
                                      ? "border-blue-500"
                                      : "border-transparent hover:border-gray-400"
                                  }`}
                                >
                                  <img
                                    src={url}
                                    alt={`Preview ${i}`}
                                    className="w-full h-24 object-cover rounded-md"
                                  />
                                  {variation.image === url && (
                                    <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                      Selected
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Images & Actions */}
              <div className="space-y-8">
                {/* Image Upload */}
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <ImageIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">Product Images</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
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
                                <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"/>
                                Uploading
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Upload button */}
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group">
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
                  <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
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
                
                {/* Action Buttons */}
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <div className="flex flex-col space-y-4">
                    <button
                      type="button"
                      onClick={() => router.push("/admin/products")}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200 flex items-center justify-center"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200 flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"/>
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Create Product
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;