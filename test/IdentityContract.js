const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("IdentityContract", function () {
  let IdentityContract;
  let identityContract;
  let owner;
  let addr1;

  beforeEach(async function () {
    IdentityContract = await ethers.getContractFactory("IdentityContract");
    [owner, addr1] = await ethers.getSigners();

    identityContract = await IdentityContract.deploy();
    await identityContract.deployed();
  });

  it("should mint an identity NFT", async function () {
    await identityContract.mintIdentity("Alice", "Address 1", "Credentials", "Achievements");
    
    const balance = await identityContract.balanceOf(owner.address);
    expect(balance).to.equal(1);
    
    const identity = await identityContract.getIdentity(owner.address);
    expect(identity[0]).to.equal("Alice");
    expect(identity[1]).to.equal("Address 1");
    expect(identity[2]).to.equal("Credentials");
    expect(identity[3]).to.equal("Achievements");
  });

  it("should update the identity information", async function () {
    await identityContract.mintIdentity("Alice", "Address 1", "Credentials", "Achievements");
    const newName = "Alice Updated";
    const newAddress = "Address 2";

    await identityContract.updateIdentity(newName, newAddress, "Updated Credentials", "Updated Achievements");

    const identity = await identityContract.getIdentity(owner.address);
    expect(identity[0]).to.equal(newName);
    expect(identity[1]).to.equal(newAddress);
    expect(identity[2]).to.equal("Updated Credentials");
    expect(identity[3]).to.equal("Updated Achievements");
  });

  it("should add a friend", async function () {
    const friend = addr1.address;

    await identityContract.mintIdentity("Alice", "Address 1", "Credentials", "Achievements");
    await identityContract.addFriend(friend);

    const identity = await identityContract.getIdentity(owner.address);
    expect(identity[4]).to.deep.equal([friend]);
  });
});
