"use client";

import Image from "next/image";
import TextAnimation from "./_components/TextAnimation";
import EnterButton from "./_components/EnterButton";
import React from "react";

export default function Home() {
  return (
    <div className="bg-white w-full h-screen overflow-scroll">
      <div className="w-full h-1/6 flex items-center justify-center border-b">
        <Image src={"/cs_logo.svg"} alt={"logo"} width={300} height={210} loading="eager" />
      </div>
      <div className="w-full h-5/6 flex flex-col items-center justify-center relative">
        <TextAnimation />
        <EnterButton />
      </div>
    </div>
  );
}
