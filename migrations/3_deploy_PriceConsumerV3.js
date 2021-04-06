const PriceConsumerV3 = artifacts.require("PriceConsumerV3");

module.exports = async function(deployer) {
    await deployer.deploy(PriceConsumerV3);
};
