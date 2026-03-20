"use client";

import React, { useState, useCallback } from "react";
import SideBarNav from "../_components/SideBarNav";
import Header from "../_components/Header";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleCollapse = useCallback(() => setIsCollapsed((prev) => !prev), []);

  // Compute the width to override the CSS variable on desktop
  const desktopSidebarWidth = isCollapsed ? "4.5rem" : "15rem";

  return (
    <div 
      className="min-h-screen bg-[#fafafa]"
      style={{ 
        ['--sidebar-w' as any]: desktopSidebarWidth 
      }}
    >
      {/* Desktop sidebar */}
      <aside 
        className="fixed inset-y-0 left-0 z-50 hidden sm:flex sm:w-[var(--sidebar-w)] flex-col transition-[width] duration-300 ease-in-out"
      >
        <SideBarNav 
          isCollapsed={isCollapsed} 
          onToggleCollapse={toggleCollapse} 
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
            onClick={closeMobile}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 sm:hidden">
            <SideBarNav closeMobile={closeMobile} />
          </aside>
        </>
      )}

      {/* Header */}
      <Header onMenuClick={openMobile} isCollapsed={isCollapsed} />

      {/* Main content */}
      <main className="ml-0 sm:ml-[var(--sidebar-w)] pt-2 px-4 pb-8 md:px-6 lg:px-8 transition-[margin-left] duration-300 ease-in-out">
        {children}
      </main>
    </div>
  );
}
