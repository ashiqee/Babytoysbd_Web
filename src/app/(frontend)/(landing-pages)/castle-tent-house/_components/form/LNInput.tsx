import { StarIcon } from 'lucide-react';
import React from 'react';

const LNInput = ({ register, label, placeholder, error,type }:{register:any, label:any, placeholder:any, error:any,type:any}) => {
    return (
        <div className="mb-4">
      <label className="text-sm flex gap-1 font-bold" htmlFor='name'>{label} <StarIcon className='fill-red-600' color='red' size={10}/></label>
      <div className="relative">
        <input
          type={type}
          {...register}
          className={[
            "bg-transparent",
            'border',
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            "shadow-xl",
            "bg-default-200/50 dark:bg-default/60",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "hover:bg-default-200/70 dark:hover:bg-default/70",
            "focus:bg-default-200/50 dark:focus:bg-default/60",
            "!cursor-text",
            "w-full",
            "p-2",
            "rounded",
            "transition-colors",
          ].join(" ")}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
    );
};

export default LNInput;