require('dotenv').config();
//const Tx = require('ethereumjs-tx').Transaction;

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(`https://kovan.infura.io/v3/${ process.env.INFURA_KEY }`);
const web3 = new Web3(provider);

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const WatchCDP = artifacts.require("WatchCDP")
const WatchSignalsToken = artifacts.require("WatchSignalsToken")
const LinkTokenInterface = artifacts.require("LinkTokenInterface")

/// Contract addresses
let WATCH_CDP = WatchCDP.address
let WATCH_SIGNALS_TOKEN = WatchSignalsToken.address
let LINK_TOKEN = tokenAddressList["Kovan"]["Chainlink"]["LINK Token"]

/// Variable to assign created-Watch NFT contract address
let WATCH_NFT 


/***
 * @dev - Execution COMMAND: 
 **/

/// Acccounts
let deployer

/// Global contract instance
let watchCDP
let watchSignalsToken


///-----------------------------------------------
/// Execute all methods
///-----------------------------------------------

/// [Note]: For truffle exec (Remarks: Need to use module.exports)
module.exports = function(callback) {
    main().then(() => callback()).catch(err => callback(err));
};

async function main() {
    console.log("\n------------- Setup smart-contracts -------------");
    await setUpSmartContracts();

    console.log("\n------------- Check state in advance -------------");
    await checkStateInAdvance();

    console.log("\n------------- Process of the WatchCDP contract -------------");
    await depositWatchSignalsTokenIntoPool()

}


///-----------------------------------------------
/// Methods
///-----------------------------------------------
async function setUpSmartContracts() {
    console.log("Create the LINK Token contract instance")
    linkToken = await LinkTokenInterface.at(LINK_TOKEN)

    console.log("Create the WatchSignalsToken contract instance")
    watchSignalsToken = await WatchSignalsToken.at(WATCH_SIGNALS_TOKEN)

    console.log("Create the WatchCDP contract instance")
    watchCDP = await WatchCDP.at(WATCH_CDP)

    /// Logs (each deployed-contract addresses)
    console.log('=== WATCH_CDP ===', WATCH_CDP)
    console.log('=== WATCH_SIGNALS_TOKEN ===', WATCH_SIGNALS_TOKEN)    
    console.log('=== LINK_TOKEN ===', LINK_TOKEN)
}

async function checkStateInAdvance() {
    console.log("Deployer address should be assigned")
    deployer = process.env.DEPLOYER_ADDRESS

    console.log("WatchSignalsToken (WST) balance of deployer should be 1 milion")
    let wstBalance = await watchSignalsToken.balanceOf(deployer)

    /// [Log]
    console.log('=== deployer ===', deployer)
    console.log('=== WST balance of deployer ===', web3.utils.fromWei(String(wstBalance), 'ether'))
}

// async function depositWatchSignalsTokenIntoPool() {
//     console.log("Deposit the Watch Signals Tokens (WST) into the Pool to borrow");
//     const to = deployer;
//     const amount = web3.utils.toWei('100', 'ether')  /// 100 WST
//     let txReceipt = await watchSignalsToken.transfer(to, amount, { from: deployer })
// }

async function depositWatchSignalsTokenIntoPool() {
    console.log("Deposit the Watch Signals Tokens (WST) into the Pool to borrow");
    const depositAmount = web3.utils.toWei('100', 'ether')  /// 100 WST
    let txReceipt1 = await watchSignalsToken.approve(WATCH_CDP, depositAmount)
    let txReceipt2 = await watchCDP.depositWatchSignalsTokenIntoPool(depositAmount, { from: deployer })

    console.log("The WST balance of the Pool to borrow should be 100 WST")
    let wstBalance = await watchSignalsToken.balanceOf(WATCH_CDP)

    /// [Log]
    console.log('=== WST balance of the Pool ===', web3.utils.fromWei(String(wstBalance), 'ether'))
}


///--------------------------------------------
/// Get event
///--------------------------------------------
async function getEvents(contractInstance, eventName) {
    const _latestBlock = await getCurrentBlock()
    const LATEST_BLOCK = Number(String(_latestBlock))

    /// [Note]: Retrieve an event log of eventName (via web3.js v1.0.0)
    let events = await contractInstance.getPastEvents(eventName, {
        filter: {},
        fromBlock: LATEST_BLOCK,  /// [Note]: The latest block on Kovan testnet
        //fromBlock: 0,
        toBlock: 'latest'
    })
    console.log(`\n=== [Event log]: ${ eventName } ===`, events[0].returnValues)
    return events[0].returnValues
} 


///---------------------------------------------------------
/// Get current block number
///---------------------------------------------------------
async function getCurrentBlock() {
    const currentBlock = await web3.eth.getBlockNumber()
    return currentBlock
}

