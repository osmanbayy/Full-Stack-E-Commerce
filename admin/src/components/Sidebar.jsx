import { NavLink, useLocation } from "react-router-dom";
import { 
  Coins, 
  Sliders, 
  Plus, 
  List, 
  ShoppingBag,
  LayoutDashboard
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/add", icon: Plus, label: "Add Items" },
    { path: "/list", icon: List, label: "List Items" },
    { path: "/orders", icon: ShoppingBag, label: "Orders" },
    { path: "/finance", icon: Coins, label: "Finance" },
    { path: "/hero-slides", icon: Sliders, label: "Hero Slides" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl z-40 flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Admin Panel</h2>
              <p className="text-xs text-slate-400">Dashboard</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50" 
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Version</p>
            <p className="text-sm font-semibold">1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[60px]
                  ${isActive 
                    ? "text-blue-600" 
                    : "text-gray-500"
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-all duration-200
                  ${isActive 
                    ? "bg-blue-50" 
                    : ""
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-blue-600" : "text-gray-500"}`}>
                  {item.label.split(" ")[0]}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
