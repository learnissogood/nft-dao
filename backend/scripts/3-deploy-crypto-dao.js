const { ethers } = require("hardhat");
const {
  DAO_NFT_MEMBER_CONTRACT_ADDRESS,
  DAO_NFT_VIP_CONTRACT_ADDRESS,
} = require("../constants");

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so daoCryptoNftContract here is a factory for instances of our DaoCrypto contract.
  */
  const daoCryptoTokenContract = await ethers.getContractFactory(
    "CryptoDaoToken"
  );

  // deploy the contracts
  const deployedDaoCryptoTokenContract = await daoCryptoTokenContract.deploy(
    DAO_NFT_MEMBER_CONTRACT_ADDRESS,
    DAO_NFT_VIP_CONTRACT_ADDRESS
  );

  // Wait for it to finish deploying
  await deployedDaoCryptoTokenContract.deployed();

  // print the addresses of the deployed contracts
  console.log(
    "Crypto DAO Token Contract Address:",
    deployedDaoCryptoTokenContract.address
  );
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
