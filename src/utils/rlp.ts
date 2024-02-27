import { ethers } from "ethers";

export function formatDataRlp(values: any, obj: any): any {
  let layer: string[] = [];
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "string") {
      layer.push(obj[key]);
    } else if (typeof obj[key] === "object") {
      const r = formatDataRlp(values, obj[key]);
      layer.push(r);
    }
  }
  values = layer;
  return values;
}

export function objectToRlp(obj: any): string {
  let values: string[] = [];
  values = formatDataRlp(values, obj);
  return ethers.encodeRlp(values);
}

export function rlpEncodeBlockHeader(header: any): string | null {
  let blockHeader = [
    header.parentHash,
    header.sha3Uncles,
    header.miner,
    header.stateRoot,
    header.transactionsRoot,
    header.receiptsRoot,
    header.logsBloom,
    header.difficulty,
    header.number,
    header.gasLimit,
    header.gasUsed,
    header.timestamp,
    header.extraData,
    header.mixHash,
    header.nonce,
    header.baseFeePerGas,
    header.withdrawalsRoot,
    header.blobGasUsed ?? header.dataGasUsed, // blobGasUsed is spec in 4844, dataGasUsed is spec in 4788
    header.excessBlobGas ?? header.excessDataGas, // excessBlobGas is spec in 4844, excessDataGas is spec in 4788
    header.parentBeaconBlockRoot,
  ];
  try {
    blockHeader = blockHeader
      .map((x) => {
        if (x === undefined) {
          return undefined;
        }
        if (x === "0x0") {
          return "0x";
        }
        if (x.length % 2 !== 0) {
          return "0x" + x.slice(2).padStart(x.length - 1, "0");
        }
        return x;
      })
      .filter((x) => x); // remove undefined items
    return ethers.encodeRlp(blockHeader);
  } catch (e) {
    console.warn(e);
    return null;
  }
}

export function rlpEncodeTransaction(tx: any): string | null {
  const accessListRlp = formatDataRlp([] as string[], tx.accessList ?? {});
  let transaction = [
    Number(tx.type) === 0 ? null : tx.chainId,
    tx.nonce,
    Number(tx.type) < 2 ? tx.gasPrice : null,
    tx.maxPriorityFeePerGas,
    tx.maxFeePerGas,
    tx.gas ?? tx.gasLimit,
    tx.to,
    tx.value,
    tx.input,
    Number(tx.type) !== 0 ? accessListRlp : null,
    Number(tx.type) === 3 ? tx.maxFeePerBlobGas : null,
    Number(tx.type) === 3 ? tx.blobVersionedHashes : null,
    tx.v ?? tx.yParity,
    tx.r,
    tx.s,
  ];
  try {
    transaction = transaction
      .map((x) => {
        if (x === undefined || x === null) {
          return undefined;
        }
        if (x === "0x0") {
          return "0x";
        }
        if (typeof x === "string" && x.length % 2 !== 0) {
          return "0x" + x.slice(2).padStart(x.length - 1, "0");
        }
        return x;
      })
      .filter((x) => x); // remove undefined/null items
    let rlp = ethers.encodeRlp(transaction);
    if (Number(tx.type) > 0) {
      const padHexType = ethers.solidityPacked(["uint8"], [tx.type])
      rlp = padHexType + rlp.slice(2);
    }
    return rlp;
  } catch (e) {
    console.warn(e);
    return null;
  }
}
