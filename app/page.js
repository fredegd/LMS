import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import TextAnimation from "./_components/TextAnimation";
import EnterButton from "./_components/EnterButton";

export default function Home() {
  return (
    <div className="bg-white w-full h-screen overflow-scroll">
      <div className="w-full flex items-center justify-center h-16 border-b">
        <Image src={"/cs_logo.svg"} alt={"logo"} width={300} height={0} />
      </div>

      <UserButton afterSignOutUrl="/" />
      <div className="w-full flex flex-col items-center justify-center relative">
        <TextAnimation />
        <EnterButton />
      </div>
    </div>
  );
}
