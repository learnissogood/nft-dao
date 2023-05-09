const {
  DAO_NFT_MEMBER_CONTRACT_ADDRESS,
  DAO_NFT_VIP_CONTRACT_ADDRESS,
  MARKETPLACE_CONTRACT_ADDRESS,
  CRYPTO_DAO_CONTRACT_ADDRESS
} = require("../constants");

async function main() {

  const nftDaoContract = await hre.ethers.getContractFactory("NftDAO");

  // deploy the contract
  const deployedNftDaoContract = await nftDaoContract.deploy(
    MARKETPLACE_CONTRACT_ADDRESS,
    DAO_NFT_MEMBER_CONTRACT_ADDRESS,
    DAO_NFT_VIP_CONTRACT_ADDRESS,
    CRYPTO_DAO_CONTRACT_ADDRESS
  );

  // Wait for it to finish deploying
  await deployedNftDaoContract.deployed();

  // print the address of the deployed contract
  console.log(
    "NFT DAO Contract Address:",
    deployedNftDaoContract.address
  );
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
