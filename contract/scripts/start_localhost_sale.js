const hre = require("hardhat");

async function main() {
  const CONTRACT_ID = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const CFNFT = await hre.ethers.getContractAt("CFNFT", CONTRACT_ID);

  const [owner] = await hre.ethers.getSigners()

  const contract = CFNFT.connect(owner);
  await contract.startSale()

  console.log("Started sale");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("something went wrong")
    console.error(error);
    process.exit(1);
  });
