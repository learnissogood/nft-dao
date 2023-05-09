import React from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { daoLogo } from "../assets";

const Login = () => {
  return (
    <div className="flex flex-col h-[90vh] items-center justify-center">
      <h1 className="bg-gradient-to-r from-[#5b4e78] via-green-500 to-[#16aa91] text-7xl inline-block text-transparent bg-clip-text font-extrabold">Welcome to NFT</h1>
      <Image height={200} width={200} src={daoLogo} />
      <ConnectButton />
    </div>
  );
};

export default Login;
