<script>
  import Contract from "./CFNFT.json";
  import { ethers } from "ethers";

  const CONTRACT_ID = "0x290422EC6eADc2CC12aCd98C50333720382CA86B";

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const CFNFT = new ethers.Contract(CONTRACT_ID, Contract.abi, provider);
  const contract = CFNFT.connect(signer);


  let currentMinted = -1;
  let account = null;
  let minted = false;
  let loading = false;
  let quantity = 1;
  let ownedTokens = [];

  const login = async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    account = accounts[0];
    findCurrentMinted();
    findCurrentOwned();
  };

  ethereum.on("accountsChanged", function (accounts) {
    account = accounts[0];
  });

  const mint = async (evt) => {
    evt.preventDefault();
    await contract.mintToken(quantity, account);
    loading = true;
    contract.on("Minted", (from, to, amount, event) => {
      minted = true;
      loading = false;
      currentMinted += 1;
    });
  };

  const findCurrentOwned = async () => {
    const numberOfTokensOwned = await contract.balanceOf(account);
    for (let i = 0; i < Number(numberOfTokensOwned); i++) {
      const token = await contract.tokenOfOwnerByIndex(account, i);
      const URI = await contract.tokenURI(token);
      const response = await fetch(URI);

      const result = await response.json();

      ownedTokens.push(result);
      ownedTokens = ownedTokens;
    }
  }

  const findCurrentMinted = async () => {
    const supply = await contract.totalSupply();
    currentMinted = Number(supply);
  };
</script>

<main>
  {#if account}
    <h1>Logged in as {account.slice(0, 5)}</h1>
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
      <button type="submit">Mint</button>
    </form>

    <section>
      <span>{currentMinted}/2048 minted</span>
    </section>

    {#if ownedTokens }
      <section>
        <ul>
          {#each ownedTokens as token}
            <span>{token.name}</span>
            <span>{token.description}</span>
            <img src={token.image} alt="" />
          {/each}
        </ul>
      </section>
    {/if}
  {:else}
    <h1>Login with Metamask to mint your NFT</h1>
    <button on:click={login}>Login</button>
  {/if}
</main>

<style>
  main {
    margin: 4rem auto;
    max-width: 40rem;
  }

  input[type="number"] {
    width: 12rem;
  }

  img {
    width: 125px;
    height: 125px;
  }
</style>
