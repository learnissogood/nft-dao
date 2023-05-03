const hre = require("hardhat");
const { CRYPTODAO_NFT_CONTRACT_ADDRESS } = require("../constants");

//* How to change this file
/*
- Fill in the `ContractName` with your contract name.
- Uncomment the verification process if you want to verify your contract but make sure to uncomment the same in the `hardhat.config.js` and change the values as required.

You can pass in values into your contract like doing the following :
ex : Asssume you have a string and a number to pass
` const lock = await Lock.deploy("hello", 5);`
*/

//* Sample Deployment
/*
  const Lock = await hre.ethers.getContractFactory("ContractName");
  const lock = await Lock.deploy();

  await lock.deployed();

  console.log("Contract Deployed to : ", lock.address);

  console.log("Sleeping...");
  await sleep(50000);
  await hre.run("verify:verify", {
    address: lock.address,
    constructorArguments: [],
  });
*/

async function main() {
  // Deploy the FakeNFTMarketplace contract first
  const Marketplace = await ethers.getContractFactory(
    "Marketplace"
  );
  const nftMarketplace = await Marketplace.deploy();
  await nftMarketplace.deployed();

  console.log("Marketplace deployed to: ", nftMarketplace.address);

  // Now deploy the NFTDAO contract
  const NftDAO = await ethers.getContractFactory("NftDAO");
  const nftDAO = await NftDAO.deploy(
    nftMarketplace.address,
    CRYPTODAO_NFT_CONTRACT_ADDRESS,
    {
      // This assumes your metamask account has at least 1 ETH in its account
      // Change this value as you want
      value: ethers.utils.parseEther("0.5"),
    }
  );
  await nftDAO.deployed();

  console.log("NftDAO deployed to: ", nftDAO.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
