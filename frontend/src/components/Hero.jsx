import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col sm:flex-row border border-gray-400"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Left Side */}
      <motion.div
        className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0"
        variants={leftVariants}
      >
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">{t("hero.bestsellers")}</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-lg leading-relaxed">
            {t("hero.latestArrivals")}
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">{t("hero.shopNow")}</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </motion.div>
      {/* Hero Right Side */}
      <motion.img
        className="w-full sm:w-1/2"
        src={assets.hero_img}
        alt=""
        variants={imageVariants}
      />
    </motion.div>
  );
};

export default Hero;
