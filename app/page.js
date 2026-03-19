"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import TextAnimation from "./_components/TextAnimation";
import EnterButton from "./_components/EnterButton";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="bg-white w-full h-screen overflow-scroll">
      <div className="w-full h-1/6 flex items-center justify-center border-b">
        <Image src={"/cs_logo.svg"} alt={"logo"} width={300} height={210} loading="eager" />
      </div>

      <div className="absolute right-6 top-6">
        {session?.user ? (
          <button
            className="rounded-md border px-4 py-2 hover:bg-gray-100"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </button>
        ) : (
          <Link
            href="/sign-in"
            className="rounded-md border px-4 py-2 hover:bg-gray-100"
          >
            Login
          </Link>
        )}
      </div>

      <div className="w-full h-5/6 flex flex-col items-center justify-center relative">
        <TextAnimation />
        <EnterButton />
      </div>
    </div>
  );
}
