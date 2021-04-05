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
const LinkTokenInterface = artifacts.require("LinkTokenInterface")

/// ABIs
let watchSignals_ABI = WatchSignalsLuxuryWatchPriceOracle.abi

/// Contract addresses
let WATCH_SIGNALS = WatchSignalsLuxuryWatchPriceOracle.address
let LINK_TOKEN = tokenAddressList["Kovan"]["Chainlink"]["LINK Token"]


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
    await transferLINKToExecutionContract()

    console.log("\n------------- Process of the WatchSignalsLuxuryWatchPriceOracle -------------");
    await requestPrice()
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

    console.log("Create the LINK Token contract instance");
    linkToken = await LinkTokenInterface.at(LINK_TOKEN)

    /// Logs (each deployed-contract addresses)
    console.log('=== WATCH_SIGNALS ===', WATCH_SIGNALS)
    console.log('=== LINK_TOKEN ===', LINK_TOKEN)
}

async function transferLINKToExecutionContract() {
    console.log("Transfer 1 LINK into the WatchSignalsLuxuryWatchPriceOracle contract");
    const amount = web3.utils.toWei('1', 'ether')
    const txReceipt = await linkToken.transfer(WATCH_SIGNALS, amount)

    console.log("LINK balance of the WatchSignalsLuxuryWatchPriceOracle contract should has more than 0.1 LINK")
    const _LinkBalance = await linkToken.balanceOf(WATCH_SIGNALS)
    const LinkBalance = web3.utils.fromWei(String(_LinkBalance), 'ether')
    console.log('=== LINK balance of the WatchSignalsLuxuryWatchPriceOracle contract ===', LinkBalance)    
}

async function requestPrice() {
    console.log("Request price");

    /// [Note]: Need to have more than 1 LINK balance of the WatchSignalsLuxuryWatchPriceOracle.sol

    /// Assign 
    const _oracle = contractAddressList["Kovan"]["Chainlink"]["WatchSignals"]["Oracle"]
    const _jobId = web3.utils.toHex(contractAddressList["Kovan"]["Chainlink"]["WatchSignals"]["JobID"])  /// [Note]: JobID is converted from string to bytes32
    const _refNumber = "RM1101"

    console.log('=== _oracle ===', _oracle)
    console.log('=== _jobId ===', _jobId)
    console.log('=== _refNumber ===', _refNumber)

    let txReceipt = await watchSignals.requestPrice(_oracle, _jobId, _refNumber)
    //let txReceipt = await watchSignals.requestPrice(_oracle, _jobId, _refNumber, { from: deployer })
}






///---------------------------------------------------------
/// Process of WatchSignalsLuxuryWatchPriceOracle contract
///---------------------------------------------------------
async function getCurrentBlock() {
    const currentBlock = await web3.eth.getBlockNumber()
    return currentBlock
}

