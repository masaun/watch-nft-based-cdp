pragma solidity 0.6.12;

/// [Note]: How to declaration should be simple
/// [Note]: Use solidity v0.6 for chainlink
import "./chainlink/v0.6/ChainlinkClient.sol";


contract WatchSignalsLuxuryWatchPriceOracle is ChainlinkClient {
  
    uint256 oraclePayment;
    uint256 public price;
      
    constructor(uint256 _oraclePayment) public ChainlinkClient() {
        setPublicChainlinkToken();
        oraclePayment = _oraclePayment;   /// 0.1 LINK in case of Kovan testnet
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
