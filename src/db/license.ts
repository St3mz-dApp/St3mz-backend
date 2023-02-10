import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from "sequelize-typescript";
import { Nft } from "./nft";

type LicenseType = "Basic" | "Commercial" | "Exclusive";

@Table({ tableName: "licenses", modelName: "License" })
export class License extends Model<Partial<License>> {
  @Column(DataType.STRING)
  type!: LicenseType;

  @Column(DataType.INTEGER)
  tokensRequired!: number;

  @ForeignKey(() => Nft)
  @Column(DataType.INTEGER)
  nftId!: number;

  @BelongsTo(() => Nft)
  nft!: Nft;
}
