import React from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { daoLogo } from "../assets";
import { nft1, nft2 } from "../assets";

const Login = () => {
  return (
    <div className="h-full w-full gradient-bg-hero">
      <nav className="flex justify-between items-center mx-8">
        <div className="flex flex-row justify-start items-center">
          <Image
            className="w-8 cursor-pointer"
            src={daoLogo}
            alt="Dao Logo"
            width={100}
            height={100}
          />
          <span className="text-white text-2xl font-extrabold">NFT</span>
        </div>

        <ConnectButton />
      </nav>
      <section>
        <div
          className="bg-[url('https://cdn.pixabay.com/photo/2022/03/01/02/51/galaxy-7040416_960_720.png')]
        bg-no-repeat bg-cover"
        >
          <div className="flex flex-col justify-center items-center mx-auto py-10">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-white text-4xl font-bold text-center">
                The greatest <br />
                <span className="text-gradient text-5xl">DAO</span> Community
              </h1>

              <p className="text-white font-semibold text-sm mt-3">
                Mint an NFT to be part and grow together.
              </p>

              <div className="pt-10 m-[8px] lg:w-[700px] w-[150px] text-center rounded lg:flex lg:flex-row flex flex-col gap-10 lg:gap-20 justify-center items-center">
                <div className="border rounded-xl overflow-hidden relative">
                  <div className="w-full h-full">
                    <Image
                      src={nft1}
                      width={200}
                      height={200}
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <div className="bg-[#3a3a43] text-white lg:flex lg:flex-col mt-[-6px] hidden">
                      <div className="py-4 overflow-hidden max-w-[600px]">
                        <p className="text-lg font-bold">Member Dao</p>
                      </div>
                      <div className="p-2 overflow-hidden max-w-[600px]">
                        <p className="text-gray-400 text-sm">
                          Vote in proposals
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border rounded-xl overflow-hidden relative">
                  <div className="w-full h-full">
                    <Image
                      src={nft2}
                      width={200}
                      height={200}
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <div className="bg-[#3a3a43] text-white lg:flex lg:flex-col mt-[-6px] hidden">
                      <div className="py-4 overflow-hidden max-w-[600px]">
                        <p className="text-lg font-bold">Vip Dao</p>
                      </div>
                      <div className="p-2 overflow-hidden max-w-[600px]">
                        <p className="text-gray-400 text-sm">
                          Vote and create proposals
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-white text-sm font-medium text-center pt-10">
                Mint one of our amazing NFTs to be part of this amazing
                Community <br /> Each have uniques properties but you will have
                access to vote on proposals <br /> and create ones and make
                money together 🤑
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
