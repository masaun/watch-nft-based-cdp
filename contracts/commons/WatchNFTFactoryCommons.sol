// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { WatchNFT } from "../WatchNFT.sol";


/**
 * @notice - This is the contract that common events, storages, objects are defined for the WatchNFTFactory contract
 */
contract WatchNFTFactoryCommons {

    ///-------------------------------
    /// Objects
    ///-------------------------------
    struct Watch {
        uint watchId;
        WatchNFT watchNFT;
        address owner;
        uint watchPrice;
    }


    ///-------------------------------
    /// Storages
    ///-------------------------------    
    Watch[] watchs;


    ///-------------------------------
    /// Events
    ///------------------------------- 
    event WatchNFTCreated(uint watchId, address indexed watchNFT);

}
