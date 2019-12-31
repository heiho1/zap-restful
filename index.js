const ethers = require('ethers');
const express = require('express');

const app = express();

const MNEMONIC = process.env.MNEMONIC;
const PORT = 3000;

const ADDRESS = '0xa8983C2C71fb1237004bD5dfB43eF0F0D7A7a6cd';
const ABI = [
    'function set(uint x) public @4000000',
    'function get() public view returns (uint) @4000000'
]

const PROVIDER = ethers.getDefaultProvider('ropsten');
const IMMUTABLE_CONTRACT = new ethers.Contract(ADDRESS, ABI, PROVIDER);

app.get('/', (req, res) => res.send('Hello ZAP-RESTful!'))

app.get('/get', async (req, res) => {
    console.log(`/get from ${JSON.stringify(IMMUTABLE_CONTRACT)}`)
    try {
        const value = await IMMUTABLE_CONTRACT.get();
        res.send(value.toString());
    } catch (e) {
        console.error(e)
        res.send(e);
    }
});

app.get('/set/:value', async (req, res) => {
    console.log(`/set/${req.params.value}`)
    const wallet = ethers.Wallet.fromMnemonic(MNEMONIC).connect(PROVIDER);
    const contract = new ethers.Contract(ADDRESS, ABI, wallet);
    console.log(`wallet: ${JSON.stringify(wallet.provider)}`)
    try {
        console.log('setting value')
        await contract.set(req.params.value)
        console.log('value set')
        res.send('OK')
    } catch (e) {
        console.error(e)
        res.send(e)
    }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
