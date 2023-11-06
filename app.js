const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const { Web3 } = require('web3');
var web3 = new Web3(process.env.LOCAL_API_KEY);
const privateKey = process.env.LOCAL_PRIVATE_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
const acc = web3.eth.accounts.wallet.add(account);
const contractAddress = "0x162E24Dc27073eAcC7e4dA9cf9f48d2AE5C82f59"; // replace withe your contarct address
const contractABI = require('./build/contracts/ERC20Token.json');
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
const publicKey = "0x91CB85A78B595fd8745018Ae1819D5FD8cA603B2"; // replace withe your account/wallet address
const router = express.Router()
const { addLiquidity } = require('./contractAPI')
const PORT= process.env.PORT || 3000
app.use(express.json())
const mintToken = async (req, res) => {
    try {
        const { value } = req.body;
        const balance = await contract.methods.totalSupply().call();
        const oldBalance = web3.utils.fromWei(balance, 'ether')
        await contract.methods.mint(contractAddress, Number(value) * 10).send({
            from: publicKey
        });
        let newBalance = await contract.methods.totalSupply().call();
        newBalance = web3.utils.fromWei(newBalance, 'ether')
        res.status(200).send({status:true, oldBalance, newBalance })
    } catch (error) {
        res.status(400).send({ status:false,errMsg:error.message })
    }
}

const addLiquidityPool = async (req, res) => {
    const { amountTokenA, amountTokenB } = req.body;
    const recipnt = await addLiquidity(1, 3, web3)
};
const balanceOf = async (req, res) => {
    const { address } = req.params;
    console.log('address ', address);
    const balance = await contract.methods.balanceOf(address).call();
    res.send({ balanceInEth: web3.utils.fromWei(balance, 'ether') })
};
const totalSupply = async (req, res) => {
    const balance = await contract.methods.totalSupply().call();
    res.send({ totalSupply: String(balance) })
};
app.use(router.post("/mint", mintToken))
app.use(router.post("/add-liquidity", addLiquidityPool))
app.use(router.get("/balance/:address", balanceOf))
app.use(router.get("/supply/", totalSupply))
app.listen(PORT, () => console.log(`Server started on port ${PORT} `))