import { ethers } from "ethers";
import { EventFilter } from "ethers/types/providers";
import axios from "axios";
import {
  accountRepository,
  licenseRepository,
  nftOwnerRepository,
  nftRepository,
  stemRepository,
} from "..";
import { Config } from "../config";
import { st3mzAbi } from "../resources/st3mzAbi";
import { Metadata } from "../model/metadata";

export const listenToEvents = async (): Promise<void> => {
  const provider = new ethers.JsonRpcProvider(Config.rpcUrl);
  const iSt3mz = new ethers.Interface(st3mzAbi);

  const mintFilter: EventFilter = {
    address: Config.contractAddress,
    topics: [ethers.id("Mint(address,uint256,string,uint256,uint256)")],
  };
  provider.on(mintFilter, (log) => {
    const decodedLog = iSt3mz.decodeEventLog("Mint", log.data, log.topics);
    createNft(
      decodedLog.minter.toLowerCase(),
      Number(decodedLog.id),
      decodedLog.uri,
      Number(decodedLog.supply),
      decodedLog.price
    );
  });

  const buyFilter: EventFilter = {
    address: Config.contractAddress,
    topics: [ethers.id("Buy(address,uint256,uint256)")],
  };
  provider.on(buyFilter, (log) => {
    const decodedLog = iSt3mz.decodeEventLog("Buy", log.data, log.topics);
    updateNftOwner(
      decodedLog.buyer.toLowerCase(),
      Number(decodedLog.id),
      decodedLog.amount
    );
  });
};

const createNft = async (
  minterAddress: string,
  id: number,
  uri: string,
  supply: number,
  price: bigint
): Promise<void> => {
  try {
    await accountRepository.findOrCreate({
      where: { address: minterAddress },
      defaults: { address: minterAddress },
    });

    let metadata = new Metadata();
    try {
      const { data } = await axios.get(
        uri.replace("ipfs://", Config.ipfsGateway)
      );
      metadata = data;
    } catch (error) {
      console.error(
        `ERROR fetching metadata from IPFS for NFT ${id}: ${uri.replace(
          "ipfs://",
          Config.ipfsGateway
        )}`
      );
    }

    await nftRepository.create({
      id,
      minterAddress,
      price,
      supply,
      available: supply,
      uri,
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
      file: metadata.file,
      duration: metadata.duration,
      format: metadata.format,
      genre: metadata.genre,
      bpm: metadata.bpm,
    });

    for (const license of metadata.licenses) {
      licenseRepository.create({
        nftId: id,
        type: license.type,
        tokensRequired: license.tokensRequired,
      });
    }

    for (const stem of metadata.stems) {
      stemRepository.create({
        nftId: id,
        file: stem.file,
        description: stem.description,
      });
    }
  } catch (error) {
    console.error(`ERROR creating NFT ${id}: ${error}`);
  }
};

const updateNftOwner = async (
  ownerAddress: string,
  nftId: number,
  amount: number
): Promise<void> => {
  try {
    await accountRepository.findOrCreate({
      where: { address: ownerAddress },
      defaults: { address: ownerAddress },
    });

    await nftRepository.decrement(["available"], {
      where: { id: nftId },
      by: amount,
    });

    const nftOwner = await nftOwnerRepository.findOne({
      where: { ownerAddress, nftId },
    });

    if (nftOwner) {
      await nftOwnerRepository.increment(["amount"], {
        where: { ownerAddress, nftId },
        by: amount,
      });
    } else {
      await nftOwnerRepository.create({
        ownerAddress,
        nftId,
        amount,
      });
    }
  } catch (error) {
    console.error(`ERROR updating NFT owner ${nftId}: ${error}`);
  }
};
