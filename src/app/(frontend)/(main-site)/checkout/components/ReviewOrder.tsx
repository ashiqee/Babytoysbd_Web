import React, { useState } from 'react';

import Icon from '@/components/AppIcon';
import { Button } from '@heroui/button';
import { Checkbox } from '@/components/ui/BTCheckbox';

// Define the keys of delivery options
type DeliveryOptionKey = "standard" | "express" | "same-day" |"regular"|"transport";
type PaymentMethodKey = "bkash" | "nagad" | "rocket" | "card" | "cod";


// Define the structure of names
type DeliveryOptionNames = Record<
  DeliveryOptionKey,
  { en: string; bn: string }
>;
interface ReviewOrderProps {
  currentLanguage: 'en' | 'bn';
  onBack: () => void;
  onPlaceOrder: () => void;
  formData: {
    fullName: string;
    phone: string;
    address: string;
    division: string;
    instructions: string;
    deliveryOption: DeliveryOptionKey;
    giftWrap: boolean;
    paymentMethod: PaymentMethodKey;
    cardNumber: string;
    mobileNumber: string;
  };
  isProcessing: boolean;
}

const ReviewOrder: React.FC<ReviewOrderProps> = ({
  currentLanguage,
  onBack,
  onPlaceOrder,
  formData,
  isProcessing
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const paymentMethodNames = {
    bkash: 'bKash',
    nagad: 'Nagad',
    rocket: 'Rocket',
    card: currentLanguage === 'en' ? 'Credit/Debit Card' : 'ক্রেডিট/ডেবিট কার্ড',
    cod: currentLanguage === 'en' ? 'Cash on Delivery' : 'ক্যাশ অন ডেলিভারি'
  };

  const deliveryOptionNames: DeliveryOptionNames = {
  standard: { en: "Standard Delivery (3-5 days)", bn: "স্ট্যান্ডার্ড ডেলিভারি (৩-৫ দিন)" },
  express: { en: "Express Delivery (1-2 days)", bn: "এক্সপ্রেস ডেলিভারি (১-২ দিন)" },
  "same-day": { en: "Same Day Delivery", bn: "একই দিন ডেলিভারি" },
  regular:  { en: "Regular Delivery", bn: "রেগুলার ট্রান্সপোর্ট" },
  transport: { en: "Transport Delivery", bn: " ট্রান্সপোর্ট ডেলিভারি" },
      
};

  const canPlaceOrder = agreedToTerms && agreedToPrivacy && !isProcessing;

  const handlePlaceOrder = () => {
    if (canPlaceOrder) {
      onPlaceOrder();
    }
  };



  return (
    <div className=" bg-background/5 border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-3">
        <Icon name="CheckCircle" size={24} color="#2D5A87" />
        <h2 className="font-heading font-semibold text-xl ">
          {currentLanguage === 'en' ? 'Review Your Order' : 'আপনার অর্ডার পর্যালোচনা করুন'}
        </h2>
      </div>
      
      <div className="space-y-6">
        {/* Shipping Information */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-body font-medium  flex items-center space-x-2">
              <Icon name="MapPin" size={18} />
              <span>{currentLanguage === 'en' ? 'Shipping Address' : 'শিপিং ঠিকানা'}</span>
            </h3>
            <Button variant="ghost" size="sm" onClick={onBack}>
              {currentLanguage === 'en' ? 'Edit' : 'সম্পাদনা'}
            </Button>
          </div>
          
          <div className="space-y-1 text-sm">
            <p className="font-body font-medium ">{formData.fullName}</p>
            <p className="font-caption text-muted-foreground">{formData.phone}</p>
            <p className="font-caption text-muted-foreground">{formData.address}</p>
            <p className="font-caption text-muted-foreground">
              {formData.division}
            </p>
            {formData.instructions && (
              <p className="font-caption text-muted-foreground italic">
                {currentLanguage === 'en' ? 'Note:' : 'নোট:'} {formData.instructions}
              </p>
            )}
          </div>
        </div>
        
        {/* Delivery Information */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-body font-medium  flex items-center space-x-2 mb-3">
            <Icon name="Truck" size={18} />
            <span>{currentLanguage === 'en' ? 'Delivery Method' : 'ডেলিভারি পদ্ধতি'}</span>
          </h3>
          
          <div className="flex items-center justify-between">
            <p className="font-caption text-muted-foreground">
              {deliveryOptionNames[formData.deliveryOption]?.[currentLanguage]}
              {/* {getDeliveryName(formData.deliveryOption,currentLanguage)} */}
            </p>
            {formData.giftWrap && (
              <div className="flex items-center space-x-1 text-xs ">
                <Icon name="Gift" size={14} />
                <span>{currentLanguage === 'en' ? 'Gift Wrapped' : 'গিফট র‍্যাপড'}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Payment Information */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-body font-medium  flex items-center space-x-2 mb-3">
            <Icon name="CreditCard" size={18} />
            <span>{currentLanguage === 'en' ? 'Payment Method' : 'পেমেন্ট পদ্ধতি'}</span>
          </h3>
          
          <div className="space-y-2">
            <p className="font-caption text-muted-foreground">
              {paymentMethodNames[formData.paymentMethod]}
            </p>
            
            {formData.paymentMethod === 'card' && formData.cardNumber && (
              <p className="font-data text-xs text-muted-foreground">
                **** **** **** {formData.cardNumber.slice(-4)}
              </p>
            )}
            
            {['bkash', 'nagad', 'rocket'].includes(formData.paymentMethod) && formData.mobileNumber && (
              <p className="font-data text-xs text-muted-foreground">
                {formData.mobileNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1 **** $3')}
              </p>
            )}
          </div>
        </div>
        
        {/* Terms and Conditions */}
        <div className="space-y-4 border-t border-border pt-6">
          <Checkbox
            label={
              currentLanguage === 'en' 
                ? 'I agree to the Terms & Conditions and Return Policy' 
                : 'আমি শর্তাবলী এবং রিটার্ন নীতিতে সম্মত'
            }
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            required
            size='lg'
          />
          
          <Checkbox
            label={
              currentLanguage === 'en' 
                ? 'I agree to the Privacy Policy and data processing' 
                : 'আমি গোপনীয়তা নীতি এবং ডেটা প্রক্রিয়াকরণে সম্মত'
            }
            checked={agreedToPrivacy}
            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
            required
            size='lg'
          />
        </div>
        
        {/* Security Notice */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-50/10 border border-success/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} color="var(--color-success)" className="mt-0.5" />
            <div>
              <h4 className="font-body font-medium  mb-1">
                {currentLanguage === 'en' ? 'Secure Checkout' : 'নিরাপদ চেকআউট'}
              </h4>
              <p className="font-caption text-sm text-muted-foreground">
                {currentLanguage === 'en' 
                  ? 'Your payment information is encrypted and secure. We never store your card details.' 
                  : 'আপনার পেমেন্ট তথ্য এনক্রিপ্টেড এবং নিরাপদ। আমরা কখনো আপনার কার্ডের বিবরণ সংরক্ষণ করি না।'
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
          <Button
            type="button"
            variant="ghost"
            onPress={onBack}
            disabled={isProcessing}
            className="sm:w-auto"
          >
            <Icon name='ArrowLeft' size={16} />
            {currentLanguage === 'en' ? 'Back to Payment' : 'পেমেন্টে ফিরে যান'}
          </Button>
          
          <Button
            type="button"
            variant="bordered"
            
            onPress={handlePlaceOrder}
            disabled={!canPlaceOrder}
              className={`${!canPlaceOrder ? "bg-gray-300 cursor-not-allowed " : " bg-gradient-to-tr  to-yellow-500 from-yellow-400" } sm:w-auto px-8 `}
          >
            {isProcessing 
              ? (currentLanguage === 'en' ? 'Processing...' : 'প্রক্রিয়াকরণ...')
              : <>  {isProcessing ? undefined : <Icon name='ShoppingBag' size={16} />} {(currentLanguage === 'en' ? 'Place Order' : 'অর্ডার দিন')}</>
            }
          </Button>
        </div>
        
        {!canPlaceOrder && !isProcessing && (
          <p className="text-red-600 text-sm font-caption text-center">
            {currentLanguage === 'en' 
              ? 'Please agree to the terms and conditions to continue' 
              : 'এগিয়ে যেতে দয়া করে শর্তাবলীতে সম্মত হন'
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewOrder;