"use client"
// pages/age-guide.tsx
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function AgeGuide() {
     const ageGroups = [
    {
      age: "0-6 months",
      stage: "Newborn",
      description: "At this stage, babies are developing their senses and motor skills. They respond to sounds, sights, and touch.",
      skills: ["Focus on faces", "Track moving objects", "Reach for objects", "Roll over"],
      toyTypes: ["Soft rattles", "Mobiles", "Play mats", "Teething toys"]
    },
    {
      age: "6-12 months",
      stage: "Infant",
      description: "Babies are becoming more mobile and interactive. They're learning to sit, crawl, and may start standing.",
      skills: ["Sit without support", "Crawl", "Pull to stand", "Pick up small objects"],
      toyTypes: ["Activity centers", "Stacking toys", "Shape sorters", "Push toys"]
    },
    {
      age: "1-2 years",
      stage: "Toddler",
      description: "Toddlers are walking and exploring their world. They're developing language and social skills.",
      skills: ["Walk independently", "Say simple words", "Follow simple instructions", "Scribble with crayons"],
      toyTypes: ["Push and pull toys", "Simple puzzles", "Ride-on toys", "Musical instruments"]
    },
    {
      age: "3-5 years",
      stage: "Preschooler",
      description: "Preschoolers are developing imagination, social skills, and early learning concepts.",
      skills: ["Speak in sentences", "Count to 10", "Recognize colors and shapes", "Play with other children"],
      toyTypes: ["Dress-up clothes", "Art supplies", "Board games", "Building blocks"]
    },
    {
      age: "6-8 years",
      stage: "School Age",
      description: "Children are developing more complex skills and interests. They're learning to read, write, and do math.",
      skills: ["Read simple books", "Add and subtract", "Follow rules in games", "Make friends"],
      toyTypes: ["Science kits", "Sports equipment", "Advanced building sets", "Chapter books"]
    },
    {
      age: "9+ years",
      stage: "Older Kids",
      description: "Older kids have more advanced interests and skills. They're developing hobbies and critical thinking.",
      skills: ["Solve complex problems", "Work independently", "Develop specialized interests", "Understand abstract concepts"],
      toyTypes: ["Strategy games", "Model kits", "Coding toys", "Sports equipment"]
    }
  ];
    return (
        <div className="min-h-screen  pt-20 md:py-12">
      <Head>
        <title>Age Guide | BabyToysBD</title>
        <meta name="description" content="Our comprehensive age guide helps you choose the right toys for your child's developmental stage." />
      </Head>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold dark:text-yellow-50 text-gray-800 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Toy Age Guide
          </motion.h1>
          <motion.p 
            className="text-xl dark:text-yellow-100 text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Find the perfect toys for your child&#39;s developmental stage with our comprehensive age guide
          </motion.p>
        </div>

        <div className="space-y-12">
          {ageGroups.map((group, index) => (
            <motion.div 
              key={index}
              className=" dark:bg-black/45 border border-white/45 rounded-md shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="dark:bg-blue-100/25 bg-gray-400/25 rounded-lg p-6 text-center">
                      <span className="dark:text-blue-50 font-semibold text-lg">{group.age}</span>
                      <h3 className="text-2xl font-bold dark:text-yellow-100 text-black  mt-2">{group.stage}</h3>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <p className="text-gray-700 dark:text-yellow-100 mb-6">{group.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold dark:text-yellow-100 text-gray-800 mb-2">Key Skills Developing</h4>
                        <ul className="space-y-1">
                          {group.skills.map((skill, skillIndex) => (
                            <li key={skillIndex} className="flex items-start">
                              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold dark:text-yellow-100 text-gray-800 mb-2">Recommended Toy Types</h4>
                        <ul className="space-y-1">
                          {group.toyTypes.map((toy, toyIndex) => (
                            <li key={toyIndex} className="flex items-start">
                              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span>{toy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
          <h2 className="text-2xl font-bold dark:text-yellow-100 text-gray-800 mb-4">Need More Help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our toy experts are here to help you find the perfect toys for your child&#39;s developmental needs.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Contact Our Experts
          </motion.button>
        </motion.div>
      </div>
    </div>
    );
}




