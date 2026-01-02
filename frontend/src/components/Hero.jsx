import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const Hero = () => {
  const { t, i18n } = useTranslation();
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);
  const backendUrl = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/hero-slide/list`);
        if (response.data.success && response.data.slides.length > 0) {
          setSlides(response.data.slides);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching hero slides:", error);
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, [backendUrl]);

  useEffect(() => {
    if (slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000); // Change slide every 5 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [slides.length]);

  const goToPrevious = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    // Restart auto-slide
    if (slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000);
    }
  };

  const goToNext = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    // Restart auto-slide
    if (slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000);
    }
  };

  const getSlideText = (slide, key) => {
    const lang = i18n.language;
    if (lang === "tr") {
      return slide[`${key}Tr`] || slide[key];
    } else if (lang === "en") {
      return slide[`${key}En`] || slide[key];
    }
    return slide[key];
  };

  if (isLoading) {
    return (
      <div className="flex flex-col sm:flex-row border border-gray-400 min-h-[400px]">
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 bg-gray-100 animate-pulse">
          <div className="h-32 w-64 bg-gray-200 rounded"></div>
        </div>
        <div className="w-full sm:w-1/2 bg-gray-100 animate-pulse"></div>
      </div>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative flex flex-col sm:flex-row border border-gray-400 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="flex flex-col sm:flex-row w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Left Side */}
          <motion.div
            className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-[#414141]">
              <div className="flex items-center gap-2">
                <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
                <p className="font-medium text-sm md:text-base">
                  {getSlideText(currentSlide, "subtitle")}
                </p>
              </div>
              <h1 className="prata-regular text-3xl sm:py-3 lg:text-lg leading-relaxed">
                {getSlideText(currentSlide, "title")}
              </h1>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm md:text-base">
                  {getSlideText(currentSlide, "buttonText")}
                </p>
                <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
              </div>
            </div>
          </motion.div>
          {/* Hero Right Side */}
          <motion.img
            className="w-full sm:w-1/2 object-cover"
            src={currentSlide.image}
            alt={getSlideText(currentSlide, "title")}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                }
                setCurrentIndex(index);
                if (slides.length > 1) {
                  intervalRef.current = setInterval(() => {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
                  }, 5000);
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-[#414141]"
                  : "w-2 bg-gray-400 hover:bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;
