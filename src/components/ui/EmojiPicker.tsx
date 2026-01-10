import { commonEmojis } from '@/utils/emojis';
import { ScrollShadow } from '@heroui/react';
import { useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface EmojiPickerProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>; // ✅ we'll use this for default value
}

const EmojiPicker = ({ register, errors, setValue, watch }: EmojiPickerProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const emojiValue = watch("emoji") || ""; // ✅ always reflect form state

  console.log(emojiValue,"EMOJI");
  
  const handleEmojiSelect = (emoji: string) => {
    setValue("emoji", emoji, { shouldValidate: true });
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Emoji
      </label>

      <div className="flex items-center space-x-2">
        <input
          {...register("emoji")}
          value={emojiValue}
          onChange={(e) => setValue("emoji", e.target.value, { shouldValidate: true })}
          placeholder="Select or paste emoji"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="px-3 py-3 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
        >
          😊
        </button>
      </div>

      {showPicker && (
        <div className="absolute z-10 -top-[22rem] mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-3">
          <ScrollShadow className="flex flex-wrap gap-1 h-72 overflow-y-auto" hideScrollBar={false} size={10}>
            {commonEmojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleEmojiSelect(emoji)}
                className="text-2xl w-fit p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                {emoji}
              </button>
            ))}
          </ScrollShadow>

          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Or paste any emoji in the input field above
            </p>
          </div>
        </div>
      )}

      {errors.emoji && (
        <p className="mt-1 text-sm text-red-500">{errors.emoji.message as string}</p>
      )}
    </div>
  );
};

export default EmojiPicker;
