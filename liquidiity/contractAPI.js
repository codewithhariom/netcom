const privateKey = process.env.LOCAL_PRIVATE_KEY;
const contractAddress= "0x162E24Dc27073eAcC7e4dA9cf9f48d2AE5C82f59"
async function addLiquidity(amountTokenA, amountTokenB,web3) {
  const gasPrice = await web3.eth.getGasPrice();
  
  const data = contract.methods.addLiquidity(amountTokenA, amountTokenB).encodeABI();
  
  const nonce = await web3.eth.getTransactionCount(account.address);
  const gasLimit = 500000;

  const rawTransaction = {
    nonce,
    gasPrice,
    gasLimit,
    to: contractAddress,
    value: '0x00',
    data,
  };

  const signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction, privateKey);
  
  const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
  
  return receipt;
}

module.exports = {
  addLiquidity,
};
