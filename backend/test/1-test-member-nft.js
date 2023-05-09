const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Test Member NFT Contract", async () => {
  async function deployContractFixture() {
    const [owner, addr1, addr2] = await hre.ethers.getSigners();

    memberNftContractFactory = await ethers.getContractFactory("DaoNftMember");
    memberNftContract = await memberNftContractFactory.deploy(
      "http://localhost:3000/api/metadataMemberNft/"
    );
    await memberNftContract.deployed();

    return { memberNftContract, owner, addr1, addr2 };
  }

  describe("Initialized variables", () => {
    it("should have the correct name and symbol", async () => {
      const { memberNftContract, owner, addr1, addr2 } = await loadFixture(
        deployContractFixture
      );

      const name = await memberNftContract.name();
      const symbol = await memberNftContract.symbol();
      expect(name).to.equal("Dao NFT");
      expect(symbol).to.equal("DAO");
    });

    it("should have the correct metadata link", async () => {
      const { memberNftContract, owner, addr1, addr2 } = await loadFixture(
        deployContractFixture
      );

      const metadata = await memberNftContract._baseTokenURI();
      expect(metadata).to.equal("http://localhost:3000/api/metadataMemberNft/");
    });
  });

  describe("Mint Function", () => {
    it("should mint an NFT", async function () {
      const { memberNftContract, owner, addr1, addr2 } = await loadFixture(
        deployContractFixture
      );

      const tokenId = await memberNftContract.tokenIds();
      expect(tokenId.toNumber()).to.equal(0);

      await memberNftContract.connect(owner).mint({
        value: hre.ethers.utils.parseEther("0.01"),
      });

      const balance = await memberNftContract.balanceOf(owner.address);
      expect(balance.toNumber()).to.equal(1);

      const newTokenId = await memberNftContract.tokenIds();
      expect(newTokenId.toNumber()).to.equal(1);

      const ownerOf = await memberNftContract.ownerOf(newTokenId.toNumber());
      expect(ownerOf).to.equal(owner.address);
    });

    it("should not allow the same user to mint more than one NFT", async function () {
      const { memberNftContract, owner, addr1, addr2 } = await loadFixture(
        deployContractFixture
      );

      await memberNftContract
        .connect(addr1)
        .mint({ value: hre.ethers.utils.parseEther("0.01") });

      await expect(
        memberNftContract
          .connect(addr1)
          .mint({ value: hre.ethers.utils.parseEther("0.01") })
      ).to.be.rejectedWith(Error);

      const balance = await memberNftContract.balanceOf(addr1.address);
      expect(balance.toNumber()).to.equal(1);
    });

    it("should not allow the mint an NFT if the ether amount sent is not correct", async function () {
      const { memberNftContract, owner, addr1, addr2 } = await loadFixture(
        deployContractFixture
      );

      await expect(
        memberNftContract
          .connect(addr1)
          .mint({ value: hre.ethers.utils.parseEther("0.001") })
      ).to.be.rejectedWith(Error);
    });
  });
});
