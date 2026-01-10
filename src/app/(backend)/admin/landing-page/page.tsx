// app/admin/landing-page/page.tsx
"use client";

import { Button } from "@headlessui/react";
import { useState } from "react";
import CreateLandingPageModal from "../../_components/pageBuilder/CreateLandingPageModal";


export default function LandingPageDashboard() {
  const [pages, setPages] = useState([
    { id: "1", name: "Homepage", createdAt: new Date().toDateString() },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Landing Pages</h1>
        <Button onClick={() => alert("Open create modal")}>Create New</Button>
        <CreateLandingPageModal/>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {pages.map((page) => (
          <div key={page.id} className="bg-white p-4 rounded-md shadow hover:shadow-lg">
            <h2 className="text-lg font-bold">{page.name}</h2>
            <p className="text-sm text-gray-500">Created: {page.createdAt}</p>
            <a
              href={`/admin/landing-page/${page.id}`}
              className="text-blue-600 mt-2 inline-block"
            >
              Edit Page →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
