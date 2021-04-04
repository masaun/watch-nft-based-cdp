const WatchSignalsLuxuryWatchPriceOracle = artifacts.require("WatchSignalsLuxuryWatchPriceOracle");

const _oraclePayment = `${ 1e17 }`   /// 0.1 LINK per a request

module.exports = async function(deployer) {
    console.log('deployer: ', deployer)

    await deployer.deploy(WatchSignalsLuxuryWatchPriceOracle, _oraclePayment);
};
