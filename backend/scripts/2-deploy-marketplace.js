async function main() {
  // Deploy the FakeNFTMarketplace contract first
  const Marketplace = await hre.ethers.getContractFactory(
    "Marketplace"
  );
  const nftMarketplace = await Marketplace.deploy();
  await nftMarketplace.deployed();

  console.log("Marketplace deployed to: ", nftMarketplace.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
