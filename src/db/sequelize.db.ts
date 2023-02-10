import { Sequelize } from "sequelize-typescript";
import { Nft } from "./nft";
import { Config } from "../config";
import { Account } from "./account";
import { Stem } from "./stem";
import { NftOwner } from "./nftOwner";
import { License } from "./license";

export const sequelize = new Sequelize(
  Config.dbName,
  Config.dbUser,
  Config.dbPassword,
  {
    host: Config.dbHost,
    dialect: "postgres",
    models: [Account, Nft, NftOwner, License, Stem],
    repositoryMode: true,
  }
);
