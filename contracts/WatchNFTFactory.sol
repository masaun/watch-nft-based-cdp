// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { WatchSignalsLuxuryWatchPriceOracle } from "./WatchSignalsLuxuryWatchPriceOracle.sol";
import { WatchNFT } from "./WatchNFT.sol";
import { LinkTokenInterface } from "./chainlink/v0.6/interfaces/LinkTokenInterface.sol";


contract WatchNFTFactory {

    struct Watch {
        address owner;
        uint watchPrice;
    }
    Watch[] watchs;

    address[] public watchNFTs;  /// Created-Watch NFT contract addresses
    address WATCH_SIGNALS;

    event WatchNFTCreated(address indexed watchNFT);

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

        /// Save the latest watch price by using chainlink oracle
        updateWatchPrice(_oracle, _jobId, _refNumber);
        uint latestWatchPrice = getLatestWatchPrice();
        Watch memory watch = Watch({
            owner: _initialOwner,
            watchPrice: latestWatchPrice
        });
        watchs.push(watch);

        emit WatchNFTCreated(address(watchNFT));
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
