// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

import { WatchSignalsLuxuryWatchPriceOracle } from "./WatchSignalsLuxuryWatchPriceOracle.sol";
import { WatchNFT } from "./WatchNFT.sol";
import { LinkTokenInterface } from "./chainlink/v0.6/interfaces/LinkTokenInterface.sol";


contract WatchNFTFactory {
    using SafeMath for uint;    

    uint currentWatchId;
    address WATCH_SIGNALS;
    address[] public watchNFTs;  /// Created-Watch NFT contract addresses

    struct Watch {
        uint watchId;
        WatchNFT watchNFT;
        address owner;
        uint watchPrice;
    }
    Watch[] watchs;

    event WatchNFTCreated(uint watchId, address indexed watchNFT);

    WatchSignalsLuxuryWatchPriceOracle public watchSignals;
    LinkTokenInterface public linkToken;    

    constructor(WatchSignalsLuxuryWatchPriceOracle _watchSignals, LinkTokenInterface _linkToken) public {
        watchSignals = _watchSignals;
        linkToken = _linkToken;

        WATCH_SIGNALS = address(watchSignals);
    }

    /**
     * @notice - Create a new Watch NFT
     */
    function createWatchNFT(
        string memory _name, 
        string memory _symbol, 
        address _initialOwner, 
        string memory _watchURI, 
        address _oracle, 
        bytes32 _jobId, 
        string memory _refNumber
    ) public returns (bool) {
        address _initialOwner = msg.sender;
        WatchNFT watchNFT = new WatchNFT(_name, _symbol, _initialOwner, _watchURI);

        watchNFTs.push(address(watchNFT));

        /// Update the latest watch price by using chainlink oracle
        updateWatchPrice(_oracle, _jobId, _refNumber);

        currentWatchId++;
        Watch memory watch = Watch({
            watchId: currentWatchId,
            watchNFT: watchNFT,
            owner: _initialOwner,
            watchPrice: 0  /// [Note]: When a Watch NFT is created, "0" is saved into the property of watch price. Because a watch price from oracle has "time lag". 
        });
        watchs.push(watch);

        emit WatchNFTCreated(currentWatchId, address(watchNFT));
    }

    /**
     * @notice - Update a watch price with the latest watch price via chainlink oracle 
     */
    function updateWatchPrice(address _oracle, bytes32 _jobId, string memory _refNumber) public returns (bool) {
        /// This contract should receive LINK from msg.sender
        uint linkAmount = 1e17;  /// 0.1 LINK
        linkToken.transferFrom(msg.sender, address(this), linkAmount);  

        linkToken.approve(WATCH_SIGNALS, linkAmount);
        watchSignals.requestPrice(_oracle, _jobId, _refNumber);
    }

    /** 
     * @notice - Save current watch's price
     */
    function saveWatchPrice(WatchNFT _watchNFT) public returns (bool) {
        /// Retrieve the latest watch price by using chainlink oracle
        uint _latestWatchPrice = getLatestWatchPrice();  /// e.g). 22188000000000 ($221880)

        /// Convert unit of the latest watch price
        uint latestWatchPrice = _latestWatchPrice.div(100000000).mul(1e18);  /// $221880 * 1e18        

        /// Save the latest watch price by using chainlink oracle
        uint _watchId = getWatch(_watchNFT).watchId;
        uint index = _watchId.div(1);
        Watch storage watch = watchs[index];
        watch.watchPrice = latestWatchPrice;
    }

    /**
     * @notice - Get the latest watch price via chainlink oracle 
     */
    function getLatestWatchPrice() public view returns (uint _latestWatchPrice) {
        return watchSignals.price();
    }


    ///---------------------------
    /// Getter methods
    ///---------------------------
    function getAllWatchNFTs() public view returns(address[] memory _watchNFTs) {
        return watchNFTs;
    }

    function getAllWatchs() public view returns (Watch[] memory _watchs) {
        return watchs;
    }

    function getWatch(WatchNFT _watchNFT) public view returns (Watch memory _watch) {
        address WATCH_NFT = address(_watchNFT);
    
        uint index;
        for (uint i=0; i < watchNFTs.length; i++) {
            if (watchNFTs[i] == WATCH_NFT) {
                index = i;
            }
        }

        return watchs[index];
    }
    
}
