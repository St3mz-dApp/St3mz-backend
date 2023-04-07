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

const ipfsGateway = process.env.IPFS_GATEWAY;
if (ipfsGateway === undefined) {
  throw new Error("IPFS_GATEWAY environment variable is not set");
}

const contractAddress =
  process.env[`CONTRACT_ADDRESS_${network.toUpperCase()}`];
if (contractAddress === undefined) {
  throw new Error(
    `CONTRACT_ADDRESS_${network.toUpperCase()} environment variable is not set`
  );
}

if (process.env.AWS_REGION === undefined) {
  throw new Error("AWS_REGION environment variable is not set");
}

if (process.env.AWS_ACCESS_KEY_ID === undefined) {
  throw new Error("AWS_ACCESS_KEY_ID environment variable is not set");
}

if (process.env.AWS_SECRET_ACCESS_KEY === undefined) {
  throw new Error("AWS_SECRET_ACCESS_KEY environment variable is not set");
}

if (process.env.S3_BUCKET_NAME === undefined) {
  throw new Error("S3_BUCKET_NAME environment variable is not set");
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
  ipfsGateway,
  awsRegion: process.env.AWS_REGION!,
  s3Bucket: process.env.S3_BUCKET_NAME!.replace("{network}", network),
  dbName: process.env.DB_NAME!.replace("{network}", network),
  dbHost: process.env.DB_HOST!,
  dbUser: process.env.DB_USER!,
  dbPassword: process.env.DB_PASSWORD!,
  dropTables: process.env.DROP_TABLES === "true",
  eventsFromBlock: process.env.EVENTS_FROM_BLOCK || "0",
  eventsToBlock: process.env.EVENTS_TO_BLOCK || "latest",
};
