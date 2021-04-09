require('dotenv').config();
//const Tx = require('ethereumjs-tx').Transaction;

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(`https://kovan.infura.io/v3/${ process.env.INFURA_KEY }`);
const web3 = new Web3(provider);

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const WatchNFTFactory = artifacts.require("WatchNFTFactory")
const WatchSignalsLuxuryWatchPriceOracle = artifacts.require("WatchSignalsLuxuryWatchPriceOracle")
const LinkTokenInterface = artifacts.require("LinkTokenInterface")

/// Contract addresses
let WATCH_NFT_FACTORY = WatchNFTFactory.address
let WATCH_SIGNALS = WatchSignalsLuxuryWatchPriceOracle.address
let LINK_TOKEN = tokenAddressList["Kovan"]["Chainlink"]["LINK Token"]

/// Variable to assign created-Watch NFT contract address
let WATCH_NFT 


/***
 * @dev - Execution COMMAND: 
 **/

/// Acccounts
let deployer

/// Global contract instance
let watchNFTFactory


///-----------------------------------------------
/// Execute all methods
///-----------------------------------------------

/// [Note]: For truffle exec (Remarks: Need to use module.exports)
module.exports = function(callback) {
    main().then(() => callback()).catch(err => callback(err));
};

async function main() {
    console.log("\n------------- Check users (wallets) -------------");
    await checkStateInAdvance();

    console.log("\n------------- Setup smart-contracts -------------");
    await setUpSmartContracts();

    console.log("\n------------- Process of the WatchNFTFactory contract -------------");
    await createWatchNFT()
    await getLatestWatchPrice()
}


///-----------------------------------------------
/// Methods
///-----------------------------------------------
async function checkStateInAdvance() {
    /// Assign addresses into global variables of wallets
    deployer = process.env.DEPLOYER_ADDRESS
    console.log('=== deployer ===', deployer)
}

async function setUpSmartContracts() {
    console.log("Create the LINK Token contract instance");
    linkToken = await LinkTokenInterface.at(LINK_TOKEN)

    console.log("Create the WatchNFTFactory contract instance");
    watchNFTFactory = await WatchNFTFactory.at(WATCH_NFT_FACTORY)

    /// Logs (each deployed-contract addresses)
    console.log('=== WATCH_NFT_FACTORY ===', WATCH_NFT_FACTORY)
    console.log('=== LINK_TOKEN ===', LINK_TOKEN)
}

async function createWatchNFT() {
    console.log("Create a Watch NFT");

    /// [Note]: Need to have more than 1 LINK balance of the WatchSignalsLuxuryWatchPriceOracle.sol
    const approvedLinkAmount = web3.utils.toWei('0.1', 'ether')  /// 0.1 LINK as a fee to request oracle
    let txReceipt1 = await linkToken.approve(WATCH_NFT_FACTORY, approvedLinkAmount)

    /// Request price
    const name = "Richard Mille RM 11-01" 
    const symbol = "RM1101"
    const initialOwner = deployer
    const watchURI = "https://example.com/RM1101"

    const oracle = contractAddressList["Kovan"]["Chainlink"]["WatchSignals"]["Oracle"]
    const _jobId = contractAddressList["Kovan"]["Chainlink"]["WatchSignals"]["JobID"]
    const jobId = web3.utils.toHex(_jobId)  /// [Note]: JobID is converted from string to bytes32
    const refNumber = "RM1101"

    let txReceipt2 = await watchNFTFactory.createWatchNFT(name, symbol, initialOwner, watchURI, oracle, jobId, refNumber)

    /// [Event log]: "WatchNFTCreated"
    let event = await getEvents(watchNFTFactory, "WatchNFTCreated")
    WATCH_NFT = event.watchNFT
    console.log('=== WATCH_NFT ===', WATCH_NFT)
}

async function getLatestWatchPrice() {
    let currentPrice = await watchNFTFactory.getLatestWatchPrice()
    console.log('=== current watch price ===', String(currentPrice))  /// [Result]: 22188000000000 ($221880)
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

