import React, { useState } from "react";
import { InputExchange, Balance } from "../components";
import { useAccount, useSigner } from "wagmi";
import { DAO_TOKEN_ABI } from "../constants1";
import { ethers } from "ethers";

import { toast } from "react-toastify";

const Exchange = () => {
  const [valueIn, setValueIn] = useState();
  const [valueOut, setValueOut] = useState("0.0");
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const onFromValueChange = (value) => {
    setValueIn(value);
    setValueOut(value * 10);
  };

  const swap = async () => {
    try {
      const daoTokenInterface = new ethers.Contract(
        process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
        DAO_TOKEN_ABI,
        signer
      );
      await daoTokenInterface.mint(valueOut, {
        value: ethers.utils.parseEther(valueIn),
      });
      toast.info("⏳ Swaping Tokens ⏳", {
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
      toast.error(`🦄 Upss!, ${error?.data?.message || error?.reason}`, {
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
    <>
      <div className="flex flex-col w-full items-center">
        <div className="mb-8">
          <InputExchange
            disabled={false}
            token="MATIC"
            value={valueIn}
            onChange={onFromValueChange}
            required={true}
            min="0.1"
            max="1"
          />
          <Balance address={address} />
        </div>

        <div className="mb-8">
          <div className="bg-[#3a3a43] lg:w-[400px] w-[245px] border-transparent sm:p-8 p-4 rounded-[20px] flex flex-row justify-between items-center">
            <h1 className="text-white/60 font-poppins font-black text-2xl">
              {valueOut}
            </h1>
            <h1 className="text-white font-poppins font-bold">CDT</h1>
          </div>
          <Balance address={address} token={process.env.NEXT_PUBLIC_TOKEN_ADDRESS} />
        </div>
        <button
          className="border-none outline-none px-6 font-poppins font-bold text-lg rounded-2xl leading-[24px] transition-all min-h-[56px] text-white bg-[#1dc071]"
          onClick={() => swap()}
        >
          Swap
        </button>
      </div>
    </>
  );
};

export default Exchange;
