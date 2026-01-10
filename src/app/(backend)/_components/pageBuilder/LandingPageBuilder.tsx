"use client";

import { useState } from "react";
import Rightbar from "./Rightbar";

// Component type
export type ComponentData = {
  id: string;
  type: string;
  text?: string;
  html?: string;
  src?: string;
  items?: string[];
};

function ComponentRendererEditable({
  component,
  onChange,
}: {
  component: ComponentData;
  onChange: (updated: ComponentData) => void;
}) {
  const { type } = component;
  const updateField = (field: keyof ComponentData, value: any) => {
    onChange({ ...component, [field]: value });
  };

  switch (type) {
    case "element":
    case "slot":
    case "headSlot":
    case "contentBlock":
      return (
        <textarea
          className="border p-2 w-full rounded"
          value={component.text ?? ""}
          onChange={(e) => updateField("text", e.target.value)}
          rows={3}
        />
      );
    case "link":
      return (
        <div>
          <input
            type="text"
            placeholder="Link text"
            className="border p-1 rounded w-full mb-1"
            value={component.text ?? "Link"}
            onChange={(e) => updateField("text", e.target.value)}
          />
          <input
            type="url"
            placeholder="URL"
            className="border p-1 rounded w-full"
            value={component.src ?? "#"}
            onChange={(e) => updateField("src", e.target.value)}
          />
          <a
            href={component.src ?? "#"}
            className="text-blue-600 underline block mt-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            {component.text ?? "Link"}
          </a>
        </div>
      );
    case "html":
      return (
        <textarea
          className="border p-2 w-full rounded font-mono"
          value={component.html ?? "<b>HTML Embed</b>"}
          onChange={(e) => updateField("html", e.target.value)}
          rows={4}
        />
      );
    case "heading":
      return (
        <input
          className="border-b border-gray-400 text-3xl font-bold w-full"
          type="text"
          value={component.text ?? "Heading"}
          onChange={(e) => updateField("text", e.target.value)}
        />
      );
    case "paragraph":
      return (
        <textarea
          className="border p-2 w-full rounded"
          value={component.text ?? "This is a paragraph of text."}
          onChange={(e) => updateField("text", e.target.value)}
          rows={4}
        />
      );
    case "blockquote":
      return (
        <textarea
          className="border-l-4 border-gray-600 italic p-2 w-full rounded"
          value={component.text ?? "\u201cA quote goes here.\u201d"}
          onChange={(e) => updateField("text", e.target.value)}
          rows={3}
        />
      );
    case "list":
      return (
        <div>
          <textarea
            className="border p-2 w-full rounded mb-2"
            value={(component.items ?? []).join("\n")}
            onChange={(e) =>
              updateField("items", e.target.value.split("\n").filter(Boolean))
            }
            rows={4}
          />
          <ul className="list-disc pl-6">
            {(component.items ?? []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      );
    case "listItem":
      return (
        <input
          className="border p-1 w-full rounded"
          type="text"
          value={component.text ?? "List Item"}
          onChange={(e) => updateField("text", e.target.value)}
        />
      );
    case "codeText":
      return (
        <textarea
          className="bg-gray-100 border p-2 font-mono w-full rounded"
          value={component.text ?? "const x = 10;"}
          onChange={(e) => updateField("text", e.target.value)}
          rows={3}
        />
      );
    case "hr":
      return <hr className="my-4" />;
    case "image":
      return (
        <div>
          <input
            type="url"
            className="border p-1 rounded w-full mb-2"
            value={component.src ?? "https://via.placeholder.com/150"}
            onChange={(e) => updateField("src", e.target.value)}
            placeholder="Image URL"
          />
          <img
            src={component.src ?? "https://via.placeholder.com/150"}
            alt="Editable"
            className="rounded"
          />
        </div>
      );
    case "youtube":
    case "vimeo":
      return (
        <textarea
          className="border p-2 w-full rounded font-mono"
          value={component.src ?? ""}
          onChange={(e) => updateField("src", e.target.value)}
          rows={2}
        />
      );
    case "animationGroup":
      return <div className="animate-pulse bg-blue-100 p-4 rounded">Animation Group</div>;
    case "textAnimation":
      return <div className="animate-bounce text-red-500 font-semibold">Bouncing Text</div>;
    case "videoAnimation":
      return <div className="animate-spin border-2 p-4 border-dashed border-black rounded">Video Animation</div>;
    case "staggerAnimation":
      return (
        <div className="space-y-2">
          <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"/>
          <div className="animate-pulse bg-gray-200 h-4 w-2/4 rounded"/>
        </div>
      );
    default:
      return <div>Unknown component: {type}</div>;
  }
}

export default function PageBuilderPreview() {
  const [components, setComponents] = useState<ComponentData[]>([]);

  const handleAdd = (type: string) => {
    const id = crypto.randomUUID();
    let initialData: Partial<ComponentData> = {};

    switch (type) {
      case "heading":
      case "paragraph":
      case "blockquote":
      case "listItem":
      case "codeText":
      case "element":
      case "slot":
      case "headSlot":
      case "contentBlock":
        initialData = { text: "" };
        break;
      case "link":
        initialData = { text: "Link", src: "#" };
        break;
      case "html":
        initialData = { html: "<b>HTML Embed</b>" };
        break;
      case "list":
        initialData = { items: ["Item 1", "Item 2"] };
        break;
      case "image":
        initialData = { src: "https://via.placeholder.com/150" };
        break;
      case "vimeo":
        initialData = { src: "https://player.vimeo.com/video/76979871" };
        break;
      case "youtube":
        initialData = { src: "https://www.youtube.com/embed/dQw4w9WgXcQ" };
        break;
      default:
        initialData = { text: "" };
    }

    setComponents((prev) => [...prev, { id, type, ...initialData }]);
  };

  const updateComponent = (id: string, updated: Partial<ComponentData>) => {
    setComponents((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, ...updated } : comp))
    );
  };

  return (
    <>
      <Rightbar onAdd={handleAdd} />
      <main className="ml-[280px] p-6 space-y-6 min-h-screen bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">Page Builder Preview</h1>
        {components.length === 0 && (
          <p className="text-gray-500">Add components from the right sidebar.</p>
        )}
        <div className="space-y-6">
          {components.map((component) => (
            <ComponentRendererEditable
              key={component.id}
              component={component}
              onChange={(updated) => updateComponent(component.id, updated)}
            />
          ))}
        </div>
      </main>
    </>
  );
}
