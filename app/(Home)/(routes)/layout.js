import React from "react";
import SideBarNav from "../_components/SideBarNav";
import Header from "../_components/Header";

export default function HomeLayout({ children }) {
  return (
    <div>
      <div className="h-full fixed flex flex-row   inset-y-0 z-50 ">
        <SideBarNav />
      </div>
      <Header/>
        {children}
    </div>
  );
}
