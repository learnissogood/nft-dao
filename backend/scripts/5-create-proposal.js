const { NFTDAO_CONTRACT_ADDRESS } = require("../constants");

const CRYPTO_DAO_CONTRACT = require("../artifacts/contracts/NftDao.sol/NftDAO.json");

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.QUICKNODE_HTTP_URL
  );

  const signer = wallet.connect(provider);

  const contractInstance = new ethers.Contract(
    NFTDAO_CONTRACT_ADDRESS,
    CRYPTO_DAO_CONTRACT.abi,
    signer
  );

  const data = await contractInstance.createProposal(
    "testing from backend",
    "calling createProposal from backend script",
    0,
    10
  );

  console.log(data);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
