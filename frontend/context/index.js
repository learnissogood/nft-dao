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
    process.env.NEXT_PUBLIC_MEMBER_NFT_ADDRESS,
    CRYPTODAO_NFT_ABI,
    provider
  );

  const vipNftContractInstanceRead = new ethers.Contract(
    process.env.NEXT_PUBLIC_VIP_NFT_ADDRESS,
    CRYPTODAO_NFT_ABI,
    provider
  );

  const fetchProposals = async () => {
    setIsLoading(true);
    const data = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/fetchProposals`
    );
    setProposals(data.data);
    setIsLoading(false);
  };

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
        setIsLoading,
        proposals,
        fetchProposals
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
