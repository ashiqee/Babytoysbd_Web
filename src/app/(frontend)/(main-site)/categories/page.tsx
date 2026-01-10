"use client"
import { slugify } from '@/utils/utils';
// pages/categories.tsx
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  itemCount: number;
}

const CategoriesPage = () => {
  const categories: Category[] = [
    { 
      id: 1, 
      name: "Baby Toys", 
      image: "https://ubuykw.s3.amazonaws.com/category-pages/banner-174020191448.jpg", 
      slug: "baby",
      icon: "👶",
      color: "from-pink-500 to-pink-300",
      description: "Soft, safe toys for newborns and infants",
      itemCount: 24
    },
    { 
      id: 2, 
      name: "Educational", 
      image: "https://cdn.cdnparenting.com/articles/2018/10/31230001/Toys-For-7-Month-Old-Babies-768x525.webp", 
      slug: "educational",
      icon: "🧠",
      color: "from-blue-500 to-blue-300",
      description: "Toys that make learning fun and engaging",
      itemCount: 42
    },
    { 
      id: 3, 
      name: "Outdoor", 
      image: "https://toybook.com/wp-content/uploads/sites/4/2025/03/LITTLETIKES_BlueyCollection.jpg", 
      slug: "outdoor",
      icon: "🌳",
      color: "from-green-500 to-green-300",
      description: "Toys for active play and outdoor adventures",
      itemCount: 18
    },
    { 
      id: 4, 
      name: "Games & Puzzles", 
      image: "https://i.ebayimg.com/images/g/9lAAAOSw0zdnhpjK/s-l400.jpg", 
      slug: "puzzles",
      icon: "🧩",
      color: "from-purple-500 to-purple-300",
      description: "Challenging puzzles for all skill levels",
      itemCount: 36
    },
    { 
      id: 5, 
      name: "RC Cars", 
      image: "https://media.istockphoto.com/id/1415945402/photo/baby-girl-playing-speed-racing-rc-car-off-road-buggy-vehicle-toy-radio-controller-remotely.jpg?s=612x612&w=0&k=20&c=XiMTqZUDlW56F47rwZ0sFf7j8N4u-iJhVh3O8d8zU08=", 
      slug: "rc-cars",
      icon: "🚗",
      color: "from-red-500 to-red-300",
      description: "High-speed remote control vehicles",
      itemCount: 15
    },
    { 
      id: 6, 
      name: "Dolls", 
      image: "https://bytescanner.com/png/barbiebcc0.png?w=1200", 
      slug: "dolls",
      icon: "🎎",
      color: "from-yellow-500 to-yellow-300",
      description: "Dolls and accessories for imaginative play",
      itemCount: 28
    },
    { 
      id: 7, 
      name: "Building Blocks", 
      image: "https://static.vecteezy.com/system/resources/previews/033/502/271/non_2x/cute-little-boys-playing-with-colorful-building-blocks-at-home-ai-generated-free-photo.jpeg", 
      slug: "blocks",
      icon: "🏗️",
      color: "from-indigo-500 to-indigo-300",
      description: "Creative building sets for future architects",
      itemCount: 32
    },
    { 
      id: 8, 
      name: "Musical Toys", 
      image: "https://cdn.pixabay.com/photo/2023/12/13/10/48/ai-generated-8446728_1280.png", 
      slug: "musical",
      icon: "🎵",
      color: "from-teal-500 to-teal-300",
      description: "Instruments and toys that make music",
      itemCount: 21
    },
    { 
      id: 9, 
      name: "Action Figures", 
      image: "https://img.freepik.com/premium-photo/several-action-figures-top-view-background-big-collection_1079150-43289.jpg", 
      slug: "action-figures",
      icon: "🦸",
      color: "from-orange-500 to-orange-300",
      description: "Heroes and villains for epic adventures",
      itemCount: 33
    },
    { 
      id: 10, 
      name: "Board Games", 
      image: "https://img.freepik.com/premium-photo/cartoon-themed-home-with-kids-playing-board-games-family-fun-toy-safety_994764-130329.jpg", 
      slug: "board-games",
      icon: "🎲",
      color: "from-cyan-500 to-cyan-300",
      description: "Family games for game nights",
      itemCount: 27
    },
    { 
      id: 11, 
      name: "Arts & Crafts", 
      image: "https://m.media-amazon.com/images/I/71zvhAT2mWL.jpg", 
      slug: "arts-crafts",
      icon: "🎨",
      color: "from-rose-500 to-rose-300",
      description: "Creative supplies for young artists",
      itemCount: 45
    },
    { 
      id: 12, 
      name: "STEM Toys", 
      image: "https://img.freepik.com/premium-psd/happy-girl-building-robots-with-classmates-classroom_1106167-9132.jpg", 
      slug: "stem",
      icon: "🔬",
      color: "from-emerald-500 to-emerald-300",
      description: "Science and technology toys for curious minds",
      itemCount: 19
    }
  ];

  return (
    <div className="min-h-screen md:mt-20 dark:text-yellow-50 py-12">
      <Head>
        <title>All Categories | BabyToysBD</title>
        <meta name="description" content="Browse all toy categories at BabyToysBD. Find the perfect toys for your child's age and interests." />
      </Head>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-gray-800 dark:text-yellow-50 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            All Toy Categories
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-yellow-100 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore our wide range of toy categories to find the perfect playthings for your child
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link href={`/products?category=${slugify(category.name)}`}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-gray-800 rounded-md overflow-hidden shadow-lg cursor-pointer h-full flex flex-col transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className={`absolute top-0 right-0 bg-gradient-to-l ${category.color} text-white px-3 py-1 rounded-bl-lg text-sm font-semibold`}>
                      {category.itemCount} items
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center mb-3">
                      <span className="text-3xl mr-3">{category.icon}</span>
                      <h3 className="font-bold text-gray-800 dark:text-yellow-50 text-xl">{category.name}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{category.description}</p>
                    <div className="mt-auto">
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="text-blue-600 dark:text-blue-400 font-medium flex items-center"
                      >
                        Browse Category
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
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-yellow-50 mb-4">Can&#39;t Find What You&#39;re Looking For?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Our toy experts are here to help you find the perfect toys for your child&#39;s needs and interests.
          </p>
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Contact Our Experts
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoriesPage;