import { StarIcon } from 'lucide-react';
import React from 'react';

const LNTextArea = ({ register, placeholder, error,label }:{register:any, placeholder:any, error:any,label:any}) => {
    return (
        <div className="mb-4">
                  <label className=" text-sm flex gap-1 font-bold " htmlFor='address'>{label} <StarIcon className='fill-red-600' color='red' size={10}/></label>
        <textarea
          {...register}
          placeholder={placeholder}
          className={[
            "w-full",
            "rounded-md",
            'border',
            "bg-transparent",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            "shadow-xl",
            "bg-default-200/50 dark:bg-default/60",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "hover:bg-default-200/70 dark:hover:bg-default/70",
            "focus:bg-default-200/50 dark:focus:bg-default/60",
            "resize-none", // Prevents resizing the textarea
            "p-2",
            "transition-colors",
          ].join(" ")}
          rows={4} // Specify the number of rows for the textarea
        />
        {error && <p className="text-red-500 text-sm">{error.message}</p>}

    
      </div>
    );
};

export default LNTextArea;