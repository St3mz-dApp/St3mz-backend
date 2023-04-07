import { ethers } from "ethers";
import { EventFilter, Filter } from "ethers/types/providers";
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
import * as s3Service from "./s3.service";

export const listenToEvents = async (): Promise<void> => {
  const provider = new ethers.JsonRpcProvider(Config.rpcUrl);
  const iSt3mz = new ethers.Interface(st3mzAbi);

  if (Config.eventsFromBlock === undefined && Config.eventsToBlock !== "") {
    // Get mint past events
    const pastMintFilter: Filter = {
      fromBlock: Config.eventsFromBlock,
      toBlock: Config.eventsToBlock,
      address: Config.contractAddress,
      topics: [ethers.id("Mint(address,uint256,string,uint256,uint256)")],
    };
    const mintLogs = await provider.getLogs(pastMintFilter);
    for (const mintLog of mintLogs) {
      const decodedLog = iSt3mz.decodeEventLog(
        "Mint",
        mintLog.data,
        mintLog.topics
      );
      await createNft(
        decodedLog.minter.toLowerCase(),
        Number(decodedLog.id),
        decodedLog.uri,
        Number(decodedLog.supply),
        decodedLog.price
      );
    }

    // Get buy past events
    const pastBuyFilter: Filter = {
      fromBlock: Config.eventsFromBlock,
      toBlock: Config.eventsToBlock,
      address: Config.contractAddress,
      topics: [ethers.id("Buy(address,uint256,uint256)")],
    };
    const buyLogs = await provider.getLogs(pastBuyFilter);
    for (const buyLog of buyLogs) {
      const decodedLog = iSt3mz.decodeEventLog(
        "Buy",
        buyLog.data,
        buyLog.topics
      );
      await updateNftOwner(
        decodedLog.buyer.toLowerCase(),
        Number(decodedLog.id),
        decodedLog.amount
      );
    }
  }

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

// Create NFT in DB
const createNft = async (
  minterAddress: string,
  id: number,
  uri: string,
  supply: number,
  price: bigint
): Promise<void> => {
  await accountRepository.findOrCreate({
    where: { address: minterAddress },
    defaults: { address: minterAddress },
  });

  try {
    let metadata = new Metadata();
    try {
      const { data: metadata_ } = await axios.get(
        uri.replace("ipfs://", Config.ipfsGateway)
      );
      metadata = metadata_;

      if (metadata.file) {
        const { data: file } = await axios.get(
          metadata.file.replace("ipfs://", Config.ipfsGateway),
          { responseType: "arraybuffer" }
        );
        metadata.cachedFile = await s3Service.uploadFile(
          id.toString(),
          metadata.file.split("/").pop() || `track.${metadata.format}`,
          Buffer.from(file, "binary")
        );
      }
      if (metadata.image) {
        const { data: image } = await axios.get(
          metadata.image.replace("ipfs://", Config.ipfsGateway),
          { responseType: "arraybuffer" }
        );
        metadata.cachedImage = await s3Service.uploadFile(
          id.toString(),
          metadata.image.split("/").pop() || `image.png`,
          Buffer.from(image, "binary")
        );
      }
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
      cachedImage: metadata.cachedImage,
      file: metadata.file,
      cachedFile: metadata.cachedFile,
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

    for (const [i, stem] of metadata.stems.entries()) {
      const { data: stemFile } = await axios.get(
        stem.file.replace("ipfs://", Config.ipfsGateway),
        { responseType: "arraybuffer" }
      );
      const cachedFile = await s3Service.uploadFile(
        id.toString(),
        stem.file.split("/").pop() || `stem_${i}.${metadata.format}`,
        Buffer.from(stemFile, "binary")
      );
      await stemRepository.create({
        nftId: id,
        file: stem.file,
        cachedFile: cachedFile,
        description: stem.description,
      });
    }
  } catch (error) {
    console.error(`ERROR creating NFT ${id}: ${error}`);
  }
};

// Update NFT owner and available supply after a purchase in DB
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
