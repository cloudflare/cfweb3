const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CFNFT", function () {
  it("Should deploy", async function () {
    const CFNFT = await ethers.getContractFactory("CFNFT");
    const cfnft = await CFNFT.deploy();
    await cfnft.deployed();
  });

  it("Can mint", async function () {
    const CFNFT = await ethers.getContractFactory("CFNFT");
    const cfnft = await CFNFT.deploy();
    await cfnft.deployed();

    const accounts = await ethers.getSigners();
    const wallet = accounts[0]

    expect(cfnft.mintToken(1, wallet.address))
      .to.emit(cfnft, 'Minted')
      .withArgs(0, wallet.address);
  });

  it("Can check if a token exists", async function () {
    const CFNFT = await ethers.getContractFactory("CFNFT");
    const cfnft = await CFNFT.deploy();
    await cfnft.deployed();

    const accounts = await ethers.getSigners();
    const wallet = accounts[0]
    await cfnft.mintToken(1, wallet.address)

    expect(await cfnft.tokenExists(0))
      .to.eq(true)
  });

  it("Can get a token URI", async function () {
    const CFNFT = await ethers.getContractFactory("CFNFT");
    const cfnft = await CFNFT.deploy();
    await cfnft.deployed();

    const accounts = await ethers.getSigners();
    const wallet = accounts[0]
    await cfnft.mintToken(1, wallet.address)

    const id = 0

    expect(await cfnft.tokenURI(id))
      .to.eq(`https://nft.examples.workers.dev/nft/${id}`)
  });

  it("Can't mint if sale hasn't started", async function () {
    const CFNFT = await ethers.getContractFactory("CFNFT");
    const cfnft = await CFNFT.deploy();
    await cfnft.deployed();

    const [owner, addr1] = await ethers.getSigners();
    await expect(
      cfnft.connect(addr1).mintToken(1, addr1.address)
    ).to.be.revertedWith("sale hasn't started")
  });

  it("Non-owners can't do things", async function () {
    const CFNFT = await ethers.getContractFactory("CFNFT");
    const cfnft = await CFNFT.deploy();
    await cfnft.deployed();
    await cfnft.startSale()

    const [owner, addr1, addr2] = await ethers.getSigners();
    cfnft.connect(addr1).mintToken(1, addr1.address)
    await expect(
      cfnft.connect(addr2).transferFrom(addr1.address, addr2.address, 0)
    ).to.be.revertedWith("transfer caller is not owner nor approved")
  });

  it("Can't mint more than 3", async function () {
    const CFNFT = await ethers.getContractFactory("CFNFT");
    const cfnft = await CFNFT.deploy();
    await cfnft.deployed();
    await cfnft.startSale()

    const [owner, addr1] = await ethers.getSigners();
    await expect(
      cfnft.connect(addr1).mintToken(5, addr1.address)
    ).to.be.revertedWith("exceeds 3")
  });

  it("Can't mint once over limit", async function () {
    this.timeout(160000)

    const CFNFT = await ethers.getContractFactory("CFNFT");
    const cfnft = await CFNFT.deploy();
    await cfnft.deployed();
    await cfnft.startSale()

    const [owner, addr1] = await ethers.getSigners();
    for (let i = 0; i < 2048; i++) {
      cfnft.connect(addr1).mintToken(1, addr1.address)
    }

    await expect(
      cfnft.connect(addr1).mintToken(1, addr1.address)
    ).to.be.revertedWith("sold out")
  });
});
