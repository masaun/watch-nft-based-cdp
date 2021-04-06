require('dotenv').config();
//const Tx = require('ethereumjs-tx').Transaction;

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(`https://kovan.infura.io/v3/${ process.env.INFURA_KEY }`);
const web3 = new Web3(provider);

/// Openzeppelin test-helper
const { time } = require('@openzeppelin/test-helpers');

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const PriceConsumerV3 = artifacts.require("PriceConsumerV3")
const LinkTokenInterface = artifacts.require("LinkTokenInterface")

/// ABIs
let priceConsumerV3_ABI = PriceConsumerV3.abi

/// Contract addresses
let PRICE_CONSUMER_V3 = PriceConsumerV3.address
let LINK_TOKEN = tokenAddressList["Kovan"]["Chainlink"]["LINK Token"]


/***
 * @dev - Execution COMMAND: 
 **/

/// Acccounts
let deployer
let user1

/// Global contract instance
let priceConsumerV3


///-----------------------------------------------
/// Execute all methods
///-----------------------------------------------

/// [Note]: For truffle exec (Remarks: Need to use module.exports)
module.exports = function(callback) {
    main().then(() => callback()).catch(err => callback(err));
};

async function main() {
    console.log("\n------------- Check state in advance -------------");
    await checkStateInAdvance();

    console.log("\n------------- Setup smart-contracts -------------");
    await setUpSmartContracts();

    console.log("\n------------- Preparation for tests in advance -------------");

    console.log("\n------------- Process of the PriceConsumerV3 -------------");
    await getLatestPrice()
}


///-----------------------------------------------
/// Methods
///-----------------------------------------------
async function checkStateInAdvance() {
    /// Assign addresses into global variables of wallets
    deployer = process.env.DEPLOYER_ADDRESS
    user1 = process.env.WALLET_ADDRESS_1
    console.log('=== deployer ===', deployer)
    console.log('=== user1 ===', user1)
}

async function setUpSmartContracts() {
    console.log("Create the PriceConsumerV3 contract instance");
    priceConsumerV3 = await PriceConsumerV3.at(PRICE_CONSUMER_V3)

    console.log("Create the LINK Token contract instance");
    linkToken = await LinkTokenInterface.at(LINK_TOKEN)

    /// Logs (each deployed-contract addresses)
    console.log('=== PRICE_CONSUMER_V3 ===', PRICE_CONSUMER_V3)
    console.log('=== LINK_TOKEN ===', LINK_TOKEN)
}

async function getLatestPrice() {
    console.log("Get latest price (ETH/USD)");
    let _latestPrice = await priceConsumerV3.getLatestPrice()
    let latestPrice = String(_latestPrice)
    console.log('=== latestPrice (ETH/USD) ===', latestPrice)  /// e.g). 215714340978
}




///---------------------------------------------------------
/// Process of PriceConsumerV3 contract
///---------------------------------------------------------
async function getCurrentBlock() {
    const currentBlock = await web3.eth.getBlockNumber()
    return currentBlock
}

