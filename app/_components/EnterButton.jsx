import Link from "next/link";

export default function EnterButton() {
  return (
    <div className="absolute top-0 left-0  w-full h-full flex justify-center items-center ">
      <Link href={"/browse"}>
        <div className="rounded-md text-transparent hover:text-white hover:bg-orange-400 transition duration-950 ease-out hover:ease-out">
          <h1 className="text-[15vw] leading-none">{">ENTER_"}</h1>
        </div>
      </Link>
    </div>
  );
}
