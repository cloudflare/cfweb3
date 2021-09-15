const addressToFund = process.env.ADDRESS_TO_FUND || "0FDc6c84f5928ee00D894d90E398CC6f53871949"

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [wallet1] = await hre.ethers.getSigners()

  await wallet1.sendTransaction({
    to: addressToFund,
    value: ethers.utils.parseEther("10.0")
  })

  console.log("Transferred 10 ETH to ", addressToFund);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("something went wrong")
    console.error(error);
    process.exit(1);
  });
