import React from "react";
import { useBalance } from "wagmi";
import { useIsMounted } from "../hooks/useIsMounted";

const Balance = ({ token, address }) => {
  const mounted = useIsMounted();

  let balance;

  if (token) {
    balance = useBalance({ address: address, token: token });
  } else {
    balance = useBalance({ address: address });
  }

  return (
    <div className="w-full text-left mt-2 ml-2">
      <p>
        {mounted
          ? token && balance && !balance?.isLoading
            ? `Balance ${balance?.data?.formatted} CDT`
            : `Balance ${balance?.data?.formatted} MATIC`
          : null}
      </p>
    </div>
  );
};

export default Balance;
