'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const COMPONENTS = {
  General: [
    { type: 'element', label: 'Element' },
    { type: 'link', label: 'Link' },
    { type: 'html', label: 'HTML Embed' },
    { type: 'slot', label: 'Slot' },
    { type: 'headSlot', label: 'Head Slot' },
    { type: 'contentBlock', label: 'Content Block' },
  ],
  Typography: [
    { type: 'heading', label: 'Heading' },
    { type: 'paragraph', label: 'Paragraph' },
    { type: 'blockquote', label: 'Blockquote' },
    { type: 'list', label: 'List' },
    { type: 'listItem', label: 'List Item' },
    { type: 'codeText', label: 'Code Text' },
    { type: 'hr', label: 'Thematic Break' },
  ],
  Media: [
    { type: 'image', label: 'Image' },
    { type: 'vimeo', label: 'Vimeo' },
    { type: 'youtube', label: 'YouTube' },
  ],
  Animations: [
    { type: 'animationGroup', label: 'Animation Group' },
    { type: 'textAnimation', label: 'Text Animation' },
    { type: 'videoAnimation', label: 'Video Animation' },
    { type: 'staggerAnimation', label: 'Stagger Animation' },
  ],
  Forms: [
    { type: 'form', label: 'Form' },
    { type: 'button', label: 'Button' },
    { type: 'inputLabel', label: 'Input Label' },
    { type: 'textInput', label: 'Text Input' },
    { type: 'textArea', label: 'Text Area' },
    { type: 'select', label: 'Select' },
    { type: 'radio', label: 'Radio' },
    { type: 'checkbox', label: 'Checkbox' },
  ],
  Localization: [
    { type: 'time', label: 'Time' },
  ],
  Radix: [
    { type: 'sheet', label: 'Sheet' },
    { type: 'navigationMenu', label: 'Navigation Menu' },
    { type: 'tabs', label: 'Tabs' },
    { type: 'accordion', label: 'Accordion' },
    { type: 'dialog', label: 'Dialog' },
    { type: 'collapsible', label: 'Collapsible' },
    { type: 'popover', label: 'Popover' },
    { type: 'tooltip', label: 'Tooltip' },
    { type: 'switch', label: 'Switch' },
    { type: 'radioGroup', label: 'Radio Group' },
    { type: 'checkboxRadix', label: 'Checkbox (Radix)' },
  ],
};

export default function Rightbar({ onAdd }: { onAdd: (type: string) => void }) {
  const [search, setSearch] = useState('');
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (category: string) => {
    setOpenSections((prev) =>
      prev.includes(category)
        ? prev.filter((s) => s !== category)
        : [...prev, category]
    );
  };

  const filterItems = (items: { type: string; label: string }[]) =>
    items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <aside className="w-[280px] bg-white shadow-xl border-l fixed right-0 top-0 h-screen z-50 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Components</h2>
        <input
          type="text"
          placeholder="Find components"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-1.5 border rounded text-sm"
        />
      </div>

      <div className="overflow-y-auto flex-1 px-4 py-2 space-y-4">
        {Object.entries(COMPONENTS).map(([category, items]) => {
          const filtered = filterItems(items);
          if (filtered.length === 0) return null;

          const isOpen = openSections.includes(category);

          return (
            <div key={category}>
              <button
                onClick={() => toggleSection(category)}
                className="flex items-center justify-between w-full text-sm font-medium text-gray-600 hover:text-black"
              >
                <span>{category}</span>
                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
              {isOpen && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {filtered.map((comp) => (
                    <button
                      key={comp.type}
                      onClick={() => onAdd(comp.type)}
                      className="border rounded text-xs text-center p-2 hover:bg-gray-100"
                    >
                      {comp.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
