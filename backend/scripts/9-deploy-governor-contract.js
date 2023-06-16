const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const {
  VOTING_PERIOD,
  VOTING_DELAY,
  QUORUM_PERCENTAGE,
  GOVERNANCE_TOKEN_ADDRESS,
  TIMELOCK_ADDRESS,
} = require("../constants");

const main = async () => {
  const governorContractFactory = await ethers.getContractFactory(
    "GovernorContract"
  );
  const governorContract = await governorContractFactory.deploy(
    GOVERNANCE_TOKEN_ADDRESS,
    TIMELOCK_ADDRESS,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE
  );
  await governorContract.deployed();

  console.log("Governor Contract Address: " + governorContract.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
