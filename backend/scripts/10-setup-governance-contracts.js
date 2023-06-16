const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

const { TIMELOCK_ADDRESS, GOVERNOR_CONTRACT, ADDRESS_ZERO } = require("../constants");

const main = async () => {
  const timeLockContract = await ethers.getContractAt(
    "TimeLock",
    TIMELOCK_ADDRESS
  );

  const deployerAddress = await ethers.getSigner();

  console.log("Setting up roles...");
  const proposerRole = await timeLockContract.PROPOSER_ROLE();
  const executorRole = await timeLockContract.EXECUTOR_ROLE();
  const adminRole = await timeLockContract.TIMELOCK_ADMIN_ROLE();

  const proposerTx = await timeLockContract.grantRole(proposerRole, GOVERNOR_CONTRACT);
  await proposerTx.wait(1);
  const executorTx = await timeLockContract.grantRole(executorRole, ADDRESS_ZERO);
  await executorTx.wait(1);
  const revokeTx = await timeLockContract.revokeRole(adminRole, deployerAddress.address);
  await revokeTx.wait(1);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
