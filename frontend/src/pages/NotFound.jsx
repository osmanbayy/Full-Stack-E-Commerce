import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number with Animation */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, we'll help you find your way back!
          </p>

          {/* Decorative Elements */}
          <div className="flex justify-center gap-2 mb-12">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
            
            <Link
              to="/collection"
              className="group flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Or try these popular pages:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Home
              </Link>
              <Link
                to="/collection"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Collection
              </Link>
              <Link
                to="/faq"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                FAQ
              </Link>
              <Link
                to="/contact"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;


