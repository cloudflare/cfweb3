import { Router } from 'worktop';
import * as Cache from 'worktop/cache';

interface NFTs {
  ids: string[];
}

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

API.add('GET', '/nft/:id', async (req, res) => {
  const { params: { id } } = req
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.send(200, constructNft(id));
});

API.add('POST', '/nfts', async (req, res) => {
  try {
    var input = await req.body<NFTs>();
  } catch (err) {
    return res.send(400, 'Error parsing request body');
  }

  if (!input || !input.ids) {
    return res.send(422, { ids: 'required' });
  }

  const nfts = input.ids.map(id => constructNft(id))

  res.send(201, { nfts });
});

Cache.listen(API.run);
