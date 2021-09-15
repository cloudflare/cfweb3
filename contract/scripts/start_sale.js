const hre = require("hardhat");

const pk = process.env.dapk

async function main() {
  const CONTRACT_ID = "0x290422EC6eADc2CC12aCd98C50333720382CA86B";
  const CFNFT = await hre.ethers.getContractAt("CFNFT", CONTRACT_ID);

  const [owner] = await hre.ethers.getSigners()
  const signer = pk ? new hre.ethers.Wallet(pk, hre.ethers.provider) : owner

  const contract = CFNFT.connect(signer);
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
