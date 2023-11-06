const myToken = artifacts.require("ERC20Token");

module.exports = function (deployer) {
  deployer.deploy(myToken);
};
