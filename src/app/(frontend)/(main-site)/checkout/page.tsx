"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Icon from "@/components/AppIcon";
import CheckoutProgress from "./components/CheckoutProgress";
import ShippingForm from "./components/ShippingForm";
import PaymentForm from "./components/PaymentForm";
import ReviewOrder from "./components/ReviewOrder";
import OrderSummary from "./components/OrderSummary";
import TrustBadges from "./components/TrustBadges";
import { useCarts } from "@/app/hooks/usecarts";
import { Button } from "@heroui/button";
import CartButton from "../../_components/shared/CartButton";

import {  trackBeginCheckout, trackPurchase, trackPurchaseServer } from "@/lib/db/GTM/gtm";
import { trackPurchaseGTMS } from "@/lib/db/GTM/send-by-server";

type DeliveryOptionKey =
  | "standard"
  | "express"
  | "same-day"
  | "regular"
  | "transport";
type PaymentMethodKey = "bkash" | "nagad" | "rocket" | "card" | "cod";

interface FormData {
  email: any;
  // Shipping data
  fullName: string;
  phone: string;
  address: string;
  division: string;
  instructions: string;
  deliveryOption: DeliveryOptionKey;
  giftWrap: boolean;
  saveAddress: boolean;
  // Payment data
  paymentMethod: PaymentMethodKey;
  trxid: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  mobileNumber: string;
}

const Checkout = () => {
  const router = useRouter();
  const { items, clearCart } = useCarts();
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "bn">("en");
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    address: "",
    email: "",
    division: "",
    instructions: "",
    deliveryOption: "standard",
    giftWrap: false,
    saveAddress: false,
    paymentMethod: "cod",
    trxid: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    mobileNumber: "",
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push("/carts");
    }


    trackBeginCheckout(items)
    // Load language preference from localStorage
    const savedLanguage =
      (localStorage.getItem("language") as "en" | "bn") || "en";
    setCurrentLanguage(savedLanguage);

    // Listen for language changes
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail);
    };

    window.addEventListener(
      "languageChange",
      handleLanguageChange as EventListener
    );
    return () =>
      window.removeEventListener(
        "languageChange",
        handleLanguageChange as EventListener
      );
  }, []);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Track step progression
      const stepEventName =
        currentStep === 1 ? "AddShippingInfo" : "ReviewOrder";
      const url = currentStep === 1 ? "/checkout/shipping" : "/checkout/review";
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      // Prepare payment details based on payment method
      const paymentDetails = {
        method: formData.paymentMethod,
        transactionId: formData.trxid || undefined,
        mobileNumber: formData.mobileNumber,
      };

      // Prepare order data according to backend expectations
      const orderData = {
        customer: {
          fullName: formData.fullName,
          mobileNumber: formData.phone,
          address: formData.address,
          division: formData.division,
          instructions: formData.instructions,
        },
        productPrice: subtotal,
        shippingCost: deliveryCharge,
        itemsQty: items.reduce((sum, item) => sum + item.quantity, 0),
        customerNote: formData.instructions,
        getDiscount: 0, // Update if you have discount logic
        color: "", // Optional field
        totalAmount: total,
        products: items.map((item) => ({
          productId: item._id,
          name: item.productName,
          price: item.salePrice,
          image: item.image,
          quantity: item.quantity,
          category: item.category,
        })),
        paymentDetails,
        giftWrap: formData.giftWrap,
        deliveryOption: formData.deliveryOption,
        paymentStatus: formData.paymentMethod === "cod" ? "unpaid" : "paid",
        priority: "Normal",
        deliveryCompany: "SteadFast",
        // Include Facebook event ID for server-side tracking
        // facebookEventId: purchaseEventId,
      };

      // Send client-side Purchase event (for immediate tracking)
      const contents = items.map((item) => ({
        id: item._id,
        quantity: item.quantity,
        item_price: item.salePrice,
      }));

      const totalValue = items.reduce(
        (sum, item) => sum + item.salePrice * item.quantity,
        0
      );



      // Send order to API
      const response = await fetch("/api/orders/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to place order");
      }

      const res = await response.json();

      const result = res?.data?.order;
      
      

      // ✅ Save essential details in localStorage
      localStorage.setItem(
        "orderDetails",
        JSON.stringify(result)
      );
      // Store order data locally
      localStorage.setItem("lastOrderId", result.orderId);
      localStorage.setItem("cartCount", "0");
      localStorage.setItem("cartTotal", "0");

      // Clear cart
      clearCart();

      // Dispatch cart update event
      window.dispatchEvent(
        new CustomEvent("cartUpdate", {
          detail: { count: 0, total: 0 },
        })
      );
    // ✅ Track purchase (client-side sync, no await)
    trackPurchase(result);

    // ✅ Track server-side (async, with error handling)
    try {
      await trackPurchaseServer(result);
    } catch (trackingError) {
      console.error("Server-side tracking failed:", trackingError);
      // Don't block UX—log only
    }

      // Navigate to success page with order ID
      router.push(`/order-success?orderId=${result.orderId}`);
    } catch (error: any) {
      console.error("Order processing failed:", error);
      alert(
        currentLanguage === "en"
          ? `Order processing failed: ${error.message}`
          : `অর্ডার প্রক্রিয়াকরণ ব্যর্থ হয়েছে: ${error.message}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate order totals
  const subtotal = items.reduce(
    (sum: number, item: { salePrice: number; quantity: number }) =>
      sum + item.salePrice * item.quantity,
    0
  );
  const deliveryCharge = formData.deliveryOption
    ? formData.deliveryOption === "standard"
      ? 60
      : formData.deliveryOption === "express"
        ? 120
        : formData.deliveryOption === "same-day"
          ? 200
          : formData.deliveryOption === "regular"
            ? 130
            : formData.deliveryOption === "transport"
              ? 300
              : 0
    : 0;
  const giftWrapCharge = formData.giftWrap ? 50 : 0;
  const checkFree = subtotal >= 5000 ? 0 : deliveryCharge;
  const total = subtotal + checkFree + giftWrapCharge;

  return (
    <div className="min-h-screen pt-10 md:pt-12 ">
      {/* Header */}
      <div className="bg-background/5 rounded-md border-b border-border/45">
        <div className="container mx-auto  py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/carts")}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Icon name="ArrowLeft" size={20} />
                <span className="font-body text-sm">
                  {currentLanguage === "en"
                    ? "Back to Cart"
                    : "কার্টে ফিরে যান"}
                </span>
              </button>
            </div>

            <h1 className="font-heading font-semibold md:text-2xl ">
              {currentLanguage === "en" ? "Checkout" : "চেকআউট"}
            </h1>

            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="Lock" size={16} />
              <span className="font-caption text-sm">
                {currentLanguage === "en" ? "Secure" : "নিরাপদ"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto   py-3">
        <div>
          {/* Progress Indicator */}
          <CheckoutProgress
            currentStep={currentStep}
            currentLanguage={currentLanguage}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-3">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <ShippingForm
                  currentLanguage={currentLanguage}
                  onNext={handleNextStep}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <PaymentForm
                  currentLanguage={currentLanguage}
                  onNext={handleNextStep}
                  onBack={handlePrevStep}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <ReviewOrder
                  currentLanguage={currentLanguage}
                  onBack={handlePrevStep}
                  onPlaceOrder={handlePlaceOrder}
                  formData={formData}
                  isProcessing={isProcessing}
                />
              )}

              {/* Trust Badges */}
              <TrustBadges currentLanguage={currentLanguage} />
            </div>

            {/* Sidebar - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <OrderSummary
                  currentLanguage={currentLanguage}
                  items={items}
                  subtotal={subtotal}
                  deliveryCharge={deliveryCharge}
                  giftWrapCharge={giftWrapCharge}
                  total={total}
                  formData={formData}
                />

                {/* Help Section */}
                <div className="mt-3  bg-background/5 border border-border rounded-lg p-4">
                  <h3 className="font-body font-medium  mb-3 flex items-center space-x-2">
                    <Icon name="HelpCircle" size={18} />
                    <span>
                      {currentLanguage === "en"
                        ? "Need Help?"
                        : "সাহায্য প্রয়োজন?"}
                    </span>
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Icon
                        name="Phone"
                        size={16}
                        color="var(--color-primary)"
                      />
                      <div>
                        <p className="font-body text-sm font-medium ">
                          {currentLanguage === "en"
                            ? "Call Us"
                            : "আমাদের কল করুন"}
                        </p>
                        <p className="font-data text-xs text-muted-foreground">
                          +880 1700-000000
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Icon
                        name="MessageCircle"
                        size={16}
                        color="var(--color-primary)"
                      />
                      <div>
                        <p className="font-body text-sm font-medium ">
                          {currentLanguage === "en"
                            ? "Live Chat"
                            : "লাইভ চ্যাট"}
                        </p>
                        <p className="font-caption text-xs text-muted-foreground">
                          {currentLanguage === "en"
                            ? "Available 24/7"
                            : "২৪/৭ উপলব্ধ"}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-3 flex items-center"
                    >
                      <Icon name="ExternalLink" size={12} />
                      {currentLanguage === "en"
                        ? "Contact Support"
                        : "সাপোর্টের সাথে যোগাযোগ"}
                    </Button>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon
                      name="Shield"
                      size={16}
                      color="#2D5A87"
                      className="mt-0.5"
                    />
                    <div>
                      <p className="font-caption text-xs  font-medium">
                        {currentLanguage === "en"
                          ? "Your data is protected"
                          : "আপনার ডেটা সুরক্ষিত"}
                      </p>
                      <p className="font-caption text-xs text-muted-foreground">
                        {currentLanguage === "en"
                          ? "SSL encrypted & PCI compliant"
                          : "SSL এনক্রিপ্টেড এবং PCI সম্মত"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0  bg-background/5 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className=" bg-background/5 border border-border rounded-lg p-8 text-center max-w-sm mx-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="ShoppingBag" size={32} color="var(--color-primary)" />
            </div>
            <h3 className="font-heading font-semibold text-lg  mb-2">
              {currentLanguage === "en"
                ? "Processing Your Order"
                : "আপনার অর্ডার প্রক্রিয়াকরণ"}
            </h3>
            <p className="font-caption text-sm text-muted-foreground mb-4">
              {currentLanguage === "en"
                ? "Please wait while we process your payment and create your order..."
                : "আমরা আপনার পেমেন্ট প্রক্রিয়া করে অর্ডার তৈরি করার সময় অনুগ্রহ করে অপেক্ষা করুন..."}
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      )}
      <CartButton />
    </div>
  );
};

export default Checkout;
