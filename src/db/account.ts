import {
  Table,
  Column,
  Model,
  HasMany,
  BelongsToMany,
  DataType,
  PrimaryKey,
} from "sequelize-typescript";
import { Nft } from "./nft";
import { NftOwner } from "./nftOwner";

@Table({ tableName: "accounts", modelName: "Account" })
export class Account extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  address!: string;

  @HasMany(() => Nft)
  mintedNfts!: Nft[];

  @BelongsToMany(() => Nft, () => NftOwner)
  ownedNfts!: Nft[];
}
