import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { useTranslation } from "react-i18next";
import { getProductName } from "../utils/productTranslations";
import toast from "react-hot-toast";
import { Trash2, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token } =
    useContext(ShopContext);
  const { t, i18n } = useTranslation();

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="border-t pt-14">
      <div className="mb-3 text-2xl">
        <Title text1={t("cart.yourCart").split(" ")[0]} text2={t("cart.yourCart").split(" ").slice(1).join(" ")} />
      </div>

      {cartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            {t("cart.emptyCart")}
          </h2>
          <p className="text-gray-500 mb-8 max-w-md">
            {t("cart.emptyCartDesc")}
          </p>
          <button
            onClick={() => navigate("/collection")}
            className="flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white transition-all bg-black rounded-lg hover:bg-gray-800 hover:shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            {t("cart.startShopping")}
          </button>
        </div>
      ) : (
        <>
          <div className="">
            {cartData.map((item, index) => {
              const productData = products.find(
                (product) => product._id === item._id
              );

              return (
                <div
                  key={index}
                  className="grid py-4 text-gray-700 border-t border-b grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                >
                  <div className="flex items-start gap-6">
                    <img
                      src={productData?.image[0]}
                      className="w-16 sm:w-20"
                      alt=""
                    />
                    <div>
                      <p className="text-sm font-medium sm:text-lg">
                        {productData ? getProductName(productData, i18n.language) : ''}
                      </p>
                      <div className="flex items-center gap-5 mt-2">
                        <p>
                          {currency}
                          {productData?.price}
                        </p>
                        <p className="px-2 border sm:px-3 sm:py-1 bg-slate-50">
                          {item.size}
                        </p>
                      </div>
                    </div>
                  </div>
                  <input
                    onChange={(e) =>
                      e.target.value === "" || e.target.value === "0"
                        ? null
                        : updateQuantity(
                            item._id,
                            item.size,
                            Number(e.target.value)
                          )
                    }
                    className="px-1 py-1 border max-w-10 sm:max-w-20 sm:px-2"
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                  />
                  <Trash2
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className="w-4 h-4 mr-4 cursor-pointer sm:w-5 sm:h-5"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[450px]">
              <CartTotal />
              <div className="w-full text-end">
                <button
                  onClick={() => {
                    if (!token) {
                      toast.error(t("cart.loginRequired"));
                      navigate("/login");
                    } else {
                      navigate("/place-order");
                    }
                  }}
                  className="px-8 py-3 my-8 text-sm text-white transition-all bg-black hover:tracking-wider"
                >
                  {t("cart.proceedToCheckout")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
