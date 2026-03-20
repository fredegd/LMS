"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Search, Layout, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface MenuItem {
  id: number;
  name: string;
  icon: React.ElementType;
  path: string;
  protected?: boolean;
}

const menuList: MenuItem[] = [
  { id: 1, name: "Browse", icon: Search, path: "/browse" },
  { id: 2, name: "Dashboard", icon: Layout, path: "/dashboard", protected: true },
];

interface SideBarNavProps {
  closeMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function SideBarNav({ closeMobile, isCollapsed, onToggleCollapse }: SideBarNavProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user;

  return (
    <div className="h-full w-full bg-gray-950 flex flex-col relative"> {/* Removed overflow-y-auto to prevent clipping the toggle button */}
      {/* Logo area */}
      <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} px-3 py-4 border-b border-white/10 h-16`}>
        <Link 
          href="/" 
          onClick={closeMobile} 
          className="flex items-center min-w-0 font-mono text-xl font-bold text-white group"
        >
          <span className="text-orange-500 shrink-0 select-none">
            {">"}
          </span>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap flex items-center ${
              isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-0.5"
            }`}
          >
            <span>SNIPPETS</span>
          </div>
          <span className="text-orange-500 shrink-0 animate-pulse select-none">_</span>
        </Link>

        {closeMobile && (
          <button
            onClick={closeMobile}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors sm:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Toggle button area */}
      {onToggleCollapse && (
        <div className="absolute top-20 right-0 w-0 h-0 z-[70] hidden sm:block">
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center h-6 w-6 rounded-full text-gray-400 hover:text-white bg-gray-900 border border-white/20 hover:border-orange-500/50 transition-all z-50 absolute -right-3 -translate-y-1/2 shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 group/toggle"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <div className="absolute inset-0 rounded-full bg-orange-500/0 group-hover/toggle:bg-orange-500/10 transition-colors" />
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5 relative z-10" /> : <ChevronLeft className="h-3.5 w-3.5 relative z-10" />}
          </button>
        </div>
      )}

        {/* Navigation links - Scrollable section */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-2">
          <nav className="flex flex-col gap-1 p-2">
        {menuList.map((item) => {
          if (item.protected && !user) return null;

          const isActive = pathname?.startsWith(item.path) || false;

          return (
            <Link
              href={item.path}
              key={item.id}
              onClick={closeMobile}
              title={isCollapsed ? item.name : undefined}
              className={`
                flex items-center ${isCollapsed ? "justify-center" : "gap-3"} px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? "bg-orange-500/15 text-orange-400"
                  : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
                }
              `}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
          </nav>
        </div>

      <div className="mt-auto" />
    </div>
  );
}
