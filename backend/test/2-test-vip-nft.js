const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Test Vip NFT Contract", async () => {
  async function deployContractFixture() {
    const [owner, addr1, addr2] = await hre.ethers.getSigners();

    vipNftContractFactory = await ethers.getContractFactory("DaoNftVip");
    vipNftContract = await vipNftContractFactory.deploy(
      "http://localhost:3000/api/metadataVipNft/"
    );
    await vipNftContract.deployed();

    return { vipNftContract, owner, addr1, addr2 };
  }

  describe("Initialized variables", () => {
    it("should have the correct name and symbol", async () => {
      const { vipNftContract, owner, addr1, addr2 } = await loadFixture(
        deployContractFixture
      );

      const name = await vipNftContract.name();
      const symbol = await vipNftContract.symbol();
      expect(name).to.equal("Dao NFT");
      expect(symbol).to.equal("DAO");
    });

    it("should have the correct metadata link", async () => {
      const { vipNftContract, owner, addr1, addr2 } = await loadFixture(
        deployContractFixture
      );

      const metadata = await vipNftContract._baseTokenURI();
      expect(metadata).to.equal("http://localhost:3000/api/metadataVipNft/");
    });
  });

  describe("Mint Function", () => {
    it("should mint an NFT", async function () {
      const { vipNftContract, owner, addr1, addr2 } = await loadFixture(
        deployContractFixture
      );

      const tokenId = await vipNftContract.tokenIds();
      expect(tokenId.toNumber()).to.equal(0);

      await vipNftContract.connect(owner).mint({
        value: hre.ethers.utils.parseEther("0.05"),
      });

      const balance = await vipNftContract.balanceOf(owner.address);
      expect(balance.toNumber()).to.equal(1);

      const newTokenId = await vipNftContract.tokenIds();
      expect(newTokenId.toNumber()).to.equal(1);

      const ownerOf = await vipNftContract.ownerOf(newTokenId.toNumber());
      expect(ownerOf).to.equal(owner.address);
    });

    it("should not allow the same user to mint more than one NFT", async function () {
      const { vipNftContract, owner, addr1, addr2 } = await loadFixture(
        deployContractFixture
      );

      await vipNftContract
        .connect(addr1)
        .mint({ value: hre.ethers.utils.parseEther("0.05") });

      await expect(
        vipNftContract
          .connect(addr1)
          .mint({ value: hre.ethers.utils.parseEther("0.05") })
      ).to.be.rejectedWith(Error);

      const balance = await vipNftContract.balanceOf(addr1.address);
      expect(balance.toNumber()).to.equal(1);
    });

    it("should not allow the mint an NFT if the ether amount sent is not correct", async function () {
      const { vipNftContract, owner, addr1, addr2 } = await loadFixture(
        deployContractFixture
      );

      await expect(
        vipNftContract
          .connect(addr1)
          .mint({ value: hre.ethers.utils.parseEther("0.001") })
      ).to.be.rejectedWith(Error);
    });
  });
});
