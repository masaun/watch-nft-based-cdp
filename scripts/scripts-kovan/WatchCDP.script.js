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
    main().then(() => callback()).catch(err => callback(err));
};

async function main() {
    console.log("\n------------- Setup smart-contracts -------------");
    await setUpSmartContracts();

    console.log("\n------------- Check state and prepare things this test need in advance -------------");
    await checkStateInAdvance();
    await depositWatchSignalsTokenIntoWatchCDPPool()
    await checkWstBalanceInAdvance()

    console.log("\n------------- Process of the WatchCDP contract -------------");
    await createWatchNFT()
    await saveWatchPrice()
    await depositWatchNFTAsCollateral()
    await getLatestWatchPrice()
    await borrow()
    await repay()
    await withdrawWatchNFTFromCollateral()
}


///-----------------------------------------------
/// Methods
///-----------------------------------------------
async function setUpSmartContracts() {
    console.log("Create the LINK Token contract instance")
    linkToken = await LinkTokenInterface.at(LINK_TOKEN)

    console.log("Create the WatchNFTFactory contract instance");
    watchNFTFactory = await WatchNFTFactory.at(WATCH_NFT_FACTORY)

    console.log("Create the WatchSignalsToken contract instance")
    watchSignalsToken = await WatchSignalsToken.at(WATCH_SIGNALS_TOKEN)

    console.log("Create the WatchCDP contract instance")
    watchCDP = await WatchCDP.at(WATCH_CDP)

    /// Logs (each deployed-contract addresses)
    console.log('=== WATCH_CDP ===', WATCH_CDP)
    console.log('=== WATCH_SIGNALS_TOKEN ===', WATCH_SIGNALS_TOKEN)    
    console.log('=== WATCH_NFT_FACTORY ===', WATCH_NFT_FACTORY)
    console.log('=== LINK_TOKEN ===', LINK_TOKEN)
}

async function checkStateInAdvance() {
    console.log("Deployer address should be assigned")
    deployer = process.env.DEPLOYER_ADDRESS

    //console.log("WatchSignalsToken (WST) balance of deployer should be 1000")
    //let wstBalance = await watchSignalsToken.balanceOf(deployer)

    /// [Log]
    console.log('=== deployer ===', deployer)
    //console.log('=== WST balance of deployer ===', web3.utils.fromWei(String(wstBalance), 'ether'))
}

async function depositWatchSignalsTokenIntoWatchCDPPool() {
    let _wstBalanceOfWatchCDP = await watchSignalsToken.balanceOf(deployer)
    let wstBalanceOfWatchCDP = web3.utils.fromWei(String(_wstBalanceOfWatchCDP), 'ether')
    console.log('=== wstBalanceOfWatchCDP ===', wstBalanceOfWatchCDP)

    if (wstBalanceOfWatchCDP == "0") {
        console.log("Deposit 1000 the Watch Signals Tokens (WST) into the Watch CDP Pool");
        const depositAmount = web3.utils.toWei('1000', 'ether')  /// 1000 WST
        let txReceipt1 = await watchSignalsToken.approve(WATCH_CDP, depositAmount)
        let txReceipt2 = await watchCDP.depositWatchSignalsTokenIntoPool(depositAmount, { from: deployer })
    }
}

async function checkWstBalanceInAdvance() {
    let _wstBalanceOfDeployer = await watchSignalsToken.balanceOf(deployer)
    let wstBalanceOfDeployer = web3.utils.fromWei(String(_wstBalanceOfDeployer), 'ether')

    let _wstBalanceOfWatchCDP = await watchSignalsToken.balanceOf(WATCH_CDP)
    let wstBalanceOfWatchCDP = web3.utils.fromWei(String(_wstBalanceOfWatchCDP), 'ether')

    console.log("WatchSignalsToken (WST) balance of deployer should be 0")
    console.log("WatchSignalsToken (WST) balance of the WatchCDP Pool should be 1000")

    /// [Log]
    console.log('=== WST balance of deployer ===', wstBalanceOfDeployer)
    console.log('=== WST balance the WatchCDP Pool ===', wstBalanceOfWatchCDP)
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
    watchNFT = await WatchNFT.at(WATCH_NFT)
    console.log('=== WATCH_NFT ===', WATCH_NFT)
}

async function saveWatchPrice() {
    console.log("Save current watch price of the Watch NFT");
    const borrower = deployer
    let txReceipt = await watchNFTFactory.saveWatchPrice(WATCH_NFT, { from: borrower })
}

async function getLatestWatchPrice() {
    let currentPrice = await watchNFTFactory.getLatestWatchPrice()
    console.log('=== current watch price ===', String(currentPrice))  /// [Result]: 22188000000000 ($221880)
}

async function depositWatchNFTAsCollateral() {
    console.log("Deposit a Watch NFT as collateral");
    const borrower = deployer
    const tokenId = 1
    let txReceipt1 = await watchNFT.approve(WATCH_CDP, tokenId)
    let txReceipt2 = await watchCDP.depositWatchNFTAsCollateral(WATCH_NFT, { from: borrower })

    console.log("The owner of a Watch NFT should be the Watch CDP Pool")
    let owner = await watchNFT.ownerOf(tokenId)

    /// [Log]
    console.log('=== The owner of a Watch NFT ===', owner)   
}

async function borrow() {
    console.log("Borrow the Watch Signals Tokens (WST)");
    const borrower = deployer
    const borrowAmount = web3.utils.toWei('100', 'ether')  /// 100 WST
    let txReceipt = await watchCDP.borrow(borrowAmount, WATCH_NFT, { from: borrower })

    console.log("WST balance of borrower should be 100 WST")
    let wstBalance = await watchSignalsToken.balanceOf(borrower)

    /// [Log]
    console.log('=== WST balance of borrower ===', web3.utils.fromWei(String(wstBalance), 'ether'))
}

async function repay() {
    console.log("Repay the Watch Signals Tokens (WST)");
    const borrowId = 1
    const borrower = deployer
    let repayAmount = await watchCDP.getRepayAmount(borrowId)
    console.log('=== repayAmount ===', web3.utils.fromWei(String(repayAmount), 'ether'))

    let txReceipt1 = await watchSignalsToken.approve(WATCH_CDP, repayAmount, { from: borrower }) 
    let txReceipt2 = await watchCDP.repay(borrowId, repayAmount, { from: borrower })
}

async function withdrawWatchNFTFromCollateral() {
    console.log("Withdraw a Watch NFT from collateral to owner");
    const borrower = deployer
    const tokenId = 1
    let txReceipt = await watchCDP.withdrawWatchNFTFromCollateral(WATCH_NFT, { from: borrower })

    console.log("The owner of a Watch NFT should be the borrower")
    let owner = await watchNFT.ownerOf(tokenId)

    /// [Log]
    console.log('=== The owner of a Watch NFT ===', owner)   
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

