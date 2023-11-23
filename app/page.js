import { UserButton } from "@clerk/nextjs";
import TextAnimation from "./_components/TextAnimation";
import Link from "next/link";
export default function Home() {
  return (
    <div className="bg-black text-white w-full h-full">
      Home
      <Link href={'/browse'}>
      <h1>ENTER</h1>
      </Link>
      <UserButton afterSignOutUrl="/" />
      <div className="w-full flex items-center justify-center">
        <TextAnimation />
      </div>

    </div>
  );
}
