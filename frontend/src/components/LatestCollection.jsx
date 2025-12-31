import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import ProductItemSkeleton from "./ProductItemSkeleton";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getProductName } from "../utils/productTranslations";

const LatestCollection = () => {
  const { products, isLoadingProducts } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
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
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      className="my-10"
      initial="hidden"
      animate={!isLoadingProducts && latestProducts.length > 0 ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.div className="py-8 text-3xl text-center">
        <Title text1={t("home.latestCollections").split(" ")[0]} text2={t("home.latestCollections").split(" ").slice(1).join(" ")} />
        <motion.p
          className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base italic font-semibold"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("home.latestCollectionsDesc")}
        </motion.p>
      </motion.div>

      {/* Rendering Products */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
        {isLoadingProducts ? (
          Array.from({ length: 10 }).map((_, index) => (
            <ProductItemSkeleton key={index} />
          ))
        ) : latestProducts.length > 0 ? (
          latestProducts.map((item, index) => (
            <motion.div key={item._id} variants={itemVariants}>
              <ProductItem
                id={item._id}
                image={item.image}
                name={getProductName(item, i18n.language)}
                price={item.price}
              />
            </motion.div>
          ))
        ) : null}
      </div>
    </motion.div>
  );
};

export default LatestCollection;
