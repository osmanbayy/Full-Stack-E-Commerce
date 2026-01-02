import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { backendUrl } = useContext(ShopContext);
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setMessage(t("verifyEmail.noToken"));
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.post(backendUrl + "/api/user/verify-email", {
          token,
        });

        if (response.data.success) {
          setStatus("success");
          setMessage(response.data.message || t("verifyEmail.success"));
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(response.data.message || t("verifyEmail.error"));
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || t("verifyEmail.error"));
      }
    };

    verifyEmail();
  }, [searchParams, backendUrl, navigate, t]);

  const handleResend = async () => {
    try {
      const email = prompt(t("verifyEmail.enterEmail"));
      if (!email) return;

      const response = await axios.post(backendUrl + "/api/user/resend-verification", {
        email,
      });

      if (response.data.success) {
        toast.success(response.data.message || t("verifyEmail.resendSuccess"));
      } else {
        toast.error(response.data.message || t("verifyEmail.resendError"));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("verifyEmail.resendError"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center">
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto"></div>
            <p className="text-lg">{t("verifyEmail.verifying")}</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold text-green-600">
              {t("verifyEmail.successTitle")}
            </h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500">
              {t("verifyEmail.redirecting")}
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="text-6xl mb-4">✗</div>
            <h2 className="text-2xl font-semibold text-red-600">
              {t("verifyEmail.errorTitle")}
            </h2>
            <p className="text-gray-600">{message}</p>
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleResend}
                className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                {t("verifyEmail.resendButton")}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                {t("verifyEmail.backToLogin")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;



