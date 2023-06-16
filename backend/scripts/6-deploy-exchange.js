const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { CRYPTO_DAO_CONTRACT_ADDRESS } = require("../constants");

const main = async () => {
  const exchangeContractFactory = await ethers.getContractFactory("Exchange");
  const exchangeContract = await exchangeContractFactory.deploy(
    CRYPTO_DAO_CONTRACT_ADDRESS
  );
  await exchangeContract.deployed();

  console.log("Exchange Contract Address: " + exchangeContract.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
