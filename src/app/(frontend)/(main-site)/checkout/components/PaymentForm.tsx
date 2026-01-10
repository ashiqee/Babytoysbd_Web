import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import * as LucideIcons from "lucide-react";

type LucideIconName = keyof typeof LucideIcons;

interface PaymentFormProps {
  currentLanguage: 'en' | 'bn';
  onNext: () => void;
  onBack: () => void;
  formData: {
    paymentMethod: string;
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
    mobileNumber: string;
    trxid: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  currentLanguage,
  onNext,
  onBack,
  formData,
  setFormData
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentMethods: {
    id: string;
    name: string | {en:string,bn:string};
    description: {en:string,bn:string};
    color:string;
    
    icon: LucideIconName;
  }[]  = [
    {
      id: 'bkash',
      name: 'bKash',
      icon: 'Smartphone',
      description: { en: 'Pay with bKash mobile wallet', bn: 'বিকাশ মোবাইল ওয়ালেট দিয়ে পেমেন্ট করুন' },
      color: '#E2136E'
    },
    {
      id: 'nagad',
      name: 'Nagad',
      icon: 'Smartphone',
      description: { en: 'Pay with Nagad mobile wallet', bn: 'নগদ মোবাইল ওয়ালেট দিয়ে পেমেন্ট করুন' },
      color: '#F47920'
    },
    {
      id: 'rocket',
      name: 'Rocket',
      icon: 'Smartphone',
      description: { en: 'Pay with Rocket mobile wallet', bn: 'রকেট মোবাইল ওয়ালেট দিয়ে পেমেন্ট করুন' },
      color: '#8E44AD'
    },
    // {
    //   id: 'card',
    //   name: { en: 'Credit/Debit Card', bn: 'ক্রেডিট/ডেবিট কার্ড' },
    //   icon: 'CreditCard',
    //   description: { en: 'Visa, Mastercard, American Express', bn: 'ভিসা, মাস্টারকার্ড, আমেরিকান এক্সপ্রেস' },
    //   color: '#2D5A87'
    // },
    {
      id: 'cod',
      name: { en: 'Cash on Delivery', bn: 'ক্যাশ অন ডেলিভারি' },
      icon: 'Banknote',
      description: { en: 'Pay when you receive your order', bn: 'অর্ডার পাওয়ার সময় পেমেন্ট করুন' },
      color: '#27AE60'
    }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = currentLanguage === 'en' 
        ? 'Please select a payment method' 
        : 'একটি পেমেন্ট পদ্ধতি নির্বাচন করুন';
    }
    
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber?.trim()) {
        newErrors.cardNumber = currentLanguage === 'en' 
          ? 'Card number is required' 
          : 'কার্ড নম্বর প্রয়োজন';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = currentLanguage === 'en' 
          ? 'Please enter a valid 16-digit card number' 
          : 'একটি বৈধ ১৬ সংখ্যার কার্ড নম্বর দিন';
      }
      
      if (!formData.cardName?.trim()) {
        newErrors.cardName = currentLanguage === 'en' 
          ? 'Cardholder name is required' 
          : 'কার্ডধারীর নাম প্রয়োজন';
      }
      
      if (!formData.expiryDate?.trim()) {
        newErrors.expiryDate = currentLanguage === 'en' 
          ? 'Expiry date is required' 
          : 'মেয়াদ উত্তীর্ণের তারিখ প্রয়োজন';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = currentLanguage === 'en' 
          ? 'Please enter date in MM/YY format' 
          : 'MM/YY ফরম্যাটে তারিখ দিন';
      }
      
      if (!formData.cvv?.trim()) {
        newErrors.cvv = currentLanguage === 'en' ? 'CVV is required' : 'CVV প্রয়োজন';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = currentLanguage === 'en' 
          ? 'CVV must be 3 or 4 digits' 
          : 'CVV ৩ বা ৪ সংখ্যার হতে হবে';
      }
    }
    
    if (['bkash', 'nagad', 'rocket'].includes(formData.paymentMethod)) {
      if (!formData.mobileNumber?.trim()) {
        newErrors.mobileNumber = currentLanguage === 'en' 
          ? 'Mobile number is required' 
          : 'মোবাইল নম্বর প্রয়োজন';
      } else if (!/^01[3-9]\d{8}$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = currentLanguage === 'en' 
          ? 'Please enter a valid mobile number' 
          : 'একটি বৈধ মোবাইল নম্বর দিন';
      }
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className=" bg-background/5 border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-3">
        <Icon name="CreditCard" size={24} color="#ffffff" />
        <h2 className="font-heading font-semibold text-xl ">
          {currentLanguage === 'en' ? 'Payment Information' : 'পেমেন্ট তথ্য'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-body font-medium text-lg ">
            {currentLanguage === 'en' ? 'Select Payment Method' : 'পেমেন্ট পদ্ধতি নির্বাচন করুন'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  formData.paymentMethod === method.id
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleInputChange('paymentMethod', method.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    formData.paymentMethod === method.id
                      ? 'border-primary bg-primary' 
                      : 'border-border'
                  }`}>
                    {formData.paymentMethod === method.id && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${method.color}20` }}>
                    <Icon name={method.icon} size={16} color={method.color} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-body font-medium ">
                      {typeof method.name === 'object' ? method.name[currentLanguage] : method.name}
                    </h4>
                    <p className="font-caption text-xs text-muted-foreground">
                      {method.description[currentLanguage]}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {errors.paymentMethod && (
            <p className="text-error text-sm font-caption">{errors.paymentMethod}</p>
          )}
        </div>
        
        {/* Card Payment Fields */}
        {/* {formData.paymentMethod === 'card' && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-body font-medium ">
              {currentLanguage === 'en' ? 'Card Details' : 'কার্ডের বিবরণ'}
            </h4>
            
            <Input
              label={currentLanguage === 'en' ? 'Card Number' : 'কার্ড নম্বর'}
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber || ''}
              onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
              error={errors.cardNumber}
              maxLength={19}
              required
            />
            
            <Input
              label={currentLanguage === 'en' ? 'Cardholder Name' : 'কার্ডধারীর নাম'}
              type="text"
              placeholder={currentLanguage === 'en' ? 'Name as on card' : 'কার্ডে যেমন নাম আছে'}
              value={formData.cardName || ''}
              onChange={(e) => handleInputChange('cardName', e.target.value)}
              error={errors.cardName}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={currentLanguage === 'en' ? 'Expiry Date' : 'মেয়াদ উত্তীর্ণের তারিখ'}
                type="text"
                placeholder="MM/YY"
                value={formData.expiryDate || ''}
                onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                error={errors.expiryDate}
                maxLength={5}
                required
              />
              
              <Input
                label="CVV"
                type="text"
                placeholder="123"
                value={formData.cvv || ''}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                error={errors.cvv}
                maxLength={4}
                required
              />
            </div>
          </div>
        )} */}
        
        {/* Mobile Wallet Fields */}
        {['bkash', 'nagad', 'rocket'].includes(formData.paymentMethod) && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-body font-medium ">
              {currentLanguage === 'en' ? 'Mobile Wallet Details' : 'মোবাইল ওয়ালেট বিবরণ'}
            </h4>
            
            <Input
              label={currentLanguage === 'en' ? 'Mobile Number' : 'মোবাইল নম্বর'}
              type="tel"
              placeholder="01XXXXXXXXX"
              value={formData.mobileNumber || ''}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              
              required
            />
            {errors.mobileNumber}
            <Input
              label={currentLanguage === 'en' ? 'Transaction Number' : 'ট্রান্সাজেয়াচতিওন নম্বর'}
              type="text"
              placeholder="TXID"
              value={formData.trxid || ''}
              onChange={(e) => handleInputChange('trxid', e.target.value)}
             
              required
            />
             {errors.trxid}
            
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} color="var(--color-warning)" className="mt-0.5" />
                <div>
                  <p className="font-caption text-sm ">
                    {currentLanguage === 'en' 
                      ? `You will receive a payment request on your ${formData.paymentMethod} app to complete the transaction.`
                      : `লেনদেন সম্পূর্ণ করতে আপনি আপনার ${formData.paymentMethod} অ্যাপে একটি পেমেন্ট অনুরোধ পাবেন।`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Cash on Delivery Info */}
        {formData.paymentMethod === 'cod' && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Banknote" size={16} color="var(--color-success)" className="mt-0.5" />
              <div>
                <h4 className="font-body font-medium  mb-1">
                  {currentLanguage === 'en' ? 'Cash on Delivery' : 'ক্যাশ অন ডেলিভারি'}
                </h4>
                <p className="font-caption text-sm text-muted-foreground">
                  {currentLanguage === 'en' 
                    ? 'You can pay in cash when your order is delivered. Please keep the exact amount ready.' 
                    : 'আপনার অর্ডার ডেলিভারি হওয়ার সময় আপনি নগদ অর্থ প্রদান করতে পারেন। দয়া করে সঠিক পরিমাণ অর্থ প্রস্তুত রাখুন।'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="ghost"
            onPress={onBack}
            
          >
            <Icon name="ArrowLeft" size={16} />
            {currentLanguage === 'en' ? 'Back to Shipping' : 'শিপিং-এ ফিরে যান'}
          </Button>
          
          <Button
            type="submit"
            variant="bordered"
           
            className="px-8 hover:bg-yellow-500"
          > <Icon name="ArrowRight" size={16} />
            {currentLanguage === 'en' ? 'Review Order' : 'অর্ডার পর্যালোচনা করুন'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;