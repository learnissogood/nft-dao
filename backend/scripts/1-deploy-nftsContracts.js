const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { METADATA_URL_MEMBER, METADATA_URL_VIP } = require("../constants");

async function main() {
  // URL from where we can extract the metadata for a Dao Crypto NFT
  const memberMetadataURL = METADATA_URL_MEMBER;
  // URL from where we can extract the metadata for a Dao Crypto NFT
  const vipMetadataURL = METADATA_URL_VIP;
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so daoCryptoNftContract here is a factory for instances of our DaoCrypto contract.
  */
  const daoCryptoNftMemberContract = await ethers.getContractFactory(
    "DaoNftMember"
  );
  const daoCryptoNftVipContract = await ethers.getContractFactory(
    "DaoNftVip"
  );

  // deploy the contracts
  const deployedDaoCryptoNftMemberContract =
    await daoCryptoNftMemberContract.deploy(memberMetadataURL);
  const deployedDaoCryptoNftVipContract = await daoCryptoNftVipContract.deploy(
    vipMetadataURL
  );

  // Wait for it to finish deploying
  await deployedDaoCryptoNftMemberContract.deployed();
  await deployedDaoCryptoNftVipContract.deployed();

  // print the addresses of the deployed contracts
  console.log(
    "Crypto DAO Member Contract Address:",
    deployedDaoCryptoNftMemberContract.address
  );
  console.log(
    "Crypto DAO Vip Contract Address:",
    deployedDaoCryptoNftVipContract.address
  );
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
