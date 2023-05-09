import React, { useContext, createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount, useProvider } from "wagmi";
import { CRYPTODAO_NFT_ABI } from "../constants1";
import axios from "axios";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [isNftMemberOwner, setIsNftMemberOwner] = useState(true);
  const [isNftVipOwner, setIsNftVipOwner] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  const { address, isConnected } = useAccount();
  const provider = useProvider();

  const memberNftContractInstanceRead = new ethers.Contract(
    "0xE2d10dC33A319567FCe3f6537CC0BF9E38685d78",
    CRYPTODAO_NFT_ABI,
    provider
  );

  const vipNftContractInstanceRead = new ethers.Contract(
    "0x3B98cC2c2C22b33Ed11d5D9A20De2510b6667ef1",
    CRYPTODAO_NFT_ABI,
    provider
  );

  useEffect(() => {
    const checkUserNftsBalances = async () => {
      const memberNftBalance = await memberNftContractInstanceRead.balanceOf(
        address
      );
      const vipNftBalance = await vipNftContractInstanceRead.balanceOf(address);

      if (Number(memberNftBalance) === 0) {
        setIsNftMemberOwner(false);
      } else {
        setIsNftMemberOwner(true);
      }
      if (Number(vipNftBalance) === 0) {
        setIsNftVipOwner(false);
      } else {
        setIsNftVipOwner(true);
      }
    };

    if (isConnected) {
      checkUserNftsBalances();
    }
  }, []);

  useEffect(() => {
    const fetchProposals = async () => {
      setIsLoading(true);
      const data = await axios.get("http://localhost:3000/api/fetchProposals");
      console.log(data.data);
      setProposals(data.data);
      setIsLoading(false);
    };

    fetchProposals();
  }, []);

  return (
    <StateContext.Provider
      value={{
        isNftMemberOwner,
        setIsNftMemberOwner,
        isNftVipOwner,
        setIsNftVipOwner,
        isLoading,
        proposals,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
