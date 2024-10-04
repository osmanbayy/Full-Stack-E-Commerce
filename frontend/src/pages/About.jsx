import { assets } from "../assets/assets";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div>
      <div className="pt-8 text-2xl text-center border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="flex flex-col gap-16 my-10 md:flex-row">
        <img
          src={assets.about_img}
          className="w-full md:max-w-[450px]"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 text-gray-600 md:w-2/4">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque iste
            dignissimos dolorum odio natus perferendis officia perspiciatis
            cupiditate sit ipsa voluptate culpa veniam ullam eum animi
            temporibus molestias ea delectus, dolorem et ipsum. Sequi pariatur
            provident saepe eos, ratione accusamus iste? Mollitia autem
            perferendis incidunt ipsa ipsam aliquid consequuntur necessitatibus?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
            dignissimos harum eius porro voluptates iste exercitationem. Qui,
            facere iure corporis a adipisci alias doloribus veritatis officiis,
            voluptates libero, debitis asperiores quas! Tempora similique nemo
            quod dolor ad esse voluptate! Doloremque, rerum quo vitae veniam
            repellat, non, culpa asperiores numquam sint dolore distinctio.
            Nesciunt atque omnis accusantium quam, optio cum porro.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure iste
            totam eos sed nostrum repellat reiciendis voluptatibus obcaecati,
            dicta nam.
          </p>
        </div>
      </div>

      <div className="py-4 text-xl">
        <Title text1={"WHY"} text2={"CHOOSE US?"} />
      </div>

      <div className="flex flex-col gap-2 mb-20 text-sm md:flex-row">
        <div className="flex flex-col gap-5 px-10 py-8 border rounded-xl md:px-16 sm:py-20">
          <b>Quality Assurance</b>
          <p className="text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
            quos nisi, deserunt cum adipisci minima?
          </p>
        </div>
        <div className="flex flex-col gap-5 px-10 py-8 border rounded-xl md:px-16 sm:py-20">
          <b>Convenience</b>
          <p className="text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
            quos nisi, deserunt cum adipisci minima?
          </p>
        </div>
        <div className="flex flex-col gap-5 px-10 py-8 border rounded-xl md:px-16 sm:py-20">
          <b>Exceptional Customer Service</b>
          <p className="text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
            quos nisi, deserunt cum adipisci minima?
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
