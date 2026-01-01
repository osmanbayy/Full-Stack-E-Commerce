/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "Sign Up") {
        // Sign Up API
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          if (response.data.requiresVerification) {
            setShowVerificationMessage(true);
            setVerificationEmail(email);
            toast.success(response.data.message || t("login.verificationEmailSent"));
          } else if (response.data.token) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
          }
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Login API
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          if (response.data.requiresVerification) {
            setShowVerificationMessage(true);
            setVerificationEmail(response.data.email || email);
          }
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.requiresVerification) {
        setShowVerificationMessage(true);
        setVerificationEmail(error.response.data.email || email);
      }
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/user/resend-verification", {
        email: verificationEmail,
      });
      if (response.data.success) {
        toast.success(response.data.message || t("login.resendSuccess"));
      } else {
        toast.error(response.data.message || t("login.resendError"));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("login.resendError"));
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[420px]"
      >
        {/* Toggle Buttons */}
        <div className="flex mb-8 bg-gray-100 rounded-full p-1">
          <button
            type="button"
            onClick={() => {
              setCurrentState("Login");
              setName("");
              setEmail("");
              setPassword("");
            }}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
              currentState === "Login"
                ? "bg-black text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("login.login")}
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentState("Sign Up");
              setName("");
              setEmail("");
              setPassword("");
            }}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
              currentState === "Sign Up"
                ? "bg-black text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("login.signUp")}
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-medium text-gray-900 mb-2">
              {currentState === "Login" ? t("login.welcomeBack") : t("login.createAccountTitle")}
            </h1>
            <p className="text-sm text-gray-500">
              {currentState === "Login"
                ? t("login.signInToContinue")
                : t("login.joinUs")}
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-5">
            <AnimatePresence mode="wait">
              {currentState === "Sign Up" && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: "1.25rem" }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text"
                    placeholder={t("login.fullName")}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all duration-200 text-gray-900 placeholder-gray-400"
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder={t("login.email")}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all duration-200 text-gray-900 placeholder-gray-400"
              required
            />

            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder={t("login.password")}
                className="w-full px-4 py-3.5 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all duration-200 text-gray-900 placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors duration-200"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {currentState === "Login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-black transition-colors duration-200"
                >
                  {t("login.forgotPassword")}
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 mt-6 text-sm font-semibold text-white bg-black rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {currentState === "Login" ? t("login.signIn") : t("login.createAccount")}
            </motion.button>

            <AnimatePresence>
              {showVerificationMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full p-4 mt-4 text-sm text-center bg-blue-50 border-2 border-blue-200 rounded-xl"
                >
                  <p className="mb-2 text-blue-800 font-medium">
                    {t("login.verificationRequired")}
                  </p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
                  >
                    {t("login.resendVerification")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
