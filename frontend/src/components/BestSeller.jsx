import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import Title from "./Title";
import ProductItem from "./ProductItem";
import ProductItemSkeleton from "./ProductItemSkeleton";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getProductName } from "../utils/productTranslations";
import { useNavigate } from "react-router-dom";


const BestSeller = () => {
    const {products, isLoadingProducts} = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    useEffect(()=> {
        const bestProduct = products.filter((item)=>item.bestseller);
        setBestSeller(bestProduct.slice(0,5));
    }, [products])

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
        animate={!isLoadingProducts && bestSeller.length > 0 ? "visible" : "hidden"}
        variants={containerVariants}
    >
        <motion.div className="py-8 text-3xl text-center">
            <Title text1={t("home.bestSellers").split(" ")[0]} text2={t("home.bestSellers").split(" ").slice(1).join(" ")}/>
            <motion.p
                className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base italic font-semibold"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {t("home.bestSellersDesc")}
            </motion.p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
            {isLoadingProducts ? (
                Array.from({ length: 5 }).map((_, index) => (
                    <ProductItemSkeleton key={index} />
                ))
            ) : bestSeller.length > 0 ? (
                bestSeller.map((item, index)=> (
                    <motion.div key={item._id} variants={itemVariants}>
                        <ProductItem id={item._id} image={item.image} name={getProductName(item, i18n.language)} price={item.price} discount={item.discount || 0} />
                    </motion.div>
                ))
            ) : null}
        </div>

        {/* View All Best Sellers Button */}
        {!isLoadingProducts && bestSeller.length > 0 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => navigate("/collection?bestseller=true")}
              className="group relative px-6 py-3 bg-white border-2 border-gray-300 text-gray-800 text-sm font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-gray-400 hover:bg-gray-50"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("home.viewAllBestSellers")}
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </div>
        )}
    </motion.div>
  )
}

export default BestSeller