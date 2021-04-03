pragma solidity 0.7.6;

import "./chainlink/v0.7/ChainlinkClient.sol";  /// [Note]: How to declaration should be simple
//import "@chainlink/contracts/src/v0.7/ChainlinkClient.sol";

contract WatchSignalsLuxuryWatchPriceOracle is ChainlinkClient {
  
    uint256 oraclePayment;
    uint256 public price;
      
    constructor(uint256 _oraclePayment) public {
        setPublicChainlinkToken();
        oraclePayment = _oraclePayment;
    }


    function requestPrice(address _oracle, bytes32 _jobId, string memory _refNumber) public {
        Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
        req.add("refNumber", _refNumber);
        sendChainlinkRequestTo(_oracle, req, oraclePayment);
    }
  

    function fulfill(bytes32 _requestId, uint256 _price) public recordChainlinkFulfillment(_requestId) {
        price = _price;
    }

}
