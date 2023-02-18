import {
  licenseRepository,
  accountRepository,
  nftRepository,
  stemRepository,
} from "..";
import { Nft } from "../db/nft";
import { ErrorCode } from "../error/error-code";
import { ErrorException } from "../error/error-exception";

export const get = async (id: number): Promise<Nft> => {
  const nft = await nftRepository.findByPk(id, {
    include: [licenseRepository, stemRepository],
  });

  if (!nft) throw new ErrorException(ErrorCode.NotFound);

  return nft;
};

export const getAll = async (): Promise<Nft[]> => {
  return await nftRepository.findAll();
};

export const createdBy = async (address: string): Promise<Nft[]> => {
  return await nftRepository.findAll({
    where: { minterAddress: address },
  });
};

export const ownedBy = async (address: string): Promise<Nft[]> => {
  const account = await accountRepository.findByPk(address, {
    include: [{ model: nftRepository, as: "ownedNfts" }],
  });

  if (!account) return [];

  return account.ownedNfts;
};
