// 'use client';

// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { GripVertical, Trash2 } from 'lucide-react';
// import { useState } from 'react';

// import { Image } from '@heroui/react';

// export default function SortableSection({
//   section,
//   isPreview,
//   onUpdate,
//   onDelete,
//   onLayoutChange,
// }: {
//   section: any;
//   isPreview?: boolean;
//   onUpdate: (data: Partial<{ content: string; src?: string }>) => void;
//   onDelete: () => void;
//   onLayoutChange: (layout: string) => void;
// }) {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
//     id: section.id,
//   });

//   const [localContent, setLocalContent] = useState(section.content);
//   const [mediaUrl, setMediaUrl] = useState(section.src || '');
//   const [imageSize, setImageSize] = useState({ width: '100%', height: 'auto' });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   const renderDynamicContent = () => {
//     switch (section.type) {
//       case 'image':
//         return isPreview ? (
//           <Image
//           alt='section'
//             src={section.src}
//             style={{ width: imageSize.width, height: imageSize.height }}
//             className="rounded"
//           />
//         ) : (
//           <div>
//             <input
//               type="text"
//               value={mediaUrl}
//               onChange={(e) => {
//                 setMediaUrl(e.target.value);
//                 onUpdate({ src: e.target.value });
//               }}
//               placeholder="Paste image URL"
//               className="mb-2 border p-2 w-full rounded"
//             />
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={imageSize.width}
//                 onChange={(e) => {
//                   const newSize = { ...imageSize, width: e.target.value };
//                   setImageSize(newSize);
//                 }}
//                 placeholder="Width (e.g. 100%)"
//                 className="border p-1 text-sm w-full"
//               />
//               <input
//                 type="text"
//                 value={imageSize.height}
//                 onChange={(e) => {
//                   const newSize = { ...imageSize, height: e.target.value };
//                   setImageSize(newSize);
//                 }}
//                 placeholder="Height (e.g. auto)"
//                 className="border p-1 text-sm w-full"
//               />
//             </div>
//             <Image
//               src={mediaUrl}
//               alt="Section Image"
//               style={{ width: imageSize.width, height: imageSize.height }}
//               className="mt-2 rounded"
//             />
//           </div>
//         );
//       case 'youtube':
//         return isPreview ? (
//           <iframe
//           title='sectionyoutube'
//             src={section.src}
//             width="100%"
//             height="315"
//             allowFullScreen
//             className="rounded"
//           />
//         ) : (
//           <input
//             type="text"
//             value={mediaUrl}
//             onChange={(e) => {
//               setMediaUrl(e.target.value);
//               onUpdate({ src: e.target.value });
//             }}
//             placeholder="YouTube Embed URL"
//             className="border p-2 w-full"
//           />
//         );
//       case 'heading':
//         return isPreview ? (
//           <h2 className="text-2xl font-bold">{section.content}</h2>
//         ) : (
//           <RichEditor
//             content={localContent}
//             onChange={(html) => {
//               setLocalContent(html);
//               onUpdate({ content: html });
//             }}
//           />
//         );
//       case 'paragraph':
//       case 'blockquote':
//       case 'list':
//       case 'listItem':
//       case 'codeText':
//       case 'hr':
//       case 'element':
//       case 'link':
//       case 'html':
//       case 'slot':
//       case 'headSlot':
//       case 'contentBlock':
//       case 'vimeo':
//       case 'animationGroup':
//       case 'textAnimation':
//       case 'videoAnimation':
//       case 'staggerAnimation':
//         return isPreview ? (
//           <div dangerouslySetInnerHTML={{ __html: section.content }} />
//         ) : (
//           <RichEditor
//             content={localContent}
//             onChange={(html) => {
//               setLocalContent(html);
//               onUpdate({ content: html });
//             }}
//           />
//         );
//       default:
//         return (
//           <RichEditor
//             content={localContent}
//             onChange={(html) => {
//               setLocalContent(html);
//               onUpdate({ content: html });
//             }}
//           />
//         );
//     }
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className="bg-white p-4 rounded-lg shadow border relative group"
//     >
//       {/* Drag Handle & Delete */}
//       {!isPreview && (
//         <div className="absolute top-2 right-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition">
//           <button
//             {...attributes}
//             {...listeners}
//             className="cursor-grab text-gray-400 hover:text-gray-600"
//             title="Drag to reorder"
//           >
//             <GripVertical size={18} />
//           </button>
//           <button
//             onClick={onDelete}
//             className="text-red-500 hover:text-red-700"
//             title="Delete section"
//           >
//             <Trash2 size={18} />
//           </button>
//         </div>
//       )}

//       {/* Layout Control */}
//       {!isPreview && (
//         <div className="mb-2">
//           <label htmlFor='block' className="text-sm font-medium">Layout:</label>
//           <select
//             value={section.layout}
//             onChange={(e) => onLayoutChange(e.target.value)}
//             className="ml-2 text-sm border rounded px-2 py-1"
//           >
//             <option value="col-span-6">1 Block</option>
//             <option value="col-span-3">2 Blocks</option>
//             <option value="col-span-2">3 Blocks</option>
//             <option value="col-span-1">6 Blocks</option>
//           </select>
//         </div>
//       )}

//       {/* Render Content Based on Type */}
//       {renderDynamicContent()}
//     </div>
//   );
// }
