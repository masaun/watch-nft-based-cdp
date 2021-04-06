// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { WatchNFT } from "./WatchNFT.sol";

contract WatchNFTFactory {

    address[] public watchNFTs;

    event WatchNFTCreated(address indexed watchNFT);

    constructor() public {}

    /**
     * @notice - Create a new Watch NFT
     */
    function createWatchNFT(string memory _name, string memory _symbol, address _initialOwner, string memory _watchURI) public returns (bool) {
        address _initialOwner = msg.sender;
        WatchNFT watchNFT = new WatchNFT(_name, _symbol, _initialOwner, _watchURI);
        watchNFTs.push(address(watchNFT));

        emit WatchNFTCreated(address(watchNFT));
    }
    
}
