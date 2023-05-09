import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSigner } from "wagmi";
import { ethers } from "ethers";
import { CRYPTODAO_NFT_ABI } from "../constants1";
import { useStateContext } from "../context";
import { toast } from "react-toastify";

const CustomCard = ({
  nftName,
  nftDescription,
  nftPrice,
  nftImage,
  nftAddress,
}) => {
  const { data: signer } = useSigner();

  const {
    isNftMemberOwner,
    setIsNftMemberOwner,
    isNftVipOwner,
    setIsNftVipOwner,
  } = useStateContext();

  const buyNFT = async () => {
    try {
      const nftContractInterface = new ethers.Contract(
        nftAddress,
        CRYPTODAO_NFT_ABI,
        signer
      );
      await nftContractInterface.mint({
        value: ethers.utils.parseEther(nftPrice),
      });

      if (nftName === "Crypto DAO Member") {
        setIsNftMemberOwner(true);
      }

      if (nftName === "Crypto DAO Vip") {
        setIsNftVipOwner(true);
      }
      toast.info("⏳ Buying Nft ⏳", {
        position: "top-center",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error(error);
      toast.error(`🦄 Upss!, ${error.reason}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden cursor-pointer relative">
      <button
        onClick={() => buyNFT()}
        disabled={
          (nftName === "Crypto DAO Member" && isNftMemberOwner) ||
          (nftName === "Crypto DAO Vip" && isNftVipOwner)
        }
      >
        <div className="w-full h-full absolute flex justify-center items-center flex-col">
          <div className="text-gradient bg-gradient-to-br from-purple-800 to-green-500 text-transparent inline-block bg-clip-text text-3xl font-black">
            <h1>
              {(nftName === "Crypto DAO Member" && isNftMemberOwner) ||
              (nftName === "Crypto DAO Vip" && isNftVipOwner)
                ? "You already own"
                : "BUY"}
            </h1>
            <h1>
              {(nftName === "Crypto DAO Member" && isNftMemberOwner) ||
              (nftName === "Crypto DAO Vip" && isNftVipOwner)
                ? "this NFT"
                : `${nftPrice} MATIC`}
            </h1>
          </div>
        </div>
        <div className="w-full h-full hover:opacity-5 transition-opacity">
          <Image
            src={nftImage}
            width={500}
            height={500}
            style={{
              objectFit: "cover",
            }}
          />
          <div className="bg-black text-white flex flex-col mt-[-6px]">
            <div className="py-4 overflow-hidden max-w-[600px]">
              <p className="text-lg font-semibold">{nftName}</p>
            </div>
            <div className="p-2 overflow-hidden max-w-[600px]">
              <p className="text-gray-400 text-sm">{nftDescription}</p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default CustomCard;
