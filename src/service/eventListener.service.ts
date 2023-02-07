import { ethers } from "ethers";
import { EventFilter } from "ethers/types/providers";
import { st3mzAbi } from "../resources/st3mzAbi";

export const listenToEvents = (): void => {
  const network = process.env.NETWORK || "mainnet";
  const rpcUrl = process.env[`RPC_URL_${network.toUpperCase()}`];
  const contractAddress =
    process.env[`CONTRACT_ADDRESS_${network.toUpperCase()}`];
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const iSt3mz = new ethers.Interface(st3mzAbi);

  const mintFilter: EventFilter = {
    address: contractAddress,
    topics: [ethers.id("Mint(address,uint256,string,uint256,uint256)")],
  };
  provider.on(mintFilter, (log) => {
    const decodedLog = iSt3mz.decodeEventLog("Mint", log.data, log.topics);
    console.log(decodedLog.minter);
    console.log(decodedLog.id);
    console.log(decodedLog.uri);
    console.log(decodedLog.supply);
    console.log(decodedLog.price);
  });

  const buyFilter: EventFilter = {
    address: contractAddress,
    topics: [ethers.id("Buy(address,uint256,uint256)")],
  };
  provider.on(buyFilter, (log) => {
    const decodedLog = iSt3mz.decodeEventLog("Buy", log.data, log.topics);
    console.log(decodedLog.buyer);
    console.log(decodedLog.id);
    console.log(decodedLog.amount);
  });
};