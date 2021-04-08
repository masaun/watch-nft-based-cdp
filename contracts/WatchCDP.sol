// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

import { WatchSignalsToken } from "./WatchSignalsToken.sol";
import { WatchSignalsLuxuryWatchPriceOracle } from "./WatchSignalsLuxuryWatchPriceOracle.sol";
import { WatchNFT } from "./WatchNFT.sol";
import { WatchNFTFactory } from "./WatchNFTFactory.sol";
import { LinkTokenInterface } from "./chainlink/v0.6/interfaces/LinkTokenInterface.sol";


contract WatchCDP {
    using SafeMath for uint;

    WatchSignalsToken public watchSignalsToken;
    WatchNFTFactory public watchNFTFactory;

    constructor(WatchSignalsToken _watchSignalsToken, WatchNFTFactory _watchNFTFactory) public {
        watchSignalsToken = _watchSignalsToken;
        watchNFTFactory = _watchNFTFactory;
    }


    /**
     * @notice - Deposit the Watch Signals Tokens (WST) into the Pool to borrow
     * @notice - Only owner
     */
    function depositWatchSignalsTokenIntoPool(uint depositAmount) public returns (bool) {
        watchSignalsToken.transferFrom(msg.sender, address(this), depositAmount);
    }

    /**
     * @notice - Deposit a Watch NFT as collateral
     * @notice - Compute available rate to borrow the Watch Signals Tokens (WST)
     */
    function depositWatchNFTAsCollateral(WatchNFT _watchNFT) public returns (bool) {
        WatchNFT watchNFT = _watchNFT;

        uint tokenId = 1;  /// [Note]: tokenID is always 1
        watchNFT.transferFrom(msg.sender, address(this), tokenId);
    }
    
    /**
     * @notice - Bollow the Watch Signals Tokens (WST)
     * @notice - A user who deposit a Watch NFT can bollow WatchSignalsTokens until 60% of collateral price
     * @notice - Assuming that the price of Watch Signals Tokens (WST) is 1 USD
     */
    function bollow(uint borrowAmount, WatchNFT _watchNFT) public returns (bool) {
        WatchNFT watchNFT = _watchNFT;
        WatchNFTFactory.Watch memory watch = watchNFTFactory.getWatch(watchNFT);
        uint _watchPrice = watch.watchPrice;

        /// [Note]: This is maximum amount to be able to borrow
        uint availableBorrowAmount = _watchPrice.mul(60).div(100);
        require (borrowAmount < availableBorrowAmount, "Bollow amount should be less than 60% of the available borrow amount");
        
        /// Execute borrowing the Watch Signals Tokens (WST)
        address borrower = msg.sender;
        watchSignalsToken.transfer(borrower, borrowAmount);
    }

    /**
     * @notice - Repay the Watch Signals Tokens (WST)
     */
    function repay() public returns (bool) {}
    

}
