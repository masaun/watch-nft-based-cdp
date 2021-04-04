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
const WatchSignalsLuxuryWatchPriceOracle = artifacts.require("WatchSignalsLuxuryWatchPriceOracle")

/// ABIs
let watchSignals_ABI = WatchSignalsLuxuryWatchPriceOracle.abi

/// Contract addresses
let WATCH_SIGNALS = WatchSignalsLuxuryWatchPriceOracle.address


/***
 * @dev - Execution COMMAND: 
 **/

/// Acccounts
let deployer
let user1

/// Global contract instance
let watchSignals


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

    console.log("\n------------- Process of the WatchSignalsLuxuryWatchPriceOracle -------------");

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
    console.log("Create the WatchSignalsLuxuryWatchPriceOracle contract instance");
    watchSignals = await WatchSignalsLuxuryWatchPriceOracle.at(WATCH_SIGNALS)

    /// Logs (each deployed-contract addresses)
    console.log('=== WATCH_SIGNALS ===', WATCH_SIGNALS)
}





///---------------------------------------------------------
/// Process of WatchSignalsLuxuryWatchPriceOracle contract
///---------------------------------------------------------
async function getCurrentBlock() {
    const currentBlock = await web3.eth.getBlockNumber()
    return currentBlock
}

