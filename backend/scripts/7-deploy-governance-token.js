const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

const main = async () => {
  const governanceTokenContractFactory = await ethers.getContractFactory(
    "DAOGovernanceToken"
  );
  const governanceTokenContract = await governanceTokenContractFactory.deploy();
  await governanceTokenContract.deployed();

  console.log(
    "GovernanceToken Contract Address: " + governanceTokenContract.address
  );

  const deployerAddress = await ethers.getSigner();
  console.log(deployerAddress.address);

  await delegate(governanceTokenContract.address, deployerAddress.address);
};

const delegate = async (governanceTokenAddress, delegatedAccount) => {
  const governaceToken = await ethers.getContractAt(
    "DAOGovernanceToken",
    governanceTokenAddress
  );
  const tx = await governaceToken.delegate(delegatedAccount);
  await tx.wait(1);
  console.log(
    `Checkpoints ${await governaceToken.numCheckpoints(delegatedAccount)}`
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
