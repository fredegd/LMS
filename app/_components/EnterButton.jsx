import Link from "next/link";

export default function EnterButton() {
  return (
    <div className="relative md:absolute md:top-0 md:left-0  w-full h-full flex justify-center items-center ">
      <Link href={"/browse"}>
        <div className="p-1 pr-4 rounded-md text-white hover:shadow-2xl hover:shadow-black bg-orange-400 md:text-transparent md:bg-transparent hover:text-white hover:bg-orange-400 transition duration-950 ease-out hover:ease-out">
          <h1 className="text-[15vw] leading-none text-left">{">ENTER_"}</h1>
        </div>
      </Link>
    </div>
  );
}
