const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Test Dao NFT Contract", async () => {
  async function deployContractFixture() {
    const [owner, addr1, addr2] = await hre.ethers.getSigners();

    memberNftContractFactory = await ethers.getContractFactory("DaoNftMember");
    memberNftContract = await memberNftContractFactory.deploy(
      "http://localhost:3000/api/metadataMemberNft/"
    );
    await memberNftContract.deployed();

    vipNftContractFactory = await ethers.getContractFactory("DaoNftVip");
    vipNftContract = await vipNftContractFactory.deploy(
      "http://localhost:3000/api/metadataVipNft/"
    );
    await vipNftContract.deployed();

    tokenContractFactory = await ethers.getContractFactory("CryptoDaoToken");
    tokenContract = await tokenContractFactory.deploy(
      memberNftContract.address,
      vipNftContract.address
    );
    await tokenContract.deployed();

    marketplaceContractFactory = await ethers.getContractFactory("Marketplace");
    marketplaceContract = await marketplaceContractFactory.deploy();
    await marketplaceContract.deployed();

    daoNftContractFactory = await ethers.getContractFactory("NftDAO");
    daoNftContract = await daoNftContractFactory.deploy(
      marketplaceContract.address,
      memberNftContract.address,
      vipNftContract.address,
      tokenContract.address,
      { value: hre.ethers.utils.parseEther("1") }
    );
    await daoNftContract.deployed();

    return {
      daoNftContract,
      marketplaceContract,
      tokenContract,
      memberNftContract,
      vipNftContract,
      owner,
      addr1,
      addr2,
    };
  }

  describe("Initialized variables", () => {
    it("should be 0 proposals at the start", async () => {
      const {
        daoNftContract,
        marketplaceContract,
        tokenContract,
        memberNftContract,
        vipNftContract,
        owner,
        addr1,
        addr2,
      } = await loadFixture(deployContractFixture);

      expect(await daoNftContract.numProposals()).to.equal(0);
    });
  });

  describe("Create proposal function", () => {
    it("should create a proposal succesfully and let create a proposal if the msg.sender is the owner and don't have any NFT", async () => {
      const {
        daoNftContract,
        marketplaceContract,
        tokenContract,
        memberNftContract,
        vipNftContract,
        owner,
        addr1,
        addr2,
      } = await loadFixture(deployContractFixture);

      await daoNftContract.createProposal("Title 1", "Description1", 0, 10);

      const numProposals = await daoNftContract.numProposals();
      expect(numProposals).to.equal(1);

      const proposal = await daoNftContract.proposals(numProposals - 1);
      expect(proposal.title).to.equal("Title 1");
      expect(proposal.description).to.equal("Description1");
      expect(proposal.creator).to.equal(owner.address);
    });

    it("should allow another wallet that is not the owner to create proposals if they have the vipNFT", async () => {
      const {
        daoNftContract,
        marketplaceContract,
        tokenContract,
        memberNftContract,
        vipNftContract,
        owner,
        addr1,
        addr2,
      } = await loadFixture(deployContractFixture);

      await vipNftContract
        .connect(addr1)
        .mint({ value: hre.ethers.utils.parseEther("0.05") });

      await daoNftContract
        .connect(addr1)
        .createProposal("Title 1", "Description1", 0, 10);

      const numProposals = await daoNftContract.numProposals();
      expect(numProposals).to.equal(1);
    });

    it("should not allow the msg.sender create a proposal if is not the owner and doesn't have the vipNFT", async () => {
      const {
        daoNftContract,
        marketplaceContract,
        tokenContract,
        memberNftContract,
        vipNftContract,
        owner,
        addr1,
        addr2,
      } = await loadFixture(deployContractFixture);

      await expect(
        daoNftContract
          .connect(addr1)
          .createProposal("Title 1", "Description1", 0, 10)
      ).to.be.revertedWith("NOT_A_DAO_MEMBER");
    });

    it("should revert the call function if the _nftTokenId passed to the createProposal function is already sold in the marketplace", async () => {
      const {
        daoNftContract,
        marketplaceContract,
        tokenContract,
        memberNftContract,
        vipNftContract,
        owner,
        addr1,
        addr2,
      } = await loadFixture(deployContractFixture);

      await memberNftContract.mint({
        value: hre.ethers.utils.parseEther("0.01"),
      });

      await tokenContract.mint(1, {
        value: hre.ethers.utils.parseEther("0.1"),
      });

      await daoNftContract.createProposal("Title 1", "Description1", 0, 1);
      await daoNftContract.voteOnProposal(0, 0);
      await ethers.provider.send("evm_increaseTime", [60]);
      await daoNftContract.executeProposal(0);

      await expect(
        daoNftContract.createProposal("Title 1", "Description1", 0, 1)
      ).to.be.revertedWith("NFT_NOT_FOR_SALE");
    });
  });
});
