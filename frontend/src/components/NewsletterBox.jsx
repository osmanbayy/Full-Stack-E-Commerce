import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const NewsletterBox = () => {
    const { t } = useTranslation();

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
            },
        },
    };

  return (
    <motion.div
      className="text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <motion.p
        className="text-2xl font-medium text-gray-700"
        variants={itemVariants}
      >
        {t("newsletter.subscribe")}
      </motion.p>
      <motion.p
        className="text-gray-400 mt-3"
        variants={itemVariants}
      >
        {t("newsletter.subscribeDesc")}
      </motion.p>
      <motion.form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
        variants={itemVariants}
      >
        <input
          type="email"
          placeholder={t("newsletter.enterEmail")}
          className="w-full sm:flex-1 outline-none"
          required
        />
        <motion.button
          className="bg-black text-white text-xs px-10 py-4 transition ease-in-out hover:bg-red-300 hover:text-black"
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t("newsletter.subscribeButton")}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default NewsletterBox;
