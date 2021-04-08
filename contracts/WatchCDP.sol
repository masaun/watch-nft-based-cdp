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

    struct Borrow {
        address borrower;
        uint borrowAmount;
        uint startBlock;   /// Block number when borrower borrowed
        uint endBlock;
        bool borrowStatus;
    }
    Borrow[] borrows;
    address[] public borrowers;

    uint interestToRepayPerBlock = 5; /// [Note]: This is a fixed interest to be repaid is 5% per block

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
     * @notice - Borrow the Watch Signals Tokens (WST)
     * @notice - A user who deposit a Watch NFT can borrow WatchSignalsTokens until 60% of collateral price
     * @notice - Assuming that the price of Watch Signals Tokens (WST) is 1 USD
     */
    function borrow(uint borrowAmount, WatchNFT _watchNFT) public returns (bool) {
        WatchNFT watchNFT = _watchNFT;
        WatchNFTFactory.Watch memory watch = watchNFTFactory.getWatch(watchNFT);
        uint _watchPrice = watch.watchPrice;

        /// [Note]: This is maximum amount to be able to borrow
        uint availableBorrowAmount = _watchPrice.mul(60).div(100);
        require (borrowAmount < availableBorrowAmount, "Borrow amount should be less than 60% of the available borrow amount");
        
        /// Execute borrowing the Watch Signals Tokens (WST)
        address borrower = msg.sender;
        watchSignalsToken.transfer(borrower, borrowAmount);

        /// Save data of borrowing
        Borrow memory borrow = Borrow({
            borrower: borrower,
            borrowAmount: borrowAmount,
            startBlock: block.number,
            endBlock: 0,
            borrowStatus: true
        });
        borrows.push(borrow);

        /// Save borrower's address
        borrowers.push(borrower);
    }

    /**
     * @notice - Repay the Watch Signals Tokens (WST)
     */
    function repay() public returns (bool) {
        address borrower = msg.sender;

        /// Calculate amount to be repaid
        uint secondPerBlock = 15;       /// 15 second per 1 block 
        uint secondPerYear = 31536000;  /// 31536000 second per 1 year
        uint generatedBlockPerYear = secondPerYear.div(secondPerBlock);  /// Blocks that will be generated per 1 year
        
        Borrow memory borrow = getBorrow(borrower);
        uint borrowAmount = borrow.borrowAmount;
        uint repayAmountPerYear = borrowAmount.mul(interestToRepayPerBlock).div(100);  /// APY of the repay amount
        uint repayAmountPerBlock = repayAmountPerYear.div(generatedBlockPerYear);

        uint _startBlock = borrow.startBlock;
        uint endBlock = block.number;
        uint repayAmount = repayAmountPerBlock.mul(_startBlock.sub(endBlock));

        watchSignalsToken.transferFrom(msg.sender, address(this), repayAmount);
    }
    

    ///------------------
    /// Getter methods
    ///------------------
    function getAllBorrows() public view returns (Borrow[] memory _borrows) {
        return borrows;
    }

    function getBorrow(address borrower) public view returns (Borrow memory _borrow) {    
        uint index;
        for (uint i=0; i < borrowers.length; i++) {
            if (borrowers[i] == borrower) {
                index = i;
            }
        }

        return borrows[index];
    }


    ///------------------
    /// Private methods
    ///------------------

}
