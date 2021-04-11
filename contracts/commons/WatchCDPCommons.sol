// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { WatchNFT } from "../WatchNFT.sol";


/**
 * @notice - This is the contract that common events, storages, objects are defined for the Watch CDP (Collateralized Debt Position) contract
 */
contract WatchCDPCommons {

    ///-------------------------------
    /// Objects
    ///-------------------------------
    enum BorrowStatus { Open, Close }

    struct Borrow {
        WatchNFT watchNFT;
        address borrower;
        uint borrowAmount;
        uint startBlock;   /// Block number when borrower borrowed
        uint endBlock;
        BorrowStatus borrowStatus;
    }


    ///-------------------------------
    /// Storages
    ///-------------------------------    
    Borrow[] borrows;


    ///-------------------------------
    /// Events
    ///------------------------------- 
    event Borrowed(WatchNFT watchNFT, uint borrowId, address borrower, uint borrowAmount);
    event Repaid(WatchNFT watchNFT, uint borrowId, address borrower, uint repayAmount);    
    event Withdraw(WatchNFT watchNFT, uint borrowId, address borrower);

}
