import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import ProductItemSkeleton from "./ProductItemSkeleton";
import { useTranslation } from "react-i18next";
import { getProductName } from "../utils/productTranslations";

const LatestCollection = () => {
  const { products, isLoadingProducts } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="py-8 text-3xl text-center">
        <Title text1={t("home.latestCollections").split(" ")[0]} text2={t("home.latestCollections").split(" ").slice(1).join(" ")} />
        <p className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base italic font-semibold">
          {t("home.latestCollectionsDesc")}
        </p>
      </div>

      {/* Rendering Products */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
        {isLoadingProducts ? (
          Array.from({ length: 10 }).map((_, index) => (
            <ProductItemSkeleton key={index} />
          ))
        ) : latestProducts.length > 0 ? (
          latestProducts.map((item, index) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={getProductName(item, i18n.language)}
              price={item.price}
            />
          ))
        ) : null}
      </div>
    </div>
  );
};

export default LatestCollection;
