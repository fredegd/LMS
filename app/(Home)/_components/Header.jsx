"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SearchBar from "./SearchBar";

export default function Header() {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="sticky top-0 ml-0 sm:ml-24 md:ml-64 p-5 border-b flex items-center justify-between bg-white">
      <SearchBar />
      {!user ? (
        <button onClick={() => router.push("/sign-in")}>Login</button>
      ) : (
        <UserButton />
      )}
    </div>
  );
}
