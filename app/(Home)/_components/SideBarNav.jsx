"use client";
import { useState } from "react";
import { Search, Layout, Shield, Mail } from "lucide-react";
import Image from "next/image";

export default function SideBarNav() {
  const menuList = [
    {
      id: 1,
      name: "Browse",
      icon: Search,
      path: "/browse",
    },
    {
      id: 2,
      name: "Dashboard",
      icon: Layout,
      path: "/dashboard",
    },
    {
      id: 3,
      name: "Upgrade",
      icon: Shield,
      path: "/upgrade",
    },
    {
      id: 4,
      name: "Newsletter",
      icon: Mail,
      path: "/newsletter",
    },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="h-full  md:w-64 xs:w-32  b-white border-r flex flex-col overflow-y-auto shadow-md ">
      <div className="flex flex-col items-center justify-center h-16 border-b">
        <Image
          src={"/logo.svg"}
          className="w-3/4 hidden sm:block md:hidden"
          alt={"logo"}
          width={100}
          height={70}
        />
        <Image
          src={"/cs_logo.svg"}
          className="w-11/12 hidden md:block"
          alt={"logo"}
          width={100}
          height={70}
        />
      </div>
      <div className="flex flex-col">
        {menuList.map((item, index) => (
          <div
            key={index}
            className={`flex gap-2 items-center p-5 px-6 text-gray-500
          hover:bg-gray-100 cursor-pointer
          ${activeIndex === index ? "bg-orange-100 text-orange-500" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            <item.icon className="h-6 w-6" />
            <h2 className="md:flex hidden">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}