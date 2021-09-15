/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");

const pk = process.env.dapk

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {},
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/dcc6f8b2270f4388968f451d89790eec",
      accounts: [`0x${pk}`]
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/dcc6f8b2270f4388968f451d89790eec",
      accounts: [`0x${pk}`],
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY
  },
};
