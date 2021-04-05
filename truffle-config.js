require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');  // @notice - Should use new module.
const mnemonic = process.env.MNEMONIC;

/// Arbitrum
const wrapProvider = require('arb-ethers-web3-bridge').wrapProvider
const arbProviderUrl = 'http://localhost:8547/'


module.exports = {
  arbitrum: {
      provider: function () {
        // return wrapped provider:
        return wrapProvider(
          new HDWalletProvider(mnemonic, arbProviderUrl)
        )
      },
      network_id: '*',
      gasPrice: 0,
  },
  networks: {
    kovan: {
      provider: () => new HDWalletProvider(mnemonic, 'https://kovan.infura.io/v3/' + process.env.INFURA_KEY),
      network_id: '42',
      gas: 6465030,
      gasPrice: 5000000000, // 5 gwei
      //gasPrice: 100000000000,  // 100 gwei
      skipDryRun: true,     // Skip dry run before migrations? (default: false for public nets)
    },
    local: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
      skipDryRun: true,
      gasPrice: 5000000000
    },
    test: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
      skipDryRun: true,
      gasPrice: 5000000000
    }
  },

  compilers: {
    solc: {
      version: "pragma",  /// For compiling multiple solc-versions
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
}
