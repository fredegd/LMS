import React from "react";
import SideBarNav from "../_components/SideBarNav";
import Header from "../_components/Header";

export default function HomeLayout({ children }) {
  return (
    <div>
      <div className="h-full  flex flex-col fixed  inset-y-0 z-50 hidden sm:block">
        <SideBarNav />
      </div>
      <Header />
      <div className="ml-0 sm:ml-24 md:ml-64 p-5">{children}</div>
    </div>
  );
}
