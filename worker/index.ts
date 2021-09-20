import { Router } from 'worktop';
import * as Cache from 'worktop/cache';
import * as CORS from 'worktop/cors';

interface NFT {
  name: string;
  description: string;
  image: string;
}

const constructNft = (id: string): NFT => ({
  name: `CFNFT #${id}`,
  description: `CFNFT #${id}`,
  image: "https://cloudflare-ipfs.com/ipfs/Qma6eRuWT27UyCZCCVNpnndzRYWqyQrX4DfdgMCsLs5u8H"
})


const API = new Router();

API.prepare = CORS.preflight({
  origin: '*', // allow any `Origin` to connect
  headers: ['Cache-Control', 'Content-Type', 'X-Count'],
  methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
});

API.add('GET', '/nft/:id', async (req, res) => {
  const { params: { id } } = req
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.send(200, constructNft(id));
});

Cache.listen(API.run);
