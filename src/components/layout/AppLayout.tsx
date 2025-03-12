
import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  MailCheck, 
  BarChart3, 
  FileText, 
  Users, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed z-50 top-4 left-4 p-2 rounded-full bg-primary text-primary-foreground shadow-lg"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}
      
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: isMobile ? -280 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? -280 : 0, opacity: isMobile ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "bg-sidebar min-h-screen text-sidebar-foreground w-64 flex flex-col",
              isMobile && "fixed z-40 shadow-xl"
            )}
          >
            <div className="p-6">
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <MailCheck className="text-primary" />
                <span>Email QC</span>
              </h1>
            </div>
            
            <nav className="flex-1 px-4 pb-4">
              <ul className="space-y-1">
                <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                <NavItem to="/quality-check" icon={<MailCheck size={20} />} label="Quality Check" />
                <NavItem to="/reports" icon={<BarChart3 size={20} />} label="Reports" />
                <NavItem to="/templates" icon={<FileText size={20} />} label="Templates" />
                <NavItem to="/agents" icon={<Users size={20} />} label="Agents" />
                <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
              </ul>
            </nav>
            
            <div className="p-4 mt-auto">
              <div className="p-3 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground text-sm">
                <p className="font-medium">Email QC v1.0</p>
                <p className="text-xs opacity-70 mt-1">Evaluate email quality with precision</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300 overflow-x-hidden",
        sidebarOpen && !isMobile && "ml-64",
      )}>
        <div className="container py-8 max-w-[1600px] mx-auto px-4 sm:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
        "hover:bg-sidebar-accent",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
          : "text-sidebar-foreground/80"
      )}
      end={to === "/"}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  </li>
);

export default AppLayout;
