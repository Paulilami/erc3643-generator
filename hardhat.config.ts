import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, '.env') });

const getAccounts = () => {
  let privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    console.warn("⚠️  WARNING: PRIVATE_KEY not found in .env file");
    return [];
  }

  if (!privateKey.startsWith('0x')) {
    privateKey = '0x' + privateKey;
  }

  if (privateKey.length !== 66) {
    console.warn(`⚠️  WARNING: PRIVATE_KEY has incorrect length (${privateKey.length}). Should be 66 characters including 0x prefix.`);
    return [];
  }

  return [privateKey];
};

const accounts = getAccounts();
if (accounts.length > 0) {
  console.log("✅ Loaded private key from .env");
} else {
  console.log("❌ No valid private key found");
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: accounts,
      chainId: 11155111,
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: accounts,
      chainId: 137,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v5",
  },
};

export default config;