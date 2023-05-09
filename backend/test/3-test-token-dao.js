const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Test Token Dao Contract", async () => {
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

    return {
      tokenContract,
      memberNftContract,
      vipNftContract,
      owner,
      addr1,
      addr2,
    };
  }

  describe("Initialized variables", () => {
    it("should have the correct name and symbol", async () => {
      const { tokenContract, owner, addr1, addr2 } = await loadFixture(
        deployContractFixture
      );

      const name = await tokenContract.name();
      const symbol = await tokenContract.symbol();
      expect(name).to.equal("Crypto DAO Token");
      expect(symbol).to.equal("CDT");
    });
  });

  describe("Mint Function", () => {
    it("should mint the Token", async () => {
      const {
        tokenContract,
        memberNftContract,
        vipNftContract,
        owner,
        addr1,
        addr2,
      } = await loadFixture(deployContractFixture);

      const totalSuply = await tokenContract.totalSupply();
      expect(totalSuply.toNumber()).to.equal(0);

      await memberNftContract
        .connect(owner)
        .mint({ value: hre.ethers.utils.parseEther("0.01") });

      await tokenContract.connect(owner).mint(1, {
        value: hre.ethers.utils.parseEther("0.1"),
      });

      const balance = await tokenContract.balanceOf(owner.address);
      expect(balance).to.equal(hre.ethers.utils.parseEther("1"));

      const totalSuply2 = await tokenContract.totalSupply();
      expect(totalSuply2).to.equal(hre.ethers.utils.parseEther("1"));
    });

    it("should not allow the user mint tokens if not have any NFT", async () => {
      const {
        tokenContract,
        memberNftContract,
        vipNftContract,
        owner,
        addr1,
        addr2,
      } = await loadFixture(deployContractFixture);

      await expect(
        tokenContract.connect(owner).mint(1, {
          value: hre.ethers.utils.parseEther("0.1"),
        })
      ).to.be.revertedWith("Your are not a member of this DAO");
    });

    it("should not allow the user mint more than 10 tokens", async () => {
      const {
        tokenContract,
        memberNftContract,
        vipNftContract,
        owner,
        addr1,
        addr2,
      } = await loadFixture(deployContractFixture);

      await memberNftContract
        .connect(owner)
        .mint({ value: hre.ethers.utils.parseEther("0.01") });

      await expect(
        tokenContract.connect(owner).mint(11, {
          value: hre.ethers.utils.parseEther("1.1"),
        })
      ).to.be.revertedWith("You can't mint more than 10 CDT Tokens");
    });

    it("should not allow the user mint tokens if the ethers amount sent is incorrect", async () => {
      const {
        tokenContract,
        memberNftContract,
        vipNftContract,
        owner,
        addr1,
        addr2,
      } = await loadFixture(deployContractFixture);

      await memberNftContract
        .connect(owner)
        .mint({ value: hre.ethers.utils.parseEther("0.01") });

      await expect(
        tokenContract.connect(owner).mint(1, {
          value: hre.ethers.utils.parseEther("0.001"),
        })
      ).to.be.revertedWith("Ether sent is incorrect");
    });
  });
});
