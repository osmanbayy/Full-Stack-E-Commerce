import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const { token, backendUrl, navigate } = useContext(ShopContext);
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          backendUrl + "/api/user/user-data",
          {},
          { headers: { token } }
        );
        if (response.data.success) {
          setUserData(response.data.userData);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, backendUrl, navigate]);

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="border-t pt-14">
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">{t("profile.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-14">
      <div className="mb-6 text-2xl">
        <Title text1={t("profile.myProfile").split(" ")[0]} text2={t("profile.myProfile").split(" ").slice(1).join(" ")} />
      </div>

      <div className="max-w-2xl">
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("profile.personalInformation")}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t("profile.name")}</label>
              <p className="text-gray-800 text-base">{userData?.name || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t("profile.email")}</label>
              <p className="text-gray-800 text-base">{userData?.email || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("profile.accountSettings")}</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/orders")}
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
            >
              <p className="font-medium text-gray-800">{t("profile.viewOrders")}</p>
              <p className="text-sm text-gray-500 mt-1">{t("profile.viewOrdersDesc")}</p>
            </button>
            <button
              onClick={() => navigate("/wishlist")}
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
            >
              <p className="font-medium text-gray-800">{t("profile.myWishlist")}</p>
              <p className="text-sm text-gray-500 mt-1">{t("profile.myWishlistDesc")}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

