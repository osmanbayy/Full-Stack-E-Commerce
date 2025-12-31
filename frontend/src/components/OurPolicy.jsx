import { assets } from "../assets/assets"
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const OurPolicy = () => {
  const { t } = useTranslation();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <motion.img
          src={assets.exchange_icon}
          className="w-12 m-auto mb-5"
          alt=""
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <p className="font-semibold">{t("policy.easyExchange")}</p>
        <p className="text-gray-400">{t("policy.easyExchangeDesc")}</p>
      </motion.div>
      <motion.div variants={itemVariants}>
        <motion.img
          src={assets.quality_icon}
          className="w-12 m-auto mb-5"
          alt=""
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <p className="font-semibold">{t("policy.returnPolicy")}</p>
        <p className="text-gray-400">{t("policy.returnPolicyDesc")}</p>
      </motion.div>
      <motion.div variants={itemVariants}>
        <motion.img
          src={assets.support_img}
          className="w-12 m-auto mb-5"
          alt=""
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <p className="font-semibold">{t("policy.customerSupport")}</p>
        <p className="text-gray-400">{t("policy.customerSupportDesc")}</p>
      </motion.div>
    </motion.div>
  )
}

export default OurPolicy