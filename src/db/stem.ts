import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from "sequelize-typescript";
import { Nft } from "./nft";

@Table({ tableName: "stems", modelName: "Stem" })
export class Stem extends Model {
  @Column(DataType.STRING)
  file!: string;

  @Column(DataType.STRING)
  description!: string;

  @ForeignKey(() => Nft)
  @Column(DataType.INTEGER)
  nftId!: number;

  @BelongsTo(() => Nft)
  nft!: Nft;
}
