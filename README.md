# Watch NFT-based CDP (Collateralized Debt Position)

***
## 【Introduction of the Watch NFT-based CDP (Collateralized Debt Position)】
- This is a smart contract that ...

&nbsp;

***

## 【Workflow】
- Diagram of workflow

&nbsp;

***

## 【Remarks】
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

### ④ Scripts
- Main
```
Step 1: $ npm run script:WatchCDP-borrow

Step 2: $ npm run script:WatchCDP-repay
```
(※ In case you want to execute again after scripts above is executed, you must migrate (Process③) again. Then you need to execute Step 1~2 above)


<br>

- Sub (script for calling oracle only)
```
$ npm run script:WatchSignalsLuxuryWatchPriceOracle
```

<br>

- Sub
```
$ npm run script:WatchNFTFactory
```

<br>

***

## 【References】
- Chainlink
  - @chainlink/contracts (v0.1.6) => include solidity v0.7 based package
    https://www.npmjs.com/package/@chainlink/contracts

