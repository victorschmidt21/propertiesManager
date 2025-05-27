import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Building2,
  Receipt,
  Wallet,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/contexts/AuthContext";

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={cn(
        "bg-sidebar text-sidebar-foreground h-screen transition-all duration-300 flex flex-col border-r border-sidebar-border fixed z-40",
        collapsed ? "w-[80px]" : "w-[250px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-xl font-bold text-black">Investimento X</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {!collapsed && (
        <div className="py-2 px-4 border-b border-sidebar-border">
          <div className="text-sm text-black">
            <p className="font-semibold">{user?.username}</p>
          </div>
        </div>
      )}

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          <SidebarItem
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
            path="/"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Building2 className="h-5 w-5" />}
            label="Meus Imóveis"
            path="/properties"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Receipt className="h-5 w-5" />}
            label="Receitas"
            path="/incomes"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Wallet className="h-5 w-5" />}
            label="Despesas"
            path="/expenses"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<User className="h-5 w-5" />}
            label="Proprietários"
            path="/owners"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<UserPen className="h-5 w-5" />}
            label="Perfil"
            path="/settings"
            collapsed={collapsed}
          />
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="link"
          className={cn(
            "w-full text-sidebar-foreground hover:bg-sidebar-accent flex items-center justify-start gap-3",
            collapsed && "justify-center p-2"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  );
};

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  path: string;
  collapsed: boolean;
};

const SidebarItem = ({ icon, label, path, collapsed }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <li>
      <Link
        to={path}
        className={cn(
          "flex items-center p-2 rounded-md transition-colors",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          collapsed ? "justify-center" : "justify-start"
        )}
      >
        <div className="flex items-center">{icon}</div>
        {!collapsed && <span className="ml-3 hover:border-b-2 hover:border-black">{label}</span>}
      </Link>
    </li>
  );
};

export default Sidebar;
