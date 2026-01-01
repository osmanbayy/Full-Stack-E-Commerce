/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mt-10 mb-2">
        <p className="text-3xl prata-regular">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Name"
          className="w-full px-3 py-2 border border-gray-400 rounded-xl"
          required
        />
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email"
        className="w-full px-3 py-2 border border-gray-400 rounded-xl"
        required
      />

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Password"
        className="w-full px-3 py-2 border border-gray-400 rounded-xl"
        required
      />

      <div className="flex justify-between w-full text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create an Account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>

      <button className="px-8 py-2 mt-4 text-sm font-light text-white bg-black hover:tracking-widest">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>

      {showVerificationMessage && (
        <div className="w-full p-4 mt-4 text-sm text-center bg-blue-50 border border-blue-200 rounded-lg">
          <p className="mb-2 text-blue-800">{t("login.verificationRequired")}</p>
          <button
            type="button"
            onClick={handleResendVerification}
            className="text-blue-600 underline hover:text-blue-800"
          >
            {t("login.resendVerification")}
          </button>
        </div>
      )}
    </form>
  );
};

export default Login;
