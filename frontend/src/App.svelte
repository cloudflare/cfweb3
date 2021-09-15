<script>
	import Contract from "./CFNFT.json";
	import { ethers } from "ethers";

	const CONTRACT_ID = "0x290422EC6eADc2CC12aCd98C50333720382CA86B";

	let account = null;
	let minted = false;
	let loading = false;

	const login = async () => {
		const accounts = await ethereum.request({ method: "eth_requestAccounts" });
		account = accounts[0];
	};

	ethereum.on("accountsChanged", function (accounts) {
		account = accounts[0];
	});

	const mint = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();

		const CFNFT = new ethers.Contract(CONTRACT_ID, Contract.abi, provider);
		const contract = CFNFT.connect(signer);
		await contract.mintToken(1, account);
		loading = true;
		contract.on("Minted", (from, to, amount, event) => {
			minted = true;
			loading = false;
		});
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
		<button on:click={mint}>Mint</button>
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
</style>
