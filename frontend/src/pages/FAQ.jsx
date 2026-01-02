import { useState } from "react";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";
import { useTranslation } from "react-i18next";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: t("faq.question1"),
      answer: t("faq.answer1")
    },
    {
      question: t("faq.question2"),
      answer: t("faq.answer2")
    },
    {
      question: t("faq.question3"),
      answer: t("faq.answer3")
    },
    {
      question: t("faq.question4"),
      answer: t("faq.answer4")
    },
    {
      question: t("faq.question5"),
      answer: t("faq.answer5")
    },
    {
      question: t("faq.question6"),
      answer: t("faq.answer6")
    },
    {
      question: t("faq.question7"),
      answer: t("faq.answer7")
    },
    {
      question: t("faq.question8"),
      answer: t("faq.answer8")
    }
  ];

  return (
    <div className="pt-10 pb-20">
      <div className="mb-12 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-10 h-10 text-blue-600" />
          </div>
          <Title text1={t("faq.faq")} text2={""} />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          {t("faq.description")}
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto space-y-4 mb-20">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            >
              <h3 className="text-lg font-semibold text-gray-800 pr-4">
                {faq.question}
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? "transform rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-6 pt-0">
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewsletterBox />
    </div>
  );
};

export default FAQ;

