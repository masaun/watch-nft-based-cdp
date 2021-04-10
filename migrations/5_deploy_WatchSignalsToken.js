const WatchSignalsToken = artifacts.require("WatchSignalsToken");

module.exports = async function(deployer) {
    await deployer.deploy(WatchSignalsToken);
};
