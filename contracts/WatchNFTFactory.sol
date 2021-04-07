// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { WatchSignalsLuxuryWatchPriceOracle } from "./WatchSignalsLuxuryWatchPriceOracle.sol";
import { WatchNFT } from "./WatchNFT.sol";

contract WatchNFTFactory {

    struct Watch {
        address owner;
        uint watchPrice;
    }
    Watch[] watchs;

    address[] public watchNFTs;

    event WatchNFTCreated(address indexed watchNFT);

    WatchSignalsLuxuryWatchPriceOracle public watchSignals;

    constructor(WatchSignalsLuxuryWatchPriceOracle _watchSignals) public {
        watchSignals = watchSignals;
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

        /// [Todo]: Retrieve the latest watch price by using chainlink oracle
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
        watchSignals.requestPrice(_oracle, _jobId, _refNumber);
    }

    /**
     * @notice - Get the latest watch price via chainlink oracle 
     */
    function getLatestWatchPrice() public view returns (uint _latestWatchPrice) {
        return watchSignals.price();
    }   
    
}
