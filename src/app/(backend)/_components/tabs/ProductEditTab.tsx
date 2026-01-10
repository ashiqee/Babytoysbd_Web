"use client";

import { Tabs, Tab } from "@heroui/react";
import { useState } from "react";
// Your full general product form

import ProductEditForm from "../forms/ProductEditForm";
import ProductSeoForm from "../forms/ProductSeoForm";
// A separate SEO form

export default function ProductEditTabs({
  defaultValues,
  onSubmitHandler,
  onCancel,
}: {
  defaultValues: any;
  onSubmitHandler: any;
  onCancel: any;
}) {
  const [selectedTab, setSelectedTab] = useState("general");

  return (
    <div className=" ">
    

      <Tabs
        aria-label="Edit Product Tabs"
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(String(key))}
        variant="bordered"
        color="primary"
        className="w-full"
      >
        <Tab
          key="general"
          title={
            <div className="flex items-center space-x-2">
              <span>📝</span>
              <span>General Info</span>
            </div>
          }
        >
          <div className="mt-4">
            <ProductEditForm onSubmitHandler={onSubmitHandler} defaultValues={defaultValues} />
          </div>
        </Tab>

        <Tab
          key="seo"
          title={
            <div className="flex items-center space-x-2">
              <span>🔍</span>
              <span>SEO Metadata</span>
            </div>
          }
        >
          <div className="mt-4">
            <ProductSeoForm defaultValues={defaultValues} onSubmitHandler={onSubmitHandler} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
