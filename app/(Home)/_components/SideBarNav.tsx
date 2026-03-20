"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Search, Layout, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
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
    <div className="h-full w-full bg-gray-950 flex flex-col overflow-y-auto relative">
      {/* Logo area */}
      <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} px-3 py-4 border-b border-white/10 h-16`}>
        <Link href="/" onClick={closeMobile} className="flex items-center gap-2 min-w-0">
          <Image
            src="/logo.svg"
            alt="logo"
            width={32}
            height={32}
            className={`shrink-0 ${isCollapsed ? "block" : "md:hidden"}`}
            loading="eager"
          />
          {!isCollapsed && (
            <Image
              src="/cs_logo.svg"
              alt="logo"
              width={130}
              height={40}
              className="hidden md:block brightness-0 invert"
              loading="eager"
            />
          )}
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
        <div className={`hidden sm:flex px-2 py-1 ${isCollapsed ? "justify-center" : "justify-end"} border-b border-white/5 bg-white/5`}>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      )}

      {/* Navigation links */}
      <nav className="flex flex-col gap-1 p-2 mt-1">
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
              {!isCollapsed && <span className="hidden md:inline">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto" />
    </div>
  );
}
