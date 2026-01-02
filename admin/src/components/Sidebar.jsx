import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { Coins } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          className="flex items-center gap-3 px-3 py-2 border border-r-0 rounded border-to-grounded-lg"
          to={"/add"}
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 px-3 py-2 border border-r-0 rounded border-to-grounded-lg"
          to={"/list"}
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="hidden md:block">List Items</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 px-3 py-2 border border-r-0 rounded border-to-grounded-lg"
          to={"/orders"}
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="hidden md:block">Orders</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 px-3 py-2 border border-r-0 rounded border-to-grounded-lg"
          to={"/finance"}
        >
          <Coins className="w-5 h-5" />
          <p className="hidden md:block">Finance</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 px-3 py-2 border border-r-0 rounded border-to-grounded-lg"
          to={"/hero-slides"}
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="hidden md:block">Hero Slides</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
