const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const {
    MIN_DELAY
  } = require("../constants");

const main = async () => {
  const timeLockContractFactory = await ethers.getContractFactory(
    "TimeLock"
  );
  const timeLockContract = await timeLockContractFactory.deploy(
    MIN_DELAY,
    [],
    []
  );
  await timeLockContract.deployed();

  console.log(
    "TimeLock Contract Address: " + timeLockContract.address
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
