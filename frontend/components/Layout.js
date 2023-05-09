import React, { useEffect } from "react";
import { Header, Sidebar } from "../components";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

const Layout = ({ children }) => {

  const { isConnected, address } = useAccount();
  const { pathname, query, push, reload } = useRouter();

  useEffect(() => {
    if (!isConnected) {
      push("/");
    }
  }, [isConnected]);

  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>
      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default Layout;
