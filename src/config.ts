import dotenv from "dotenv";

dotenv.config();

const network = process.env.NETWORK;
if (network === undefined) {
  throw new Error("NETWORK environment variable is not set");
}

const rpcUrl = process.env[`RPC_URL_${network.toUpperCase()}`];
if (rpcUrl === undefined) {
  throw new Error(
    `RPC_URL_${network.toUpperCase()} environment variable is not set`
  );
}

const contractAddress =
  process.env[`CONTRACT_ADDRESS_${network.toUpperCase()}`];
if (contractAddress === undefined) {
  throw new Error(
    `CONTRACT_ADDRESS_${network.toUpperCase()} environment variable is not set`
  );
}

if (process.env.DB_HOST === undefined) {
  throw new Error("DB_HOST environment variable is not set");
}

if (process.env.DB_NAME === undefined) {
  throw new Error("DB_NAME environment variable is not set");
}

if (process.env.DB_USER === undefined) {
  throw new Error("DB_USER environment variable is not set");
}

if (process.env.DB_PASSWORD === undefined) {
  throw new Error("DB_PASSWORD environment variable is not set");
}

export const Config = {
  port: process.env.PORT || 8080,
  network,
  rpcUrl,
  contractAddress,
  dbName: process.env.DB_NAME!,
  dbHost: process.env.DB_HOST!,
  dbUser: process.env.DB_USER!,
  dbPassword: process.env.DB_PASSWORD!,
  dropTables: process.env.DROP_TABLES === "true",
};
