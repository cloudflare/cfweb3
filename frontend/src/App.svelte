<script>
	import Contract from "../../contract/artifacts/contracts/CFNFT.sol/CFNFT.json";
	import { ethers } from "ethers";

	const CONTRACT_ID = "0x290422EC6eADc2CC12aCd98C50333720382CA86B";

	let account = null;
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

		// const MyContract = await getContractFactory("CFNFT");
		// const myContract = new Contract(CFNFT, CFNFT.interface, accounts[0]);
		// const contractAddress = await contract.options.address; // correctly outputs

		// const transactionParameters = {
		// 	to: contract.address,
		// 	from: ethereum.selectedAddress,
		// };

		// const txHash = await ethereum.request({
		// 	method: "eth_mintToken",
		// 	params: [transactionParameters],
		// });
	};
</script>

<main>
	{#if account}
		<div>Logged in</div>
		<button on:click={mint}>Mint</button>
	{:else}
		<button on:click={login}>Login</button>
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
