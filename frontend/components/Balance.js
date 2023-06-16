import React from "react";
import { useBalance } from "wagmi";
import { useIsMounted } from "../hooks/useIsMounted";

const Balance = ({ token, address }) => {
  const mounted = useIsMounted();

  const maticBalance = useBalance({ address: address });
  const tokenBalance = useBalance({ address: address, token: token });

  const displayBalance = () => {
    if (tokenBalance && !tokenBalance?.isLoading) {
      return `Balance ${
        token ? tokenBalance?.data?.formatted : maticBalance?.data?.formatted
      } ${token ? "CDT" : "MATIC"}`;
    }
  };

  return (
    <div className="w-full text-left mt-2 ml-2">
      <p>{mounted && displayBalance()}</p>
    </div>
  );
};

export default Balance;
