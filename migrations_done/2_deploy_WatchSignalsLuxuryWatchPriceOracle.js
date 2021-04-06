const WatchSignalsLuxuryWatchPriceOracle = artifacts.require("WatchSignalsLuxuryWatchPriceOracle");

/// Import deployed-addresses
const tokenAddressList = require("./addressesList/tokenAddress/tokenAddress.js")

const _linkToken = tokenAddressList["Kovan"]["Chainlink"]["LINK Token"]
const _oraclePayment = `${ 1e17 }`   /// 0.1 LINK per a request

module.exports = async function(deployer) {
    await deployer.deploy(WatchSignalsLuxuryWatchPriceOracle, _linkToken, _oraclePayment);
};
