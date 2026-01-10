import React, { useState } from "react";
import Icon from "@/components/AppIcon";

interface ShippingFormProps {
  currentLanguage: "en" | "bn";
  onNext: () => void;
  formData: {
    fullName: string;
    phone: string;
    address: string;
    division: string;
    instructions: string;
    deliveryOption: string;
    giftWrap: boolean;
    saveAddress: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  currentLanguage,
  onNext,
  formData,
  setFormData,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const divisions = [
    { value: "dhaka", label: currentLanguage === "en" ? "Inside Dhaka" : "ঢাকা" },
    { value: "chittagong", label: currentLanguage === "en" ? "Outside Dhaka" : "চট্টগ্রাম" },
    // { value: "sylhet", label: currentLanguage === "en" ? "Sylhet" : "সিলেট" },
    // { value: "rajshahi", label: currentLanguage === "en" ? "Rajshahi" : "রাজশাহী" },
    // { value: "khulna", label: currentLanguage === "en" ? "Khulna" : "খুলনা" },
    // { value: "barisal", label: currentLanguage === "en" ? "Barisal" : "বরিশাল" },
    // { value: "rangpur", label: currentLanguage === "en" ? "Rangpur" : "রংপুর" },
    // { value: "mymensingh", label: currentLanguage === "en" ? "Mymensingh" : "ময়মনসিংহ" },
  ];

  const deliveryOptionsOutSideDhaka = [
    {
      id: "regular",
      title: { en: "Standard Delivery", bn: "স্ট্যান্ডার্ড ডেলিভারি" },
      time: { en: "1-7 business days", bn: "১-৭ কার্যদিবস" },
      price: 130,
      description: { en: "Regular delivery to your address", bn: "আপনার ঠিকানায় নিয়মিত ডেলিভারি" },
    },
    {
      id: "transport",
      title: { en: "Transport Delivery", bn: "ট্রান্সপোর্ট ডেলিভারি" },
      time: { en: "1-2 business days", bn: "১-২ কার্যদিবস" },
      price: 300,
      description: { en: "Fast delivery in Bangladesh", bn: "সারাদেশের মধ্যে দ্রুত ডেলিভারি" },
    },
  ];

  const deliveryOptionsDhaka = [
    {
      id: "standard",
      title: { en: "Standard Delivery", bn: "স্ট্যান্ডার্ড ডেলিভারি" },
      time: { en: "3-5 business days", bn: "৩-৫ কার্যদিবস" },
      price: 60,
      description: { en: "Regular delivery to your address", bn: "আপনার ঠিকানায় নিয়ত ডেলিভারি" },
    },
    {
      id: "express",
      title: { en: "Express Delivery", bn: "এক্সপ্রেস ডেলিভারি" },
      time: { en: "1-2 business days", bn: "১-২ কার্যদিবস" },
      price: 120,
      description: { en: "Fast delivery within Dhaka", bn: "ঢাকার মধ্যে দ্রুত ডেলিভারি" },
    },
    {
      id: "same-day",
      title: { en: "Same Day Delivery", bn: "একই দিন ডেলিভারি" },
      time: { en: "Within 6 hours", bn: "৬ ঘন্টার মধ্যে" },
      price: 200,
      description: { en: "Available in Dhaka city only", bn: "শুধুমাত্র ঢাকা শহরে উপলব্ধ" },
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName?.trim()) {
      newErrors.fullName = currentLanguage === "en" ? "Full name is required" : "পূর্ণ নাম প্রয়োজন";
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = currentLanguage === "en" ? "Phone number is required" : "ফোন নম্বর প্রয়োজন";
    } else if (!/^(\+88)?01[3-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone =
        currentLanguage === "en"
          ? "Please enter a valid Bangladeshi phone number"
          : "একটি বৈধ বাংলাদেশী ফোন নম্বর দিন";
    }
    if (!formData.address?.trim()) {
      newErrors.address = currentLanguage === "en" ? "Address is required" : "ঠিকানা প্রয়োজন";
    }
    if (!formData.division) {
      newErrors.division =
        currentLanguage === "en" ? "Please select a division" : "একটি বিভাগ নির্বাচন করুন";
    }
    if (!formData.deliveryOption) {
      newErrors.deliveryOption =
        currentLanguage === "en"
          ? "Please select a delivery option"
          : "একটি ডেলিভারি অপশন নির্বাচন করুন";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev: any) => {
      let updatedData = { ...prev, [field]: value };
      
      // Reset delivery option when division changes
      if (field === "division" && prev.division !== value && prev.deliveryOption) {
        updatedData = { ...updatedData, deliveryOption: "" };
      }
      
      return updatedData;
    });
    
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className=" bg-background/5 border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-3">
        <Icon name="MapPin" size={24} color="#27AE60" />
        <h2 className="font-heading font-semibold text-xl">
          {currentLanguage === "en" ? "Shipping Information" : "শিপিং তথ্য"}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">
              {currentLanguage === "en" ? "Full Name" : "পূর্ণ নাম"}
            </label>
            <input
              type="text"
              placeholder={
                currentLanguage === "en" ? "Enter your full name" : "আপনার পূর্ণ নাম লিখুন"
              }
              value={formData.fullName || ""}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="w-full border rounded p-2"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium">
              {currentLanguage === "en" ? "Phone Number" : "ফোন নম্বর"}
            </label>
            <input
              type="tel"
              placeholder={currentLanguage === "en" ? "+880 1X XXX XXXXX" : "+৮৮০ ১X XXX XXXXX"}
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full border rounded p-2"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
        </div>
        {/* Address + Division */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">
              {currentLanguage === "en" ? "Full Address" : "বিস্তারিত ঠিকানা"}
            </label>
            <input
              type="text"
              placeholder={
                currentLanguage === "en" ? "House/Flat, Road, Area" : "বাড়ি/ফ্ল্যাট, রাস্তা, এলাকা"
              }
              value={formData.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full border rounded p-2"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium">
              {currentLanguage === "en" ? "Location" : "বিভাগ"}
            </label>
            <select
              value={formData.division || ""}
              onChange={(e) => handleInputChange("division", e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">{currentLanguage === "en" ? "Select division" : "বিভাগ নির্বাচন করুন"}</option>
              {divisions.map((div) => (
                <option key={div.value} value={div.value}>
                  {div.label}
                </option>
              ))}
            </select>
            {errors.division && <p className="text-red-500 text-sm">{errors.division}</p>}
          </div>
        </div>
        {/* Special Instructions */}
        <div>
          <label className="block mb-1 font-medium">
            {currentLanguage === "en" ? "Special Instructions (Optional)" : "বিশেষ নির্দেশনা (ঐচ্ছিক)"}
          </label>
          <textarea
            placeholder={
              currentLanguage === "en"
                ? "Delivery instructions, landmarks, etc."
                : "ডেলিভারি নির্দেশনা, ল্যান্ডমার্ক ইত্যাদি"
            }
            value={formData.instructions || ""}
            onChange={(e) => handleInputChange("instructions", e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        {/* Delivery Options */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">
            {currentLanguage === "en" ? "Delivery Options" : "ডেলিভারি অপশন"}
          </h3>
          <div className="space-y-3">
            {
              formData.division === "dhaka" 
                ? deliveryOptionsDhaka.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-start border rounded-lg p-4 cursor-pointer ${
                        formData.deliveryOption === option.id ? "border-primary bg-primary/5" : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryOption"
                        value={option.id}
                        checked={formData.deliveryOption === option.id}
                        onChange={() => handleInputChange("deliveryOption", option.id)}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <h4 className="font-medium">{option.title[currentLanguage]}</h4>
                        <p className="text-sm text-gray-600">{option.description[currentLanguage]}</p>
                        <p className="font-semibold">৳{option.price}</p>
                        <p className="text-xs text-gray-500">{option.time[currentLanguage]}</p>
                      </div>
                    </label>
                  ))
                : deliveryOptionsOutSideDhaka.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-start border rounded-lg p-4 cursor-pointer ${
                        formData.deliveryOption === option.id ? "border-primary bg-primary/5" : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryOption"
                        value={option.id}
                        checked={formData.deliveryOption === option.id}
                        onChange={() => handleInputChange("deliveryOption", option.id)}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <h4 className="font-medium">{option.title[currentLanguage]}</h4>
                        <p className="text-sm text-gray-600">{option.description[currentLanguage]}</p>
                        <p className="font-semibold">৳{option.price}</p>
                        <p className="text-xs text-gray-500">{option.time[currentLanguage]}</p>
                      </div>
                    </label>
                  ))
            }
          </div>
          {errors.deliveryOption && <p className="text-red-500 text-sm">{errors.deliveryOption}</p>}
        </div>
        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.giftWrap || false}
              onChange={(e) => handleInputChange("giftWrap", e.target.checked)}
            />
            <span>{currentLanguage === "en" ? "Gift wrapping (+৳50)" : "গিফট র‍্যাপিং (+৳৫০)"}</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.saveAddress || false}
              onChange={(e) => handleInputChange("saveAddress", e.target.checked)}
            />
            <span>
              {currentLanguage === "en"
                ? "Save this address for future orders"
                : "ভবিষ্যতের অর্ডারের জন্য এই ঠিকানা সংরক্ষণ করুন"}
            </span>
          </label>
        </div>
        {/* Submit */}
        <div className="flex justify-end pt-6">
          <button type="submit" className="px-6 py-2 bg-primary text-white rounded">
            {currentLanguage === "en" ? "Continue to Payment" : "পেমেন্টে এগিয়ে যান"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;