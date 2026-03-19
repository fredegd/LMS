"use client";

import React, { useState, useCallback } from "react";
import SideBarNav from "../_components/SideBarNav";
import Header from "../_components/Header";

export default function HomeLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden sm:flex sm:w-[var(--sidebar-w)] flex-col">
        <SideBarNav />
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
      <Header onMenuClick={openMobile} />

      {/* Main content */}
      <main className="ml-0 sm:ml-[var(--sidebar-w)] pt-2 px-4 pb-8 md:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
