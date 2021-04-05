pragma solidity 0.6.12;

/// [Note]: How to declaration should be simple
/// [Note]: Use solidity v0.6 for chainlink
import "./chainlink/v0.6/ChainlinkClient.sol";
import { LinkTokenInterface } from "./chainlink/v0.6/interfaces/LinkTokenInterface.sol";


/**
 * Network: Kovan
 * Oracle: 
 *      Name:           LinkPool
 *      Listing URL:    https://market.link/nodes/323602b9-3831-4f8d-a66b-3fb7531649eb?network=42&start=1614864673&end=1615469473
 *      Address:        0x56dd6586DB0D08c6Ce7B2f2805af28616E082455
 *
 * Job: 
 *      Name:           WatchSignals Benchmark Price Quote
 *      Listing URL:    https://market.link/jobs/30612a9f-098a-4f28-a66a-ddf5e1f7262d?network=42
 *      ID:             77102eb8faae4532b9534d30749f54dc
 *      Fee:            0.1 LINK
 */
contract WatchSignalsLuxuryWatchPriceOracle is ChainlinkClient {
  
    uint256 oraclePayment;
    uint256 public price;
  
    LinkTokenInterface public linkToken;

    constructor(LinkTokenInterface _linkToken, uint256 _oraclePayment) public ChainlinkClient() {
        setPublicChainlinkToken();

        linkToken = _linkToken;
        oraclePayment = _oraclePayment;   /// 0.1 LINK in case of Kovan testnet
    }


    /**
     * @notice - Request price
     * @notice - On the assumption that LINK balance of this contract should be more than 0.1 LINK 
     */
    function requestPrice(address _oracle, bytes32 _jobId, string memory _refNumber) public {
        /// This contract should receive LINK from msg.sender
        uint linkAmount = 1e17;  /// 0.1 LINK
        linkToken.transferFrom(msg.sender, address(this), linkAmount);

        /// Request oracle
        Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
        req.add("refNumber", _refNumber);
        sendChainlinkRequestTo(_oracle, req, oraclePayment);
    }
  

    function fulfill(bytes32 _requestId, uint256 _price) public recordChainlinkFulfillment(_requestId) {
        price = _price;
    }

}
