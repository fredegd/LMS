"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Menu, LogIn, LogOut } from "lucide-react";
import SearchBar from "./SearchBar";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isSignedIn = Boolean(session?.user);

  return (
    <header className="sticky top-0 z-40 ml-0 sm:ml-[var(--sidebar-w)] h-[var(--header-h)] border-b border-gray-200/60 bg-white/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between gap-4 px-4 md:px-6">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="p-1.5 -ml-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors sm:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <SearchBar />

        <div className="shrink-0">
          {isLoading ? (
            <div className="h-8 w-16 rounded-md skeleton" />
          ) : !isSignedIn ? (
            <button
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              onClick={() => router.push("/sign-in")}
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden xs:inline">Login</span>
            </button>
          ) : (
            <button
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden xs:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
