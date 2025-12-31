/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (prop) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please Select Product Size!");
      return;
    }

    // To copy objects without references with structuredClone()
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
        toast.success("Item added to cart.");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          toast.error("Unknown Problem!", error);
        }
      }
    }

    return totalCount;
  };

  const getProductsData = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const addToWishList = async (itemId) => {
    if (!itemId) {
      toast.error("Item ID is required!");
      return;
    }
  
    if (token) {
      try {
        const response = await axios.post(
          backendUrl + "/api/wishlist/add",
          { itemId },
          { headers: { token } }
        );
  
        if (response.data.success) {
          toast.success("Item added to Wish List!");
          getUserWishlist(token); // Refresh wishlist after adding
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    } else {
      toast.error("You need to be logged in to add items to Wish List.");
    }
  };

  const getUserWishlist = async (token) => {
    if (!token) return;
    
    try {
      const response = await axios.post(
        backendUrl + "/api/wishlist/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setWishlistItems(response.data.wishList || []);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeFromWishlist = async (itemId) => {
    if (!itemId) {
      toast.error("Item ID is required!");
      return;
    }
  
    if (token) {
      try {
        const response = await axios.post(
          backendUrl + "/api/wishlist/remove",
          { itemId },
          { headers: { token } }
        );
  
        if (response.data.success) {
          toast.success("Item removed from Wish List!");
          getUserWishlist(token); // Refresh wishlist after removing
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    } else {
      toast.error("You need to be logged in to remove items from Wish List.");
    }
  };
  

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      getUserCart(storedToken);
      getUserWishlist(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getUserWishlist(token);
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    addToWishList,
    wishlistItems,
    removeFromWishlist,
    getUserWishlist,
    isLoadingProducts
  };

  return (
    <ShopContext.Provider value={value}>{prop.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
