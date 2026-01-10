// components/ShopByAge.tsx
import { motion } from 'framer-motion';
import Link from 'next/link';

interface AgeGroup {
  id: number;
  name: string;
  ageRange: string;
  description: string;
  icon: string;
  color: string;
  link: string;
}

const ShopByAge = () => {
  const ageGroups: AgeGroup[] = [
  {
    id: 1,
    name: "Mother Care & Postpartum Essentials",
    ageRange: "Pregnancy and Postpartum",
    description: "Maternity and postpartum care essentials: maternity pillows, nursing covers, recovery kits, wellness & comfort items for expecting & new moms.",
    icon: "🤰",
    color: "from-rose-400 to-rose-200",
    link: "mother-care-postpartum-essentials"
  },
  {
    id: 2,
    name: "Newborn Toys & Essentials (0-12 months)",
    ageRange: "0-12 months",
    description: "Safe and soothing essentials for newborns: sensory toys, marked crib mobiles, high contrast items, newborn clothing & feeding gear.",
    icon: "👶",
    color: "from-pink-400 to-pink-200",
    link: "newborn-toys-and-essentials"
  },
  {
    id: 3,
    name: "Toddler Learning & Play (1-3 years)",
    ageRange: "1-3 years",
    description: "Developmental & interactive toys for toddlers: ride-ons, building blocks, early learning puzzles, toddler safety gear.",
    icon: "🚶",
    color: "from-green-400 to-green-200",
    link: "toddler-learning-play"
  },
  {
    id: 4,
    name: "Preschool Education & Toys (3-5 years)",
    ageRange: "3-5 years",
    description: "Educational, creative & social play for preschoolers: arts & crafts, early literacy & STEM toys, imaginative play sets.",
    icon: "🎒",
    color: "from-purple-400 to-purple-200",
    link: "preschool-education-toys"
  },
  {
    id: 5,
    name: "School Age Development (5-8 years)",
    ageRange: "5-8 years",
    description: "Enriching toys for school-aged kids: STEM kits, board & strategy games, active outdoor play gear.",
    icon: "📚",
    color: "from-yellow-400 to-yellow-200",
    link: "school-age-development"
  },
  {
    id: 6,
    name: "Tween & Advanced Play (9+ years)",
    ageRange: "9+ years",
    description: "Challenging & engaging toys for tweens: robotics, advanced puzzles, gaming sets, creative maker tools.",
    icon: "🎮",
    color: "from-red-400 to-red-200",
    link: "tween-advanced-play"
  }
];


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="md:py-8 py-4 md:block hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <motion.h2 
            className="text-3xl font-bold dark:text-yellow-50 text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Shop by Age
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-yellow-100 mt-2 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Find the perfect toys for your child&#39;s developmental stage
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {ageGroups.map((group) => (
            <motion.div key={group.id} variants={itemVariants}>
              <Link href={`/products?tags=${group.ageRange}`}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className={`bg-gradient-to-br ${group.color} rounded-md overflow-hidden shadow-lg cursor-pointer h-full flex flex-col`}
                >
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-md md:text-2xl  font-bold text-gray-800">{group.name}</h3>
                        <p className="text-gray-700 font-medium">{group.ageRange}</p>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 15 }}
                        className="bg-white/30 backdrop-blur-sm rounded-full p-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </motion.div>
                    </div>
                    
                    <p className="text-gray-700 mb-6">{group.description}</p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-auto px-4 py-2 bg-white text-gray-800 font-semibold rounded-lg shadow-md"
                    >
                      Shop Now
                    </motion.button>
                  </div>
                  
                  <div className="flex justify-center items-center p-6 bg-black/10">
                    <span className="text-6xl">{group.icon}</span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Link href="/age-guide">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              View Our Age Guide
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopByAge;