// async function main() {
//   const IdentityContract = await ethers.getContractFactory("IdentityContract");
//   console.log("Deploying IdentityContract...");
//   const identityContract = await IdentityContract.deploy();
//   await identityContract.deployed();
//   console.log("IdentityContract deployed to:", identityContract.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });


const hre = require("hardhat");

async function main() {
  const IdentityContract = await hre.ethers.getContractFactory("IdentityContract");
  const identityContract = await IdentityContract.deploy();

  await identityContract.deployed();

  console.log("IdentityContract deployed to:", identityContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });