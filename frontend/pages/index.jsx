import Head from "next/head";
import styles from "../styles/Home.module.css";
import Login from "../components/Login";

import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected, address } = useAccount();
  const { pathname, query, push, reload } = useRouter();

  useEffect(() => {
    if (isConnected) {
      push("/Dashboard");
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

      <footer className={styles.footer}>Made with &#10084; by Juanchi</footer>
    </div>
  );
}
