import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from "sequelize-typescript";
import { Account } from "./account";
import { Nft } from "./nft";

@Table({ tableName: "nft_owners", modelName: "NftOwner" })
export class NftOwner extends Model {
  @ForeignKey(() => Nft)
  @Column(DataType.INTEGER)
  nftId!: number;

  @ForeignKey(() => Account)
  @Column(DataType.STRING)
  ownerAddress!: string;
}
