import React from 'react';
import Icon from '@/components/AppIcon';
import * as LucideIcons from "lucide-react";

type LucideIconName = keyof typeof LucideIcons;

interface TrustBadgesProps {
  currentLanguage: 'en' | 'bn';
  className?: string;
}

const TrustBadges: React.FC<TrustBadgesProps> = ({ currentLanguage, className = '' }) => {
  const trustBadges:{
    description: { en: string; bn: string };
    title: { en: string; bn: string };
    icon: LucideIconName;
  }[]= [
    {
      icon: 'Shield',
      title: { en: 'SSL Secured', bn: 'SSL সুরক্ষিত' },
      description: { en: '256-bit encryption', bn: '২৫৬-বিট এনক্রিপশন' }
    },
    {
      icon: 'Award',
      title: { en: 'Trusted Store', bn: 'বিশ্বস্ত দোকান' },
      description: { en: '10,000+ happy customers', bn: '১০,০০০+ সন্তুষ্ট গ্রাহক' }
    },
    {
      icon: 'RotateCcw',
      title: { en: '7-Day Returns', bn: '৭ দিন রিটার্ন' },
      description: { en: 'Easy return policy', bn: 'সহজ রিটার্ন নীতি' }
    },
    {
      icon: 'Phone',
      title: { en: '24/7 Support', bn: '২৪/৭ সাপোর্ট' },
      description: { en: 'Always here to help', bn: 'সর্বদা সাহায্যের জন্য' }
    }
  ];

  return (
    <div className={` border border-border rounded-lg p-4 ${className}`}>
      <h3 className="font-body font-medium  mb-4 text-center">
        {currentLanguage === 'en' ? 'Shop with Confidence' : 'আত্মবিশ্বাসের সাথে কিনুন'}
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {trustBadges.map((badge, index) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name={badge.icon} size={20} color="#27AE60" />
            </div>
            <h4 className="font-body font-medium text-xs  mb-1">
              {badge.title[currentLanguage]}
            </h4>
            <p className="font-caption text-xs text-muted-foreground">
              {badge.description[currentLanguage]}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="CreditCard" size={12} />
            <span className="font-caption">Visa</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="CreditCard" size={12} />
            <span className="font-caption">Mastercard</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Smartphone" size={12} />
            <span className="font-caption">bKash</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Smartphone" size={12} />
            <span className="font-caption">Nagad</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;