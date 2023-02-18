import express from "express";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import { testRouter } from "./router/test.router";
import { errorHandler } from "./error/error-handler";
import { listenToEvents } from "./service/eventListener.service";
import { sequelize } from "./db/sequelize.db";
import { Config } from "./config";
import { Nft } from "./db/nft";
import { Account } from "./db/account";
import { License } from "./db/license";
import { NftOwner } from "./db/nftOwner";
import { Stem } from "./db/stem";
import { nftRouter } from "./router/nft.router";

export const accountRepository = sequelize.getRepository(Account);
export const nftRepository = sequelize.getRepository(Nft);
export const nftOwnerRepository = sequelize.getRepository(NftOwner);
export const licenseRepository = sequelize.getRepository(License);
export const stemRepository = sequelize.getRepository(Stem);

const app = express();

// Logger
app.use(logger("dev"));
// Enable CORS
app.use(cors({ origin: "*" }));
// Body parser
app.use(express.json());
// Url parser
app.use(express.urlencoded({ extended: true }));
// HTTP headers security
app.use(helmet());

// Routers
app.get("/", (_req, res) => {
  res.send("✅ Server is up!");
});
app.use("/nft", nftRouter);
if (process.env.NODE_ENV === "development") {
  app.use("/test", testRouter);
}

// Error handling
app.use(errorHandler);

// Server activation
app.listen(Config.port, async () => {
  await sequelize.sync({ force: Config.dropTables });
  // Start listening to contract events
  listenToEvents();
  console.log(`⚡️Listening on port ${Config.port}`);
});
