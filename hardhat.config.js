require("@nomicfoundation/hardhat-toolbox");

require('hardhat-contract-sizer');
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  paths: {
    sources: './contracts',
  },

  gasReporter: {
    enabled: true,
  },
  contractSizer: {
    runOnCompile: true,
  },

  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      forking: {
        enabled: true,
        url: 'https://rpc.ankr.com/polygon_mumbai',
      },
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    mumbai: {
      url: 'https://rpc.ankr.com/polygon_mumbai',
    },
  },
};
