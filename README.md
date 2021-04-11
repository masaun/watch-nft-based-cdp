# Watch NFT-based CDP (Collateralized Debt Position)

***
## 【Introduction of the Watch NFT-based CDP (Collateralized Debt Position)】
- This is a smart contract that allow a user to borrow the WatchSignals Token (WST) by depositing the own watch (Watch NFT) as a collateral.
  - A user create a `Watch NFT` based on their own watch and its watch price.
    - Current watch price is retrieved by the `WatchSignals Luxury Watch Price Oracle` via chainlink.

  - A user deposit a `Watch NFT` into the WatchCDP Pool.

  - By depositing a `Watch NFT`, a user can borrow the WatchSignals Token (WST) from the WatchCDP Pool.
    - A user can borrow the WatchSignals Token (WST) until 60% of watch price
    - This depositing (collateral) and borrowing structure is simlar to MakerDAO's CDP (MCD).

  - When a user above repay, a user repay the WatchSignals Token (include `principal + interest` ) to the WatchCDP Pool. 
    - Once a user finish to repay, a user can withdraw deposited-watch NFT from the WatchCDP Pool. 

<br>

- Use the WatchSignals Luxury Watch Price Oracle via chainlink for retrieving the watch price data.
    https://docs.chain.link/docs/watchsignals#config

&nbsp;

***

## 【Workflow】
- Diagram of workflow
![【Diagram】Watch NFT-based CDP (Collateralized Debt Position)](https://user-images.githubusercontent.com/19357502/114300719-a1af7a00-9afc-11eb-9d67-ea81343abdab.jpg)

&nbsp;

***

## 【Versions】
- Version for following the `Chainlink (v0.6)` smart contract
  - Solidity (Solc): v0.6.12
  - Truffle: v5.1.60
  - web3.js: v1.2.9
  - openzeppelin-solidity: v3.2.0
  - ganache-cli: v6.9.1 (ganache-core: 2.10.2)


&nbsp;

***

## 【Setup】
### ③ Prepare for execution script
- 1: Get API-key from Infura  
https://infura.io/

<br>

- 2: Add `.env` to the root directory by referencing from `.env.example`
  You need to set 3 things below in your .env:
  - Mnemonic (MNEMONIC)
  - Infura key (INFURA_KEY)
  - Deployer address (DEPLOYER_ADDRESS)

<br>

### ② Install modules
- Install npm modules in the root directory
```
$ npm install
```

<br>

### ③ Compile & migrate contracts (on Kovan testnet)
```
$ npm run migrate:kovan
```

<br>

### ④ Scripts (for testing whole process) on Kovan 
- 1: Process are that:
  - Creating a Watch NFT
  - Deposit a Watch NFT as a collateral into the WatchCDP Pool.
  - Borrow the WatchSignals Token (WST)
```
$ npm run script:WatchCDP-borrow
```

<br>

- 2: Process are that:
  - Repay the WatchSignals Token (include `principal + interest` ) to the WatchCDP Pool. 
  - Withdraw the deposited-watch NFT from the WatchCDP Pool. 
```
$ npm run script:WatchCDP-repay
```
(※ In case you want to execute again after scripts above is executed, you must migrate (Process③) again. Then you need to execute Step 1~2 above)


<br>


### 【Remarks】
- Arbitrum verison
  - In progress.


<br>


- Another Scripts (Each parts)
  - Script for calling oracle by using the WatchSignals Luxury Watch Price Oracle via chainlink
    `$ npm run script:WatchSignalsLuxuryWatchPriceOracle`

  - Script for creating the Watch NFT
    `$ npm run script:WatchNFTFactory`

<br>

***

## 【References】
- WatchSignals Luxury Watch Price Oracle via chainlink
  - Article: https://watchsignals.com/watch-blog/luxury-watch-data-on-blockchain-chainlink.html
  - Doc: https://docs.chain.link/docs/watchsignals#config

- Chainlink
  - @chainlink/contracts (v0.1.6) => include solidity v0.6 based package
    https://www.npmjs.com/package/@chainlink/contracts

- Arbitrum
  - Public Testnet（Kovan => Arbitrum）: https://developer.offchainlabs.com/docs/public_testnet
  - How to deploy on Arbitrum by using Truffle: https://developer.offchainlabs.com/docs/contract_deployment

- Chainlink Virtual Hackathon Spring 2021
https://chainlink-2021.devpost.com/
