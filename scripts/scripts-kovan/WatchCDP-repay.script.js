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
const WatchNFTFactory = artifacts.require("WatchNFTFactory")
const WatchNFT = artifacts.require("WatchNFT")
const LinkTokenInterface = artifacts.require("LinkTokenInterface")

/// Contract addresses
let WATCH_CDP = WatchCDP.address
let WATCH_SIGNALS_TOKEN = WatchSignalsToken.address
let WATCH_NFT_FACTORY = WatchNFTFactory.address
let LINK_TOKEN = tokenAddressList["Kovan"]["Chainlink"]["LINK Token"]

/// Variable to assign created-Watch NFT contract address
let WATCH_NFT 


/***
 * @dev - Execution COMMAND: 
 **/

/// Acccounts
let deployer
let borrower

/// Global contract instance
let watchCDP
let watchSignalsToken
let watchNFTFactory
let watchNFT
let linkToken


///-----------------------------------------------
/// Execute all methods
///-----------------------------------------------

/// [Note]: For truffle exec (Remarks: Need to use module.exports)
module.exports = function(callback) {
    main().then(() => callback()).catch(err => callback(err))
};

async function main() {
    await checkStateInAdvance()
    await setUpSmartContracts()

    console.log("\n------------- Process of repaying the WatchSignalsToken (WST) and withdrawing a Watch NFT -------------");
    await repay()
    await withdrawWatchNFTFromCollateral()
}


///-----------------------------------------------
/// Methods
///-----------------------------------------------
async function checkStateInAdvance() {
    deployer = process.env.DEPLOYER_ADDRESS
    borrower = process.env.DEPLOYER_ADDRESS
}

async function setUpSmartContracts() {
    linkToken = await LinkTokenInterface.at(LINK_TOKEN)
    watchNFTFactory = await WatchNFTFactory.at(WATCH_NFT_FACTORY)
    watchSignalsToken = await WatchSignalsToken.at(WATCH_SIGNALS_TOKEN)
    watchCDP = await WatchCDP.at(WATCH_CDP)
}

async function repay() {
    console.log("Repay the Watch Signals Tokens (WST)");
    const borrowId = 1
    let repayAmount = await watchCDP.getRepayAmount(borrowId)
    console.log('=== repayAmount ===', web3.utils.fromWei(String(repayAmount), 'ether'))

    let txReceipt1 = await watchSignalsToken.approve(WATCH_CDP, repayAmount, { from: borrower }) 
    let txReceipt2 = await watchCDP.repay(borrowId, repayAmount, { from: borrower })
}

async function withdrawWatchNFTFromCollateral() {
    console.log("Withdraw a Watch NFT from collateral to owner")
    const tokenId = 1
    const borrowId = 1
    let borrow = await watchCDP.getBorrow(borrowId)
    WATCH_NFT = borrow.watchNFT
    watchNFT = await WatchNFT.at(WATCH_NFT)

    /// [Log]: Before withdraw
    console.log('=== WATCH_NFT ===', WATCH_NFT)
    let _owner = await watchNFT.ownerOf(tokenId)
    console.log('=== The owner of a Watch NFT (Before withdraw) ===', _owner) 

    /// Execute withdrawing a Watch NFT from the WatchNFT Pool (collateral)
    let txReceipt = await watchCDP.withdrawWatchNFTFromCollateral(WATCH_NFT, { from: borrower })

    console.log("The owner of a Watch NFT should be the borrower")
    let owner = await watchNFT.ownerOf(tokenId)

    /// [Log]: After withdraw
    console.log('=== The owner of a Watch NFT (After withdraw) ===', owner)   
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
