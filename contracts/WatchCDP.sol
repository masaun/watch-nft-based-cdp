// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { WatchSignalsToken } from "./WatchSignalsToken.sol";

import { WatchSignalsLuxuryWatchPriceOracle } from "./WatchSignalsLuxuryWatchPriceOracle.sol";
import { WatchNFT } from "./WatchNFT.sol";
import { WatchNFTFactory } from "./WatchNFTFactory.sol";
import { LinkTokenInterface } from "./chainlink/v0.6/interfaces/LinkTokenInterface.sol";


contract WatchCDP {

    WatchSignalsToken public watchSignalsToken;

    constructor(WatchSignalsToken _watchSignalsToken) public {
        watchSignalsToken = _watchSignalsToken;
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
     * @notice - A user who deposit a Watch NFT can bollow WatchSignalsTokens until 110% of collateral price
     */
    function bollow() public returns (bool) {}

    /**
     * @notice - Repay the Watch Signals Tokens (WST)
     */
    function repay() public returns (bool) {}
    

}
