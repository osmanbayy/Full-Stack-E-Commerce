import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { useTranslation } from "react-i18next";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={t("cart.cartTotals").split(" ")[0]} text2={t("cart.cartTotals").split(" ").slice(1).join(" ")} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>{t("cart.subtotal")}</p>
          <p>
            {currency}
            {getCartAmount()}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>{t("cart.shippingFee")}</p>
          <p>
            {currency} {delivery_fee}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>{t("cart.total")}</b>
          <b>
            {currency}
            {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
