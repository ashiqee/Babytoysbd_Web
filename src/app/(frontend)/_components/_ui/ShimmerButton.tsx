import React from 'react';

interface ShimmerButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children,
  className = '',
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`
        relative flex items-center justify-center px-4 py-2 rounded-full
        text-white font-medium shadow-md hover:shadow-lg
        bg-gradient-to-r from-emerald-500 to-teal-600 
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:from-emerald-600 hover:to-teal-700 transform hover:scale-100 active:scale-95 transition-all duration-300'
        }
        overflow-hidden group
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Shimmer effect */}
      {!disabled && (
        <span className="absolute top-0 left-0 w-full h-full bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      )}
      {children}
    </button>
  );
};

export default ShimmerButton;