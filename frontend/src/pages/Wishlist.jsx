import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const Wishlist = () => {
  const { wishlistItems, products, currency } = useContext(ShopContext);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">Your Wishlist</h1>

      <p>No items in your wishlist!</p>
    </div>
  );
};

export default Wishlist;
