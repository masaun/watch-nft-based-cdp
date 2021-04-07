// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Counters } from "@openzeppelin/contracts/utils/Counters.sol";

contract WatchNFT is ERC721 {

    using Counters for Counters.Counter;
    Counters.Counter private _watchIds;

    constructor(string memory _name, string memory _symbol, address _initialOwner, string memory _watchURI) public ERC721(_name, _symbol) {
        mint(_initialOwner, _watchURI);
    }

    /**
     * @notice - mint
     */
    function mint(address to, string memory watchURI) public returns (uint256) {
        _watchIds.increment();

        uint256 newWatchId = _watchIds.current();
        _mint(to, newWatchId);
        _setTokenURI(newWatchId, watchURI);

        return newWatchId;
    }

}
