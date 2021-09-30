<script>
  import Contract from "./CFNFT.json";
  import { ethers } from "ethers";

  const CONTRACT_ID = "0x290422EC6eADc2CC12aCd98C50333720382CA86B";

  const ethereum = window.ethereum;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(CONTRACT_ID, Contract.abi, provider);
  const authenticatedContract = contract.connect(signer);

  let maxTokens = -1;
  let currentMinted = -1;
  let account = null;
  let minted = false;
  let loading = false;
  let quantity = 1;
  let ownedTokens = [];
  let recentlyMintedTokens = [];

  const init = async () => {
    if (!account && ethereum.selectedAddress) {
      account = ethereum.selectedAddress;
    }

    if (account) {
      findCurrentOwned();
      findCurrentMinted();
    } else {
      fetchRecentlyMinted();
    }
  };

  const login = async () => {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    account = accounts[0];
    init();
  };

  ethereum.on("accountsChanged", function (accounts) {
    account = accounts[0];
  });

  const mint = async (evt) => {
    evt.preventDefault();
    await authenticatedContract.mintToken(quantity, account);
    loading = true;
    authenticatedContract.on("Minted", (from, to, amount, event) => {
      minted = true;
      loading = false;
      currentMinted += 1;
    });
  };

  const findCurrentOwned = async () => {
    const numberOfTokensOwned = await authenticatedContract.balanceOf(account);
    for (let i = 0; i < Number(numberOfTokensOwned); i++) {
      const token = await authenticatedContract.tokenOfOwnerByIndex(account, i);
      const URI = await authenticatedContract.tokenURI(token);
      const response = await fetch(URI);

      const result = await response.json();

      ownedTokens.push(result);
    }
    ownedTokens = ownedTokens;
  };

  const findCurrentMinted = async () => {
    const total = await authenticatedContract.MAX_TOKENS();
    const supply = await authenticatedContract.totalSupply();

    maxTokens = Number(total);
    currentMinted = Number(supply);
  };

  const fetchRecentlyMinted = async () => {
    const recentMintEvents = await authenticatedContract.queryFilter({
      topics: [
        "0xb9203d657e9c0ec8274c818292ab0f58b04e1970050716891770eb1bab5d655e",
      ],
    });

    await recentMintEvents.map(async (MintEvent) => {
      const URI = await contract.tokenURI(MintEvent.args.tokenId);
      const response = await fetch(URI);

      const result = await response.json();

      recentlyMintedTokens.push(result);
      recentlyMintedTokens = recentlyMintedTokens;
    });
  };

  init();
</script>

<header>
  <a href="/">Cloudflare Web3</a>
  <ul>
    <li><a href="https://github.com/signalnerve/cfweb3">GitHub</a></li>
  </ul>
</header>

<div class="warning">
  This marketplace is connected to the Rinkeby test network.
</div>

<main>
  {#if account}
    <h1>👋 Welcome to the Cloudflare Web3 app</h1>
    <h2>You are currently logged in as {account.slice(0, 5)}</h2>
    {#if loading}
      <p>Transaction processing...</p>
    {/if}
    {#if minted}
      <p>
        You minted an NFT! If you haven't already, add a new asset to Metamask
        using the below info
      </p>
      <ul>
        <li>Contract address: {CONTRACT_ID}</li>
        <li>Token symbol: CFNFT</li>
        <li>Token decimal: 0</li>
      </ul>
    {/if}

    <form on:submit={mint}>
      <input
        type="number"
        min="1"
        max="3"
        placeholder="Quantity to mint"
        bind:value={quantity}
      />

      {#if currentMinted >= maxTokens}
        <button disabled type="submit">Sold out</button>
      {:else}
        <button type="submit">Mint</button>
      {/if}
    </form>

    <section>
      <span>{currentMinted}/2048 minted</span>
    </section>

    <h2>Your Tokens:</h2>
    {#if ownedTokens}
      <section>
        <ul class="grid">
          {#each ownedTokens as token}
            <li>
              <div class="grid-image">
                <img src={token.image} alt="" />
              </div>
              <div class="grid-footer">
                <h2>{token.name}</h2>
                <span>{token.description}</span>
              </div>
            </li>
          {/each}
        </ul>
      </section>
    {:else}
      <section>
        You don't have any tokens. Mint one with the button above to add it to
        your collection.
      </section>
    {/if}
  {:else}
    <h1>👋 Welcome to Cloudflare Web3.</h1>
    <h2>Login with Metamask to mint your NFT</h2>
    <button on:click={login}>Login</button>

    <h2>Recently Minted NFTs:</h2>
    {#if recentlyMintedTokens}
      <section>
        <ul class="grid">
          {#each recentlyMintedTokens as token}
            <li>
              <div class="grid-image">
                <img src={token.image} alt="" />
              </div>
              <div class="grid-footer">
                <h2>{token.name}</h2>
                <span>{token.description}</span>
              </div>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {/if}
</main>

<style>
  input[type="number"] {
    width: 12rem;
  }
</style>
