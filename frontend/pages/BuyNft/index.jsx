import React from "react";
import { Layout, CustomCard } from "../../components";
import { nft1, nft2 } from "../../assets";

import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

const BuyNft = () => {
  const nftsToSell = [
    {
      nftName: "Crypto DAO Member",
      nftDescription:
        "Crypto DAO Member is a collection that allows you vote in proposals in the NFT DAO Community",
      nftPrice: "0.01",
      nftImage: nft1,
      nftAddress: "0xE2d10dC33A319567FCe3f6537CC0BF9E38685d78",
    },
    {
      nftName: "Crypto DAO Vip",
      nftDescription:
        "Crypto DAO Vip is a collection that allows you vote in proposals and create proposals in the NFT DAO Community",
      nftPrice: "0.05",
      nftImage: nft2,
      nftAddress: "0x3B98cC2c2C22b33Ed11d5D9A20De2510b6667ef1",
    },
  ];

  return (
    <>
      <ToastContainer />
      <Layout>
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
          <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
            <h1 className="font-epilogue font-bold sm:text-[25px] text-[20px] leading-[38px] text-white text-center">
              Welcome to the DAO NFT Marketplace
            </h1>
          </div>
          <h2 className="font-epilogue font-bold sm:text-[20px] text-[14px] leading-[20px] text-white pt-8 text-center">
            Choose your NFT and become a member of our exclusive community!
          </h2>
          <div className="pt-10 m-[8px] lg:w-[700px] w-[300px] text-center rounded lg:flex lg:flex-row flex flex-col gap-10 lg:gap-20 justify-center items-center">
            {nftsToSell.map((nft) => (
              <CustomCard {...nft} />
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

BuyNft.getLayout = (page) => <Layout>{page}</Layout>;

export default BuyNft;
