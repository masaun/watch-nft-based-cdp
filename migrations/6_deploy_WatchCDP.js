const WatchCDP = artifacts.require("WatchCDP");
const WatchSignalsToken = artifacts.require("WatchSignalsToken");
const WatchNFTFactory = artifacts.require("WatchNFTFactory");

/// Import deployed-addresses
const tokenAddressList = require("./addressesList/tokenAddress/tokenAddress.js")

const _watchSignalsToken = WatchSignalsToken.address
const _watchNFTFactory = WatchNFTFactory.address

module.exports = async function(deployer) {
    await deployer.deploy(WatchCDP, _watchSignalsToken, _watchNFTFactory);
};
