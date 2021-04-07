// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract WatchSignalsToken is ERC20 {

    constructor() public ERC20("WatchSignalsToken", "WST") {
        address initialReceiver = msg.sender;
        uint initialSupply = 1e8 * 1e18;  /// 1M
        _mint(initialReceiver, initialSupply);
    }

}
