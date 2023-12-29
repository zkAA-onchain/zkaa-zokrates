require("@nomicfoundation/hardhat-toolbox");

// require('hardhat-contract-sizer');
// require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2 ** 32 - 1
      },
    },
  },

  paths: {
    sources: './contracts',
  },

  // gasReporter: {
  //   enabled: true,
  //   // outputFile: './gasReport',
  // },
  // contractSizer: {
  //   runOnCompile: true,
  //   // outputFile: './contractSize',
  // },

  mocha: {
    timeout: 100000000
  },

  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      forking: {
        enabled: true,
        url: 'https://rpc.ankr.com/eth',
        blockNumber: 18887520
      },
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    polygon: {
      url: 'https://rpc.ankr.com/polygon',
    },
    ethereum: {
      url: 'https://rpc.ankr.com/eth',
    },
  },
};
