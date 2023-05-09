import Head from "next/head";
import Login from "../components/Login";

import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  const { push } = useRouter();

  useEffect(() => {
    if (isConnected) {
      push("/Proposals");
    }
  }, [isConnected]);

  return (
    <div>
      <Head>
        <title>NFT DAO</title>
        <meta name="description" content="NFT DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Login />

      <footer className="flex p-[2rem] border-t-[1px] justify-center items-center">Made with &#10084; by Juanchi</footer>
    </div>
  );
}
