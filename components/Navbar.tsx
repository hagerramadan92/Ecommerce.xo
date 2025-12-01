"use client";
import CateNavbar from "./cateNavbar";
import LangNavbar from "./langNavbar";
import SearchNavbar from "./searchNavbar";

export default function Navbar() {
  return (
    <>
      {/* <LangNavbar /> */}
      <div className=" fixed top-0 start-0 end-0 w-full bg-white shadow z-50  ">
        <SearchNavbar />
        <CateNavbar />
      </div>
    </>
  );
}
