import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import toast from "react-hot-toast";
import { provinces } from "../utils/provinces";
import { useTranslation } from "react-i18next";

const PlaceOrder = () => {
  // Default cash on delivery (cod)
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const API_URL = "https://turkiyeapi.dev/api/v1/";
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState([]);

  const sortedProvinces = [...provinces].sort((a, b) =>
    a.name.localeCompare(b.name, "tr", { sensitivity: "base" })
  );

  const getProvinceInfo = async () => {
    try {
      const response = await fetch(
        `${API_URL}provinces?name=${selectedProvince}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.data && data.data.length > 0) {
        const provinceData = data.data[0];
        const districtList = provinceData.districts || [];
        setDistricts(districtList);
      } else {
        setDistricts([]);
      }
    } catch (error) {
      console.error("Hata:", error);
      setDistricts([]);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      // Add province and district to formData
      // Format phone number with +90 prefix
      const formattedPhone = formData.phone ? `+90${formData.phone}` : formData.phone;
      
      let orderData = {
        address: {
          ...formData,
          phone: formattedPhone, // Phone with +90 prefix
          city: selectedProvince.toString(),  // Add selectedProvince as city
          state: selectedDistrict.toString(),  // Add selectedDistrict as state
        },
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod": {
          const response = await axios.post(
            backendUrl + "/api/order/place-cash-on-delivery",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const onChangeHandler = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    // Phone number validation - only allow digits and limit length
    if (name === "phone") {
      // Remove any non-digit characters (including +90 if user types it)
      value = value.replace(/\D/g, "");
      // Remove leading 0 if user types it (we'll add +90 prefix)
      if (value.startsWith("0")) {
        value = value.slice(1);
      }
      // Limit to 10 digits (without country code)
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    }

    // Zipcode validation - only allow digits
    if (name === "zipcode") {
      value = value.replace(/\D/g, "");
    }

    setFormData((data) => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    if (selectedProvince) {
      getProvinceInfo();
    }
  }, [selectedProvince]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t"
    >
      {/* ----------- Left Side ------------ */}
      <div className="flex flex-col w-full gap-4 sm:max-w-[480px]">
        <div className="my-3 text-xl sm:text-2xl">
          <Title text1={t("placeOrder.deliveryInformation").split(" ")[0]} text2={t("placeOrder.deliveryInformation").split(" ").slice(1).join(" ")} />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            type="text"
            placeholder={t("placeOrder.firstName")}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            type="text"
            placeholder={t("placeOrder.lastName")}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>

        <input
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          type="email"
          placeholder={t("placeOrder.email")}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          required
        />
        <input
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          type="text"
          placeholder={t("placeOrder.street")}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          required
        />

        <div className="flex gap-3">
          <select
            onChange={(e) => setSelectedProvince(e.target.value)}
            name="city"
            value={selectedProvince}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          >
            <option value="">{t("placeOrder.chooseProvince")}</option>
            {sortedProvinces.map((province) => (
              <option key={province.id} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => setSelectedDistrict(e.target.value)}
            name="state"
            value={selectedDistrict}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          >
            {districts?.length > 0 ? (
              districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))
            ) : (
              <option disabled={selectedProvince}>{t("placeOrder.chooseDistrict")}</option>
            )}
          </select>
        </div>

        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            type="number"
            placeholder={t("placeOrder.zipcode")}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            type="text"
            placeholder={t("placeOrder.country")}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>

        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            +90
          </span>
          <input
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            type="tel"
            placeholder={i18n.language === "tr" ? "5XX XXX XX XX" : "5XX XXX XX XX"}
            className="border border-gray-300 rounded py-1.5 pl-12 pr-3.5 w-full"
            pattern="[0-9]{10}"
            maxLength={10}
            minLength={10}
            required
            title={i18n.language === "tr" ? "10 haneli telefon numarası girin (örn: 5551234567)" : "Enter 10 digit phone number (e.g., 5551234567)"}
          />
        </div>
      </div>

      {/* ------------ Right Side ------------- */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={t("placeOrder.paymentMethod").split(" ")[0]} text2={t("placeOrder.paymentMethod").split(" ").slice(1).join(" ")} />
          {/* --------- Payment Method Selection ---------- */}
          <div className="flex flex-col gap-3 lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 p-2 px-3 border cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400 " : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
            </div>

            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 p-2 px-3 border cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-400 " : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
            </div>

            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 p-2 px-3 border cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400 " : ""
                }`}
              ></p>
              <p className="mx-4 text-sm font-medium text-gray-500">
                {t("placeOrder.cashOnDelivery")}
              </p>
            </div>
          </div>

          <div className="w-full mt-8 text-end">
            <button
              type="submit"
              className="px-16 py-3 text-sm text-white bg-black hover:tracking-widest"
            >
              {t("placeOrder.placeOrder")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
