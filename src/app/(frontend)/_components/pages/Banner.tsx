"use client"
// components/Banner.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  backgroundColor: string;
  textColor: string;
}

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const router = useRouter()

  const slides: BannerSlide[] = [
    {
      id: 1,
      title: "Summer Toy Collection",
      subtitle: "New Arrivals",
      description: "Discover our exciting range of summer toys perfect for outdoor fun and adventure!",
      buttonText: "Shop Now",
      buttonLink: "/products?tags=summer-toys",
      image: "https://discovermystore.com/cdn/shop/products/diving-toys-set-for-pool-swimming-pool-diving-toys-for-kids-toddler-pool-toys-for-kids-3-10-underwater-variety-toys-shark-diving-ring-gems-elongated-octopus-dive-pool-toy-for-kids-swi_34a5afd9-7889-45eb-93d2-03e503b21093_1024x.jpg?v=1696527908",
      backgroundColor: "bg-gradient-to-r from-blue-400 to-cyan-300",
      textColor: "text-white"
    },
    {
      id: 2,
      title: "Educational Toys",
      subtitle: "Learn & Play",
      description: "Boost your child's development with our educational toys designed for learning through play.",
      buttonText: "Explore",
      buttonLink: "/products?tags=educational",
      image: "https://static.vecteezy.com/system/resources/previews/048/505/906/non_2x/teacher-and-kids-playing-with-educational-toys-in-kindergarten-or-preschool-photo.jpg",
      backgroundColor: "bg-gradient-to-r from-purple-500 to-pink-400",
      textColor: "text-white"
    },
    {
      id: 3,
      title: "Special Offer",
      subtitle: "Up to 50% Off",
      description: "Limited time offer on selected baby toys. Don't miss out on these amazing deals!",
      buttonText: "View Deals",
      buttonLink: "/products?tags=deals",
      image: "https://i.postimg.cc/sxj2gFs8/7798354.jpg",
      backgroundColor: "bg-gradient-to-r from-yellow-400 to-orange-400",
      textColor: "text-gray-800"
    },
    {
      id: 4,
      title: "Baby Essentials",
      subtitle: "Everything You Need",
      description: "From rattles to walkers, find all the essential toys for your baby's first years.",
      buttonText: "Shop Essentials",
      buttonLink: "/products?tags=baby-essentials",
      image: "https://api.watsons.com.ph/medias/Mom-Baby-Campaign-page-banner-1260x526.jpg?context=bWFzdGVyfHJvb3R8NDE5NDYyfGltYWdlL2pwZWd8YURCa0wyZzFZaTh4TURVek1qZzFOVFUzT0RZMU5DOU5iMjBtUW1GaWVWOURZVzF3WVdsbmJpQndZV2RsSUdKaGJtNWxjbDh4TWpZd2VEVXlOaTVxY0djfDM5ZjhjNDg2YWUxYjEwZTliMjY0MzAxMmE3YWI5NTczYjUyNzcwYThmMGI4MTJkNDMxZjIyZGRjMDZjZWE4MmU",
      backgroundColor: "bg-gradient-to-r from-green-400 to-teal-300",
      textColor: "text-white"
    }
  ];

  const slideVariants = {
    hiddenRight: {
      x: "100%",
      opacity: 0
    },
    hiddenLeft: {
      x: "-100%",
      opacity: 0
    },
    visible: {
      x: "0",
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };

  const dotsVariants = {
    active: {
      scale: 1.3,
      backgroundColor: "#3B82F6"
    },
    inactive: {
      scale: 1,
      backgroundColor: "#CBD5E1"
    }
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlay]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlay(false);
  const handleMouseLeave = () => setIsAutoPlay(true);

  return (
    <div 
      className="relative w-full h-[200px] md:h-[600px]  overflow-hidden md:rounded-md shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial={direction > 0 ? "hiddenRight" : "hiddenLeft"}
          animate="visible"
          exit="exit"
          className={`absolute inset-0 flex flex-col md:flex-row ${slides[currentSlide].backgroundColor} ${slides[currentSlide].textColor}`}
        >
          {/* Text Content */}
          <div className=" hidden md:flex flex-col justify-center md:pl-20 p-8 md:p-12 md:w-1/2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="text-lg md:text-xl font-semibold">{slides[currentSlide].subtitle}</span>
              <h1 className="text-3xl md:text-5xl font-bold mt-2">{slides[currentSlide].title}</h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg md:text-xl max-w-md"
            >
              {slides[currentSlide].description}
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={()=>router.push(slides[currentSlide].buttonLink)}
              className={`mt-4 px-6 py-3 rounded-lg font-semibold w-fit ${
                slides[currentSlide].textColor === 'text-white' 
                  ? 'bg-white text-blue-600 hover:bg-gray-100' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {slides[currentSlide].buttonText}
            </motion.button>
          </div>
          
          {/* Image */}
          <div className="flex items-center justify-center md:p-8 md:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative w-full h-full max-w-md max-h-[400px]"
            >
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 backdrop-blur-sm rounded-full p-2 hover:bg-white/50 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 backdrop-blur-sm rounded-full p-2 hover:bg-white/50 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleDotClick(index)}
            className="w-3 h-3 rounded-full"
            variants={dotsVariants}
            animate={currentSlide === index ? "active" : "inactive"}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;