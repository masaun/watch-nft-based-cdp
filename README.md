# Chainlink Hack

***
## 【Introduction of the Chainlink Hack】
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
### ① Install modules
- Install npm modules in the root directory
```
$ npm install
```

<br>

### ② Compile & migrate contracts (on local)
```
$ npm run migrate:local
```

<br>

### ③ Test (Kovan testnet-fork approach)
- 1: Get API-key from Infura  
https://infura.io/

<br>

- 2: Start ganache-cli with kovan testnet-fork (using Infura Key of Kovan tesntnet)
```
$ ganache-cli -d --fork https://kovan.infura.io/v3/{YOUR INFURA KEY OF KOVAN}
```
(※ `-d` option is the option in order to be able to use same address on Ganache-CLI every time)  
(※ Please stop and re-start if an error of `"Returned error: project ID does not have access to archive state"` is displayed)  

<br>

- 2: Execute test of the smart-contracts (on the local)
  - [Main test]: Test for the SharedTrove contract  
    `$ npm run test:Something`  
    ($ truffle test ./test/test-local/Something.test.js)  

<br>


***

## 【References】
- Chainlink
  - @chainlink/contracts (v0.1.6) => include solidity v0.7 based package
    https://www.npmjs.com/package/@chainlink/contracts

