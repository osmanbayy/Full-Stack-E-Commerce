import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Package, 
  Heart, 
  ShoppingCart, 
  Calendar,
  Settings,
  Edit,
  Lock,
  Shield,
  ArrowRight,
  Loader2,
  CheckCircle,
  Clock
} from "lucide-react";

const MyProfile = () => {
  const { token, backendUrl, navigate, wishlistItems, cartItems } = useContext(ShopContext);
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    wishlistCount: 0,
    cartCount: 0
  });

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
        toast.error(error.message || t("profile.failedToLoad"));
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        // Fetch orders
        const ordersResponse = await axios.post(
          backendUrl + "/api/order/user-orders",
          {},
          { headers: { token } }
        );
        
        if (ordersResponse.data.success) {
          const orders = ordersResponse.data.orders || [];
          const activeOrders = orders.filter(order => order.status !== "Delivered");
          
          setStats(prev => ({
            ...prev,
            totalOrders: orders.length,
            activeOrders: activeOrders.length,
            wishlistCount: wishlistItems?.length || 0,
            cartCount: Object.keys(cartItems || {}).length
          }));
        }
      } catch (error) {
        console.log("Error fetching stats:", error);
      }
    };

    fetchUserData();
    fetchStats();
  }, [token, backendUrl, navigate, wishlistItems, cartItems, t]);

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="border-t pt-14">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const quickActionCards = [
    {
      icon: Package,
      title: t("profile.viewOrders"),
      description: t("profile.viewOrdersDesc"),
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      onClick: () => navigate("/orders")
    },
    {
      icon: Heart,
      title: t("profile.myWishlist"),
      description: t("profile.myWishlistDesc"),
      color: "from-pink-500 to-pink-600",
      hoverColor: "hover:from-pink-600 hover:to-pink-700",
      onClick: () => navigate("/wishlist"),
      badge: stats.wishlistCount > 0 ? stats.wishlistCount : null
    },
    {
      icon: ShoppingCart,
      title: t("profile.viewCart"),
      description: t("profile.viewCartDesc"),
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      onClick: () => navigate("/cart"),
      badge: stats.cartCount > 0 ? stats.cartCount : null
    }
  ];

  const statCards = [
    {
      icon: Package,
      label: t("profile.totalOrders"),
      value: stats.totalOrders,
      color: "bg-blue-100 text-blue-600",
      iconColor: "text-blue-600"
    },
    {
      icon: Clock,
      label: t("profile.activeOrders"),
      value: stats.activeOrders,
      color: "bg-orange-100 text-orange-600",
      iconColor: "text-orange-600"
    },
    {
      icon: Heart,
      label: t("profile.wishlistItems"),
      value: stats.wishlistCount,
      color: "bg-pink-100 text-pink-600",
      iconColor: "text-pink-600"
    },
    {
      icon: CheckCircle,
      label: t("orders.delivered"),
      value: stats.totalOrders - stats.activeOrders,
      color: "bg-green-100 text-green-600",
      iconColor: "text-green-600"
    }
  ];

  return (
    <div className="border-t pt-14 pb-20">
      <div className="mb-8 text-2xl">
        <Title text1={t("profile.myProfile").split(" ")[0]} text2={t("profile.myProfile").split(" ").slice(1).join(" ")} />
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30 shadow-lg">
            {getInitials(userData?.name)}
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold mb-2">{userData?.name || "User"}</h1>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>{userData?.email || "N/A"}</span>
              </div>
              {userData?.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{t("profile.memberSince")}: {formatDate(userData.date)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{t("profile.personalInformation")}</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t("profile.name")}</label>
                  <p className="text-gray-800 text-lg font-semibold">{userData?.name || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t("profile.email")}</label>
                  <p className="text-gray-800 text-lg font-semibold">{userData?.email || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{t("profile.quickActions")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActionCards.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`group relative bg-gradient-to-br ${action.color} ${action.hoverColor} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-8 h-8" />
                        {action.badge && (
                          <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                            {action.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                      <p className="text-sm text-white/90">{action.description}</p>
                      <ArrowRight className="w-5 h-5 mt-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Account Settings Sidebar */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{t("profile.accountSettings")}</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 group">
              <Edit className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span className="flex-1 text-left font-medium text-gray-800">{t("profile.editProfile")}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 group">
              <Lock className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span className="flex-1 text-left font-medium text-gray-800">{t("profile.changePassword")}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 group">
              <Shield className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span className="flex-1 text-left font-medium text-gray-800">{t("profile.privacySettings")}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
