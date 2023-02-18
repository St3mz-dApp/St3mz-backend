declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: number;
      NETWORK: "local" | "testnet" | "mainnet";
      RPC_URL_LOCAL: string;
      RPC_URL_TESTNET: string;
      RPC_URL_MAINNET: string;
      IPFS_GATEWAY: string;
      AWS_REGION: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      S3_BUCKET_NAME: string;
      CONTRACT_ADDRESS_LOCAL: string;
      CONTRACT_ADDRESS_TESTNET: string;
      CONTRACT_ADDRESS_MAINNET: string;
      DB_HOST: string;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DROP_TABLES: string;
    }
  }
}

export {};
