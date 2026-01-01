import { assets } from "../assets/assets";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="pt-8 text-2xl text-center border-t">
        <Title text1={t("about.aboutUs").split(" ")[0]} text2={t("about.aboutUs").split(" ").slice(1).join(" ")} />
      </div>

      <div className="flex flex-col gap-16 my-10 md:flex-row">
        <img
          src={assets.about_img}
          className="w-full md:max-w-[450px]"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 text-gray-600 md:w-2/4">
          <p>
            {t("about.paragraph1")}
          </p>
          <p>
            {t("about.paragraph2")}
          </p>
          <p>
            {t("about.paragraph3")}
          </p>
          <b className="text-gray-800">{t("about.ourMission")}</b>
          <p>
            {t("about.missionText")}
          </p>
        </div>
      </div>

      <div className="py-4 text-xl">
        <Title text1={t("about.whyChooseUs").split(" ")[0]} text2={t("about.whyChooseUs").split(" ").slice(1).join(" ")} />
      </div>

      <div className="flex flex-col gap-2 mb-20 text-sm md:flex-row">
        <div className="flex flex-col gap-5 px-10 py-8 border rounded-xl md:px-16 sm:py-20">
          <b>{t("about.qualityAssurance")}</b>
          <p className="text-gray-500">
            {t("about.qualityAssuranceDesc")}
          </p>
        </div>

        <div className="flex flex-col gap-5 px-10 py-8 border rounded-xl md:px-16 sm:py-20">
          <b>{t("about.convenience")}</b>
          <p className="text-gray-500">
            {t("about.convenienceDesc")}
          </p>
        </div>

        <div className="flex flex-col gap-5 px-10 py-8 border rounded-xl md:px-16 sm:py-20">
          <b>{t("about.exceptionalService")}</b>
          <p className="text-gray-500">
            {t("about.exceptionalServiceDesc")}
          </p>
        </div>
      </div>


      <NewsletterBox />
    </div>
  );
};

export default About;
