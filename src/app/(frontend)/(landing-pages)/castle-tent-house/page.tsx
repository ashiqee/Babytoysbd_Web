"use client";
import React from "react";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Image } from "@heroui/react";
import NavbarLanding from "./_components/shared/Navbar";
import { landingSite } from "./config/landingSite";
import OfferPriceCard from "./_components/OfferPriceCard";
import OrderKorteCai from "./_components/OrderKorteCai";
import OfferBanner from "./_components/OfferBanner";
import OrderForm from "./_components/OrderForm";



const LandingPage = () => {
  return (
    <>
      <div
        className="relative font-bd px-4 md:mx-0 flex flex-col 
          dark:bg-gradient-to-r dark:from-neutral-900 dark:via-gray-800 dark:to-gray-900
          min-h-screen"
      >
        <NavbarLanding />
        <main className="inline-block  mx-auto text-center justify-center">
          <section>
            {/* Heading One */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="xl:text-3xl text-[16px] my-3 md:my-0 font-bold text-center  
                rounded-md shadow-xl hover:shadow-2xl
                bg-gradient-to-tr from-pink-400 to-pink-200"
            >
              <h1
                className="p-4 md:mb-4 bg-gradient-to-l from-sky-400 to-sky-900 bg-clip-text text-transparent
                  hover:scale-105 hover:duration-1000"
              >
                {landingSite.heading.headingOne}
              </h1>
            </motion.div>

            {/* Main Image with Motion Scaling */}
            <motion.div
              className="h-fit card-wrapper mb-10 mx-auto max-w-[870px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                alt="caste tent house"
                className="p-1 rounded-md"
                height={"auto"}
                isZoomed={true}
                shadow={"lg"}
                sizes={"210"}
                src={landingSite?.productDetails?.imageUrl[0]}
                width="100%"
              />
            </motion.div>

            {/* Paragraph One */}
            <p className="md:my-10 my-6 md:text-xl  font-medium max-w-2xl mx-auto">
              {landingSite.paragrap.paragrapOne}
            </p>

            {/* Offer Price Card */}
            <OfferPriceCard />
            {/* Order Korte Cai Button */}
            <OrderKorteCai />
          </section>

          {/* Gallery Section */}
          <section className="my-10 bg-sky-400/5 p-6 rounded-lg">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {landingSite?.productDetails?.imageUrl.map((img, i) => (
                <motion.div
                  key={i}
                  className="h-fit card-wrapper mx-auto max-w-[400px]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    alt="caste tent house"
                    className="p-1 rounded-md"
                    height={"auto"}
                    isZoomed={true}
                    shadow={"lg"}
                    sizes={"200"}
                    src={img}
                    width="100%"
                  />
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Order Korte Cai Button */}
          <OrderKorteCai />

          {/* Why Purchase Section */}
          <section className="my-10">
            <p className="md:text-4xl text-xl mb-10 hover:shadow-sky-400 hover:text-pink-500 font-extrabold text-fill-inherit shadow-md shadow-pink-500 text-clip rounded-full p-2 pt-4 text-sky-400">
              ক্যাসল টেন্ট হাউস কেন নিবেন ?
            </p>
            <ul className="space-y-4 mx-auto max-w-3xl text-justify">
              {landingSite?.whyParchase.map((w, i) => (
                <li
                  key={i}
                  className="md:text-xl text-sm shadow-md p-2 bg-sky-400/5 rounded-md px-10"
                >
                  {i + 1}. {w}
                </li>
              ))}
            </ul>
          </section>

              <section>
                      <OfferBanner/>
                    </section>


          {/* Product Specifications Section */}
          <section className="my-10">
            <p className="md:text-4xl text-xl mb-10 hover:shadow-sky-400 hover:text-pink-500 font-extrabold text-fill-inherit shadow-md shadow-pink-500 text-clip rounded-full p-2 pt-4 text-sky-400">
              পণ্যের বৈশিষ্ট্য
            </p>
            <ul className="space-y-4 mx-auto max-w-3xl text-justify">
              {landingSite?.productSpec.map((w, i) => (
                <li
                  key={i}
                  className="md:text-xl text-sm shadow-md p-2 bg-sky-400/5 rounded-md flex gap-1 items-center px-10"
                >
                  <span className="w-8">
                    <Check size={28} />
                  </span>{" "}
                  {w}
                </li>
              ))}
            </ul>
          </section>
 <section>
                      <OfferBanner/>
                    </section>
      {/* Order Korte Cai Button */}
          <OrderKorteCai />



          {/* Offer Price Card */}
          <OfferPriceCard />

          {/* Order Form Section */}
          <section id="order-form">
            <OrderForm />
          </section>
        </main>
      </div>
    </>
  );
};

export default LandingPage;
