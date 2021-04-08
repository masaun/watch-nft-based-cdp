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
     */
    function depositWatchNFTAsCollateral() public returns (bool) {}
    
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
