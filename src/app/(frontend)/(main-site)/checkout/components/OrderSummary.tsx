import React from 'react';
import Icon from '@/components/AppIcon';

import { CartItem } from '@/redux/features/cart/cart.slice';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { ScrollShadow } from '@heroui/react';

type DeliveryOptionKey = "standard" | "express" | "same-day" |"regular"|"transport";
interface OrderSummaryProps {
  currentLanguage: 'en' | 'bn';
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  giftWrapCharge: number;
  total: number;
  formData: {
    deliveryOption: DeliveryOptionKey;
  };
  className?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  currentLanguage,
  items,
  subtotal,
  deliveryCharge,
  giftWrapCharge,
  total,
  formData,
  className = ''
}) => {
  const deliveryOptions = {
    standard: { price: 60, name: { en: 'Standard Delivery', bn: 'স্ট্যান্ডার্ড ডেলিভারি' } },
    express: { price: 120, name: { en: 'Express Delivery', bn: 'এক্সপ্রেস ডেলিভারি' } },
    'same-day': { price: 200, name: { en: 'Same Day Delivery', bn: 'একই দিন ডেলিভারি' } },
      regular: {
        price: 130,
        name: { en: "Regular Delivery", bn: "রেগুলার ট্রান্সপোর্ট" },
      },
      transport: {
        price: 300,
        name: { en: "Transport Delivery", bn: "আর্জেন্ট ট্রান্সপোর্ট" },
      },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={`bg-background/5 border border-border rounded-lg p-6 ${className}`}>
      <div className="flex gap-2 items-center ">
      
        <ShoppingBag size={24}/>
        <h2 className="font-heading font-semibold text-xl ">
          {currentLanguage === 'en' ? 'Order Summary' : 'অর্ডার সারসংক্ষেপ'}
        </h2>
      </div>
      
      {/* Cart Items */}

      <ScrollShadow hideScrollBar className="w-full mt-2 h-125">
  
        <div  className="grid grid-cols-1 gap-3">
        {items.map((item,i) => (
           <div key={i} className='flex shadow-sm items-center space-x-4 p-3 bg-primary-50/45 rounded-md'>
             <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <Image
                src={item.image}
                alt={item.productName}
                width={400}
                height={400}
                className="w-16 h-16 object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-body font-medium text-sm  truncate">
                {item.productName}
              </h3>
              
              <div className="flex items-center justify-between mt-1">
                <span className="font-caption text-xs text-muted-foreground">
                  {currentLanguage === 'en' ? 'Qty:' : 'পরিমাণ:'} {item.quantity}
                </span>
                <span className="font-data font-semibold text-sm ">
                  {formatPrice(item.salePrice * item.quantity)}
                </span>
              </div>
            </div>
           </div>
        ))}
        </div>
     
      </ScrollShadow>
    
      
      {/* Price Breakdown */}
      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex justify-between items-center">
          <span className="font-body text-sm text-muted-foreground">
            {currentLanguage === 'en' ? 'Subtotal' : 'উপমোট'}
          </span>
          <span className="font-data font-medium ">
            {formatPrice(subtotal)}
          </span>
        </div>
        
        {
          subtotal >= 5000 ? <div className='flex justify-between items-center'>
            <span>Delivery Charge</span>
            <span className='text-green-700'>Free</span>
          </div> : formData.deliveryOption && (
          <div className="flex justify-between items-center">
            <span className="font-body text-sm text-muted-foreground">
              {deliveryOptions[formData.deliveryOption]?.name[currentLanguage] || 
               (currentLanguage === 'en' ? 'Delivery' : 'ডেলিভারি')}
            </span>
            <span className="font-data font-medium ">
              {formatPrice(deliveryCharge)}
            </span>
          </div>
        )}
        
        
        {giftWrapCharge > 0 && (
          <div className="flex justify-between items-center">
            <span className="font-body text-sm text-muted-foreground">
              {currentLanguage === 'en' ? 'Gift Wrapping' : 'গিফট র‍্যাপিং'}
            </span>
            <span className="font-data font-medium ">
              {formatPrice(giftWrapCharge)}
            </span>
          </div>
        )}
        
        <div className="border-t border-border pt-3">
          <div className="flex justify-between items-center">
            <span className="font-body font-semibold text-lg ">
              {currentLanguage === 'en' ? 'Total' : 'মোট'}
            </span>
            <span className="font-data font-bold text-xl ">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Savings Badge */}
      <div className="mt-4 p-3 bg-green-200/80 border border-success/20 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Tag" size={16} color="var(--color-success)" />
          <span className="font-caption text-sm text-green-700">
            {currentLanguage === 'en' ?'You saved ৳150 on this order!' :'আপনি এই অর্ডারে ৳১৫০ সাশ্রয় করেছেন!'
            }
          </span>
        </div>
      </div>
      
      {/* Estimated Delivery */}
      {formData.deliveryOption && (
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Truck" size={16} color="var(--color-primary)" />
            <div>
              <p className="font-body font-medium text-sm ">
                {currentLanguage === 'en' ? 'Estimated Delivery' : 'আনুমানিক ডেলিভারি'}
              </p>
              <p className="font-caption text-xs text-muted-foreground">
                {formData.deliveryOption === 'standard' && 
                  (currentLanguage === 'en' ? 'December 12-14, 2025' : '১২-১৪ ডিসেম্বর, ২০২৫')
                }
                {formData.deliveryOption === 'express' && 
                  (currentLanguage === 'en' ? 'December 10-11, 2025' : '১০-১১ ডিসেম্বর, ২০২৫')
                }
                {formData.deliveryOption === 'same-day' && 
                  (currentLanguage === 'en' ? 'Today by 8 PM' : 'আজ রাত ৮টার মধ্যে')
                }
                {formData.deliveryOption === 'regular' && 
                  (currentLanguage === 'en' ? 'December 10-11, 2025' : '১০-১১ ডিসেম্বর, ২০২৫')
                }
                {formData.deliveryOption === 'transport' && 
                  (currentLanguage === 'en' ? 'December 10-11, 2025' : '১০-১১ ডিসেম্বর, ২০২৫')
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;