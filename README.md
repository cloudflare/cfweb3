# CFWeb3

CFWeb3 is a Web3 demo application. It uses [Hardhat](https://github.com/nomiclabs/hardhat) and [Solidity](https://soliditylang.org/) to create an [Ethereum](https://ethereum.org/) smart contract. This code is a proof-of-concept showing how to [build Web3 applications with Cloudflare](https://blog.cloudflare.com/get-started-web3/), and should not be used as a production example.

The contract offers 2048 tokens which can be minted via the frontend [Svelte](https://svelte.dev/) application. The entire app runs on the [Rinkeby](https://www.rinkeby.io/) test network.

## Demo

A live version of this demo app can be found at [cf-web3.pages.dev](https://cf-web3.pages.dev/).

## Building locally

1. Clone the repo with `git clone git@github.com:cloudflare/cfweb3.git`
2. npm install in `contract` and `frontend` with:

```sh
cd cfweb3/contract
npm install
cd ../frontend
npm install
```

3. Install Metamask, switch to the testnet and add funds (instructions below)
4. Click on Metamask and then on the hamburger icon in the top right
5. Click on "Account details"
6. Click on "Export Private Key"
7. Enter Metamask password
8. Copy your private key
9. In one terminal window, move into the `contract` directory and run:

```sh
dapk="YOUR_PRIVATE_KEY" npx hardhat node
```

10. In a different terminal window, move into the `frontend` directory and run:

```sh
npm run dev
```

## Adding funds to your Metamask test account

1. Install [Metamask](https://metamask.io/)
2. Switch Metamask to the Rinkeby test network

![Metamask switch to testnet](/img/metamask-testnet.png)

3. Copy your Rinkeby account wallet address.

4. Go to the [Rinkeby faucet](https://faucet.rinkeby.io/)
5. Post a Tweet or a Facebook status with your Rinkeby wallet address.
6. Enter the URL of your Tweet or Facebook post on the faucet website.
7. Claim the amount you want.
8. Delete the social media post (optional).
