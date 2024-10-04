import { toast } from "react-toastify";
import { assets } from "../assets/assets";

// eslint-disable-next-line react/prop-types
const Navbar = ({ setToken }) => {
  const logoutHandler = async (e) => {
    e.preventDefault();
    await setToken("");
    toast.success("Logout successful!");
  };

  return (
    <div className="flex items-center justify-between py-2 px-[4%]">
      <img className="w-[max(10%,80px)]" src={assets.logo} alt="" />
      <button
        onClick={logoutHandler}
        className="px-5 py-2 text-xs text-white bg-gray-600 rounded-full sm:px-7 sm:py-2 sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
