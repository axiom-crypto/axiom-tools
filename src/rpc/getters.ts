import { ethers } from "ethers";
import { shortenedHex } from "../utils";

export async function getFullBlock(
  provider: ethers.JsonRpcProvider,
  blockNumber: number,
) {
  const fullBlock = await provider.send("eth_getBlockByNumber", [
    shortenedHex(blockNumber),
    true,
  ]);
  return fullBlock;
}

export async function getAccountData(
  provider: ethers.JsonRpcProvider,
  blockNumber: number,
  addr: string,
  slots: ethers.BigNumberish[],
) {
  const accountData = await provider.send("eth_getProof", [
    addr,
    slots,
    shortenedHex(blockNumber),
  ]);
  return accountData;
}

export async function getRawTransaction(
  provider: ethers.JsonRpcProvider,
  txHash: string,
): Promise<any | null> {
  const txData = await provider.send("eth_getTransactionByHash", [txHash]);
  return txData;
}

export async function getRawReceipt(
  provider: ethers.JsonRpcProvider,
  txHash: string,
): Promise<any | null> {
  const receiptData = await provider.send("eth_getTransactionReceipt", [
    txHash,
  ]);
  return receiptData;
}

export async function getTxHash(
  provider: ethers.JsonRpcProvider,
  blockNumber: number,
  txIdx: number,
): Promise<string | null> {
  const tx = await provider.send("eth_getTransactionByBlockNumberAndIndex", [
    shortenedHex(blockNumber),
    shortenedHex(txIdx),
  ]);
  if (!tx || tx?.hash === "undefined") {
    return null;
  }
  return tx.hash;
}

export async function getBlockNumberAndTxIdx(
  provider: ethers.JsonRpcProvider,
  txHash: string,
): Promise<{
  blockNumber: number | null;
  txIdx: number | null;
}> {
  const tx = await getRawTransaction(provider, txHash);
  if (!tx) {
    return {
      blockNumber: null,
      txIdx: null,
    };
  }
  return {
    blockNumber: tx.blockNumber ? Number(tx.blockNumber) : null,
    txIdx: tx.transactionIndex ? Number(tx.transactionIndex) : null,
  };
}
