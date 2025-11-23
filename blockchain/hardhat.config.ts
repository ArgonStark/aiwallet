import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-multibaas-plugin';
import path from 'path';

let deployerPrivateKey = '0x2f34c5e922277e34bce28441504e6addd7bd89bc0f8a16db2f197e5d593e6d7e';
let deploymentEndpoint = '';
let adminApiKey = '';
let web3Key = 'https://base-sepolia.drpc.org';
let rpcUrl = ''; // Required if web3Key is not provided

if (process.env['HARDHAT_NETWORK']) {
  const CONFIG_FILE = path.join(__dirname, `./deployment-config.${process.env['HARDHAT_NETWORK']}`);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  ({
    deploymentConfig: { deploymentEndpoint, deployerPrivateKey, web3Key, adminApiKey, rpcUrl },
    // eslint-disable-next-line @typescript-eslint/no-require-imports
  } = require(CONFIG_FILE));
}

const web3Url = web3Key ? `${deploymentEndpoint}/web3/${web3Key}` : rpcUrl;

const config: HardhatUserConfig = {
  networks: {
    development: {
      url: web3Url,
      accounts: [deployerPrivateKey],
    },
    testing: {
      url: web3Url,
      accounts: [deployerPrivateKey],
    },
  },
  mbConfig: {
    apiKey: adminApiKey,
    host: deploymentEndpoint,
    allowUpdateAddress: ['development', 'testing'],
    allowUpdateContract: ['development'],
  },
  solidity: {
    compilers: [
      {
        version: '0.8.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
          evmVersion: 'paris', // until PUSH0 opcode is widely supported
        },
      },
    ],
  },
};

export default config;
