import React, { useState } from "react";
import Image from "next/image";
import { useRouter, pathname } from "next/router";
import { sun, daoLogo } from "../assets";
import { navlinks } from "../constants";

const Icon = ({ styles, name, imgUrl, disabled, handleClick }) => {
  const { pathname } = useRouter();
  return (
    <div
      className={`w-[48px] h-[48px] rounded-[10px] ${
        pathname && pathname === "/" + name && "bg-[#2c2f32]"
      } flex justify-center items-center ${
        !disabled && "cursor-pointer"
      } ${styles}`}
      onClick={handleClick}
    >
      {!pathname ? (
        <Image src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
      ) : (
        <Image
          src={imgUrl}
          alt="fund_logo"
          className={`w-1/2 h-1/2 ${pathname !== "/" + name && "grayscale"}`}
        />
      )}
    </div>
  );
};

const Sidebar = () => {
  const { push } = useRouter();

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <div
        className="w-[60px] h-[60px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center pr-[4px]"
      >
        <Image src={daoLogo} alt="logo" />
      </div>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon
              key={link.name}
              {...link}
              handleClick={() => {
                if (!link.disabled) {
                  push(link.link);
                }
              }}
            />
          ))}
        </div>

        <Icon styles="bg-[#1c1c24] shadow-secondary" imgUrl={sun} />
      </div>
    </div>
  );
};

export default Sidebar;
