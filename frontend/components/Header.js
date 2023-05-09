import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { daoLogo, menu, search } from "../assets";
import { navlinks } from "../constants";
import { useRouter } from "next/router";

const Header = () => {
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const inputRef = useRef(null);

  const { push, pathname } = useRouter();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search proposals"
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        />

        <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
          <Image
            src={search}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
      </div>
      <div className="lg:flex hidden">
        <ConnectButton />
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[50px] h-[50px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center pr-[3px]">
          <Image
            src={daoLogo}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>

        <Image
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  pathname === "/" + link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setToggleDrawer(false);
                  push(link.link);
                }}
              >
                <Image
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    pathname === "/" + link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    pathname === "/" + link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
