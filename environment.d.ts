declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: number;
      ENVIRONMENT: "local" | "testnet" | "mainnet";
      RPC_URL_LOCAL: string;
      RPC_URL_TESTNET: string;
      RPC_URL_MAINNET: string;
      CONTRACT_ADDRESS_LOCAL: string;
      CONTRACT_ADDRESS_TESTNET: string;
      CONTRACT_ADDRESS_MAINNET: string;
    }
  }
}

export {};
