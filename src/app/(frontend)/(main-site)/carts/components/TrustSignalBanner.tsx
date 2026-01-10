import Icon from '@/components/AppIcon';
import React, { useState, useEffect } from 'react';

// Define proper TypeScript interfaces
interface LanguageText {
  en: string;
  bn: string;
}

interface TrustSignal {
  icon: string;
  title: LanguageText;
  description: LanguageText;
}

interface TrustSignals {
  general: TrustSignal[];
  checkout: TrustSignal[];
  cart: TrustSignal[];
}

const TrustSignalBanner = ({ context = 'general', className = '' }: { context?: keyof TrustSignals; className?: string }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);

    // Listen for language changes
    const handleLanguageChange = (event:any) => {
      setCurrentLanguage(event?.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const trustSignals = {
    general: [
      {
        icon: 'Shield',
        title: { en: 'Safety Certified', bn: 'নিরাপত্তা প্রত্যয়িত' },
        description: { en: 'All toys meet international safety standards', bn: 'সকল খেলনা আন্তর্জাতিক নিরাপত্তা মান পূরণ করে' }
      },
      {
        icon: 'Truck',
        title: { en: 'Free Delivery', bn: 'বিনামূল্যে ডেলিভারি' },
        description: { en: 'On orders over ৳500 in Dhaka', bn: 'ঢাকায় ৳৫০০+ অর্ডারে' }
      },
      {
        icon: 'RotateCcw',
        title: { en: '7-Day Returns', bn: '৭ দিন রিটার্ন' },
        description: { en: 'Easy returns & exchanges', bn: 'সহজ রিটার্ন ও এক্সচেঞ্জ' }
      }
    ],
    checkout: [
      {
        icon: 'Lock',
        title: { en: 'Secure Payment', bn: 'নিরাপদ পেমেন্ট' },
        description: { en: 'SSL encrypted transactions', bn: 'SSL এনক্রিপ্টেড লেনদেন' }
      },
      {
        icon: 'CreditCard',
        title: { en: 'Multiple Payment Options', bn: 'একাধিক পেমেন্ট অপশন' },
        description: { en: 'bKash, Nagad, Cards & Cash on Delivery', bn: 'বিকাশ, নগদ, কার্ড ও ক্যাশ অন ডেলিভারি' }
      },
      {
        icon: 'Phone',
        title: { en: '24/7 Support', bn: '২৪/৭ সাপোর্ট' },
        description: { en: 'Customer service always available', bn: 'গ্রাহক সেবা সর্বদা উপলব্ধ' }
      }
    ],
    cart: [
      {
        icon: 'Package',
        title: { en: 'Quality Guaranteed', bn: 'মানের নিশ্চয়তা' },
        description: { en: 'Authentic products only', bn: 'শুধুমাত্র খাঁটি পণ্য' }
      },
      {
        icon: 'Clock',
        title: { en: 'Fast Processing', bn: 'দ্রুত প্রক্রিয়াকরণ' },
        description: { en: 'Orders processed within 24 hours', bn: '২৪ ঘন্টার মধ্যে অর্ডার প্রক্রিয়া' }
      }
    ]
  };

  const currentSignals = trustSignals?.[context] || trustSignals?.general;

  if (!isVisible) return null;

  return (
    <div className={`bg-muted/30 border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-medium text-sm ">
          {currentLanguage === 'en' ? 'Why Shop With Us?' : 'কেন আমাদের সাথে কিনবেন?'}
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover: transition-colors duration-200"
        >
          <Icon name="X" size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentSignals?.map((signal:any,index:number)  => (
          <div
            key={index}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-background transition-colors duration-200"
          >
            <div className="shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={signal?.icon} size={16} color="var(--color-primary)" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-body font-medium text-sm  mb-1">
                {signal?.title?.[currentLanguage]}
              </h4>
              <p className="font-caption text-xs text-muted-foreground leading-relaxed">
                {signal?.description?.[currentLanguage]}
              </p>
            </div>
          </div>
        ))}
      </div>
      {context === 'checkout' && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={12} />
              <span className="font-caption">
                {currentLanguage === 'en' ? 'SSL Secured' : 'SSL সুরক্ষিত'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Award" size={12} />
              <span className="font-caption">
                {currentLanguage === 'en' ? 'Trusted by 10,000+ parents' : '১০,০০০+ অভিভাবকের বিশ্বস্ত'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustSignalBanner;