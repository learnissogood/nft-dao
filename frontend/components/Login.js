import React from "react";
import styles from "../styles/Login.module.css";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { daoLogo } from "../assets";

const Login = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Welcome to NFT</div>
      <Image className="logo" height={200} width={200} src={daoLogo} />
      <ConnectButton />
    </div>
  );
};

export default Login;
