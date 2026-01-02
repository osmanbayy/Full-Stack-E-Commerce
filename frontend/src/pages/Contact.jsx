import { useState } from "react";
import { useTranslation } from "react-i18next";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Loader2
} from "lucide-react";

const Contact = () => {
  const { t } = useTranslation();
  const { backendUrl } = useContext(ShopContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(backendUrl + "/api/contact/submit", formData);
      if (response.data.success) {
        toast.success(t("contact.messageSent"));
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(response.data.message || t("contact.messageError"));
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(t("contact.messageError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10">
      {/* Header */}
      <div className="text-center mb-16">
        <Title text1={t("contact.contactUs")} text2={""} />
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
          {t("contact.contactDesc")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {t("contact.getInTouch")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.name")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("contact.namePlaceholder")}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.email")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("contact.emailPlaceholder")}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.phone")}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("contact.phonePlaceholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.subject")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t("contact.subjectPlaceholder")}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("contact.message")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("contact.messagePlaceholder")}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t("contact.sending")}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t("contact.sendMessage")}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information Cards */}
        <div className="space-y-6">
          {/* Store Info Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{t("contact.ourStore")}</h3>
            </div>
            <p className="text-gray-600 mb-4">{t("contact.addressValue")}</p>
          </div>

          {/* Contact Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("contact.getInTouch")}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">{t("contact.phoneLabel")}</p>
                  <p className="text-gray-800 font-medium">{t("contact.phoneValue")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">{t("contact.emailLabel")}</p>
                  <p className="text-gray-800 font-medium">{t("contact.emailValue")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("contact.businessHours")}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t("contact.mondayFriday")}</span>
                <span className="text-gray-800 font-medium">{t("contact.hours")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("contact.saturday")}</span>
                <span className="text-gray-800 font-medium">{t("contact.hours")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("contact.sunday")}</span>
                <span className="text-gray-800 font-medium">{t("contact.closed")}</span>
              </div>
            </div>
          </div>

          {/* Social Media Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t("contact.followUs")}</h3>
            <p className="text-sm text-gray-600 mb-4">{t("contact.socialMedia")}</p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white hover:bg-sky-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white hover:from-purple-700 hover:to-pink-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Careers Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t("contact.careers")}</h3>
            <p className="text-sm text-gray-600 mb-4">{t("contact.careersDesc")}</p>
            <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors w-full">
              {t("contact.exploreJobs")}
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterBox />
    </div>
  );
};

export default Contact;
