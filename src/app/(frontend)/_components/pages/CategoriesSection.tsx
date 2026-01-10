'use client'
import { slugify } from '@/utils/utils';
import { ScrollShadow } from '@heroui/react';
// components/EnhancedCategories.tsx
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  image: string;
  link: string;
  icon?: string;
  color?: string;
  itemCount?: number;
}

const EnhancedCategories = () => {
  const categories: Category[] = [
    { 
      id: 1, 
      name: "Baby Toys", 
      image: "https://ubuykw.s3.amazonaws.com/category-pages/banner-174020191448.jpg", 
      link: "Baby Toys",
      icon: "👶",
      color: "from-pink-500 to-pink-300",
      itemCount: 24
    },
    { 
      id: 2, 
      name: "Educational", 
      image: "https://cdn.cdnparenting.com/articles/2018/10/31230001/Toys-For-7-Month-Old-Babies-768x525.webp", 
      link: "educational",
      icon: "🧠",
      color: "from-blue-500 to-blue-300",
      itemCount: 42
    },
    { 
      id: 3, 
      name: "Outdoor", 
      image: "https://toybook.com/wp-content/uploads/sites/4/2025/03/LITTLETIKES_BlueyCollection.jpg", 
      link: "Pretend Play",
      icon: "🌳",
      color: "from-green-500 to-green-300",
      itemCount: 18
    },
    { 
      id: 4, 
      name: "Puzzles", 
      image: "https://i.ebayimg.com/images/g/9lAAAOSw0zdnhpjK/s-l400.jpg", 
      link: "Games & Puzzles",
      icon: "🧩",
      color: "from-purple-500 to-purple-300",
      itemCount: 36
    },
    { 
      id: 5, 
      name: "RC Cars", 
      image: "https://media.istockphoto.com/id/1415945402/photo/baby-girl-playing-speed-racing-rc-car-off-road-buggy-vehicle-toy-radio-controller-remotely.jpg?s=612x612&w=0&k=20&c=XiMTqZUDlW56F47rwZ0sFf7j8N4u-iJhVh3O8d8zU08=", 
      link: "rc-cars",
      icon: "🚗",
      color: "from-red-500 to-red-300",
      itemCount: 15
    },
    { 
      id: 6, 
      name: "Dolls", 
      image: "https://bytescanner.com/png/barbiebcc0.png?w=1200", 
      link: "dolls",
      icon: "🎎",
      color: "from-yellow-500 to-yellow-300",
      itemCount: 28
    },
    { 
      id: 7, 
      name: "Building Blocks", 
      image: "https://static.vecteezy.com/system/resources/previews/033/502/271/non_2x/cute-little-boys-playing-with-colorful-building-blocks-at-home-ai-generated-free-photo.jpeg", 
      link: "blocks",
      icon: "🏗️",
      color: "from-indigo-500 to-indigo-300",
      itemCount: 32
    },
    { 
      id: 8, 
      name: "Musical Toys", 
      image: "https://cdn.pixabay.com/photo/2023/12/13/10/48/ai-generated-8446728_1280.png", 
      link: "musical",
      icon: "🎵",
      color: "from-teal-500 to-teal-300",
      itemCount: 21
    }
  ];

  return (
    <section className="md:py-8 py-4 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <motion.h2 
            className="md:text-3xl text-xl uppercase font-bold text-gray-800 dark:text-yellow-50 mb-2"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Shop by Category
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-sm dark:text-yellow-100 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Find the perfect toys for every age and interest
          </motion.p>
        </div>
       <ScrollShadow
  hideScrollBar
  orientation="horizontal"
  className="md:hidden w-full"
>
  <div className="flex flex-row gap-4 px-2 pb-2">
    {categories.slice(0, 8).map((category, index) => (
      <motion.div
        key={category.id}
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        viewport={{ once: true }}
        className="shrink-0"
      >
        <Link href={`/products?category=${slugify(category.link)}`}>
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-black/5 border border-white/5 hover:bg-black/25
              rounded-md overflow-hidden shadow-md cursor-pointer
              w-[240px] h-[120px] flex"
          >
            {/* Image */}
            <div className="relative w-[90px] h-full shrink-0">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute top-1 right-1 bg-gradient-to-l ${category.color}
                text-white px-2 py-[2px] text-[10px] rounded`}
              >
                {category.itemCount}
              </div>
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col justify-between flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{category.icon}</span>
                <h3 className="font-semibold text-sm text-gray-800 dark:text-yellow-50 line-clamp-2">
                  {category.name}
                </h3>
              </div>

              <span className="text-xs text-gray-600 dark:text-yellow-100 font-medium">
                Shop Now →
              </span>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    ))}
  </div>
</ScrollShadow>

        {/* Desktop grid */}
<div className="hidden md:grid grid-cols-4 gap-6">
          {categories.slice(0, 8).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/products?category=${slugify(category.link)}`}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-black/5  border border-white/5 hover:bg-black/25 rounded-md overflow-hidden shadow-lg cursor-pointer h-full flex flex-col transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className={`absolute top-0 right-0 bg-gradient-to-l ${category.color} text-white px-3 py-1 rounded-bl-lg text-sm font-semibold`}>
                      {category.itemCount} items
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{category.icon}</span>
                      <h3 className="font-bold text-gray-800 dark:text-yellow-50 text-lg">{category.name}</h3>
                    </div>
                    <div className="mt-auto pt-2">
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="dark:text-yellow-100 text-gray-700 font-medium flex items-center"
                      >
                        Shop Now
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Link href="/categories">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 md:py-3 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
            >
              View All Categories
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedCategories;