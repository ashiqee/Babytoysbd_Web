import React from "react";
import Icon from "@/components/AppIcon";
import * as LucideIcons from "lucide-react";

type LucideIconName = keyof typeof LucideIcons;

interface CheckoutProgressProps {
  currentStep: number;
  currentLanguage: "en" | "bn";
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({
  currentStep,
  currentLanguage,
}) => {
  const steps: {
    id: number;
    title: { en: string; bn: string };
    icon: LucideIconName;
  }[] = [
    {
      id: 1,
      title: { en: "Shipping", bn: "শিপিং" },
      icon: "MapPin",
    },
    {
      id: 2,
      title: { en: "Payment", bn: "পেমেন্ট" },
      icon: "CreditCard",
    },
    {
      id: 3,
      title: { en: "Review", bn: "পর্যালোচনা" },
      icon: "CheckCircle",
    },
  ];

  return (
    <div className=" bg-background/5 border border-border rounded-lg p-6 mb-3">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  currentStep >= step.id
                    ? "bg-yellow-500 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? (
                  <Icon name="Check" size={20} />
                ) : (
                  <Icon name={step.icon} size={20} />
                )}
              </div>
              <div className="hidden sm:block">
                <p
                  className={`font-body font-medium text-sm ${
                    currentStep >= step.id
                      ? "dark:text-yellow-100 text-orange-950"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title[currentLanguage]}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.id ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgress;
