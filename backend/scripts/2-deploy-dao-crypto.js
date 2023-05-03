const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { METADATA_URL } = require("../constants");

async function main() {
  // URL from where we can extract the metadata for a Dao Crypto NFT
  const metadataURL = METADATA_URL;
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so daoCryptoNftContract here is a factory for instances of our DaoCrypto contract.
  */
  const daoCryptoNftContract = await ethers.getContractFactory("DaoCryptoNft");

  // deploy the contract
  const deployedDaoCryptoNftContract = await daoCryptoNftContract.deploy(
    metadataURL
  );

  // Wait for it to finish deploying
  await deployedDaoCryptoNftContract.deployed();

  // print the address of the deployed contract
  console.log(
    "Crypto DAO Contract Address:",
    deployedDaoCryptoNftContract.address
  );
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });