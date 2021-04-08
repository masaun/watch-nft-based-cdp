const WatchNFTFactory = artifacts.require("WatchNFTFactory");
const WatchSignalsLuxuryWatchPriceOracle = artifacts.require("WatchSignalsLuxuryWatchPriceOracle")

/// Import deployed-addresses
const tokenAddressList = require("./addressesList/tokenAddress/tokenAddress.js")

const _watchSignals = WatchSignalsLuxuryWatchPriceOracle.address
const _linkToken = tokenAddressList["Kovan"]["Chainlink"]["LINK Token"]

module.exports = async function(deployer) {
    await deployer.deploy(WatchNFTFactory, _watchSignals, _linkToken);
};
