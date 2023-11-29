import { UserButton } from "@clerk/nextjs";
import TextAnimation from "./_components/TextAnimation";
import Link from "next/link";
import EnterButton from "./_components/EnterButton";
export default function Home() {
  return (
    <div className="bg-white text-orange-500 w-full h-screen overflow-scroll">
      Home

      <UserButton afterSignOutUrl="/" />
      <div className="w-full flex items-center justify-center relative">
        <TextAnimation />
        <EnterButton />
      </div>

    </div>
  );
}
