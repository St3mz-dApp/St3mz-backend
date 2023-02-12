import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  HasMany,
  BelongsTo,
  BelongsToMany,
  DataType,
} from "sequelize-typescript";
import { Account } from "./account";
import { License } from "./license";
import { NftOwner } from "./nftOwner";
import { Stem } from "./stem";

@Table({ tableName: "nfts", modelName: "Nft" })
export class Nft extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Account)
  @Column(DataType.STRING)
  minterAddress!: string;

  @Column(DataType.BIGINT)
  price!: bigint;

  @Column(DataType.INTEGER)
  supply!: number;

  @Column(DataType.INTEGER)
  available!: number;

  @Column(DataType.STRING)
  uri!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  description!: string;

  @Column(DataType.STRING)
  image!: string;

  @Column(DataType.STRING)
  file!: string;

  @Column(DataType.INTEGER)
  duration!: number;

  @Column(DataType.STRING)
  format!: string;

  @Column(DataType.STRING)
  genre!: string;

  @Column(DataType.INTEGER)
  bpm!: number;

  @HasMany(() => License)
  licenses!: License[];

  @HasMany(() => Stem)
  stems!: Stem[];

  @BelongsTo(() => Account)
  minter!: Account;

  @BelongsToMany(() => Account, () => NftOwner)
  owners!: Account[];
}
