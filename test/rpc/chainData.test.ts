import { ethers } from "ethers";
import {
  getAccountData,
  getAccountFieldValue,
  getBlockNumberAndTxIdx,
  getFieldIdxHeaderExtraDataLen,
  getFieldIdxTxContractDataIdx,
  getFieldIdxTxDataLength,
  getFullBlock,
  getHeaderFieldValue,
  getRawTransaction,
  getReceiptFieldValue,
  getSolidityNestedMappingValue,
  getStorageFieldValue,
  getTxFieldValue,
  getTxHash,
} from "../../src";
import { AccountField, HeaderField, ReceiptField, TxField, bytes32 } from "../../src";
import {
  getFieldIdxHeaderLogsBloomIdx,
  getFieldIdxHeaderTxHash,
  getFieldIdxHeaderTxSize,
  getFieldIdxTxCalldataIdx,
  getFieldIdxTxType,
  getFieldIdxTxBlockNumber,
  getFieldIdxTxIndex,
  getFieldIdxTxFunctionSelector,
  getFieldIdxTxCalldataHash,
  getFieldIdxReceiptTxType,
  getFieldIdxReceiptBlockNumber,
  getFieldIdxReceiptTxIndex,
  getFieldIdxReceiptLogIdx,
  getFieldIdxReceiptDataIdx,
  getFieldIdxReceiptLogAddress,
} from "../../src";
import fs from "fs";
import { AxiomV2FieldConstant } from "../../src/constants";

function getMainnetTestCases(subquery: string): any {
  const testCases = fs.readFileSync("test/rpc/data/mainnet/" + subquery + ".json", "utf8");
  return JSON.parse(testCases);
}

export function getHeaderMainnetTestCases(): any {
  return getMainnetTestCases("header");
}
export function getAccountMainnetTestCases(): any {
  return getMainnetTestCases("account");
}
export function getStorageMainnetTestCases(): any {
  return getMainnetTestCases("storage");
}
export function getTxMainnetTestCases(): any {
  return getMainnetTestCases("tx");
}
export function getReceiptMainnetTestCases(): any {
  return getMainnetTestCases("receipt");
}
export function getSolidityMainnetTestCases(): any {
  return getMainnetTestCases("solidity");
}

describe("ChainData query tests", () => {
  const MATIC_ADDR = "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0";
  const UNI_V3_FACTORY_ADDR = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

  const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URI as string);

  const headerTestCases = getHeaderMainnetTestCases();
  const accountTestCases = getAccountMainnetTestCases();
  const storageTestCases = getStorageMainnetTestCases();
  const txTestCases = getTxMainnetTestCases();
  const receiptTestCases = getReceiptMainnetTestCases();
  const solidityTestCases = getSolidityMainnetTestCases();

  test("get header fields", async () => {
    for (const { subquery, value } of headerTestCases["get header fields"]) {
      const field_value = await getHeaderFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
    // const blobGasUsed = await getHeaderFieldValue(provider, { blockNumber, fieldIdx: HeaderField.BlobGasUsed });
    // expect(blobGasUsed).toEqual(null);
    // const excessBlobGas = await getHeaderFieldValue(provider, { blockNumber, fieldIdx: HeaderField.ExcessBlobGas });
    // expect(excessBlobGas).toEqual(null);
    // const parentBeaconBlockRoot = await getHeaderFieldValue(provider, { blockNumber, fieldIdx: HeaderField.ParentBeaconBlockRoot });
    // expect(parentBeaconBlockRoot).toEqual(null);
  }, 10000);

  test("header field negative test cases", async () => {
    // Shanghai upgrade for withdrawalsRoot was at block 17034870
    const withdrawalsRoot = await getHeaderFieldValue(provider, {
      blockNumber: 17000000,
      fieldIdx: HeaderField.WithdrawalsRoot,
    });
    expect(withdrawalsRoot).toEqual(null);
  }, 10000);

  test("get special header fields", async () => {
    for (const { subquery, value } of headerTestCases["get special header fields"]) {
      const field_value = await getHeaderFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get header field logs bloom", async () => {
    for (const { subquery, value } of headerTestCases["get header field logs bloom"]) {
      const field_value = await getHeaderFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get account fields", async () => {
    for (const { subquery, value } of accountTestCases["get account fields"]) {
      const field_value = await getAccountFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get storage slot", async () => {
    for (const { subquery, value } of storageTestCases["get storage slot"]) {
      const field_value = await getStorageFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get tx field value (block 8000000)", async () => {
    for (const { subquery, value } of txTestCases["get tx field value (block 8000000)"]) {
      const field_value = await getTxFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get tx field value (block 17874577)", async () => {
    for (const { subquery, value } of txTestCases["get tx field value (block 17874577)"]) {
      const field_value = await getTxFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get tx field value w/ access list in tx", async () => {
    for (const { subquery, value } of txTestCases["get tx field value w/ access list in tx"]) {
      const field_value = await getTxFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  });

  // test("get tx field value (supplying external tx object)", async () => {
  //   const txHash = "0x540d8ddec902752fdac71a44274513b80b537ce9d8b60ab6668078b583e17453";
  //   const { blockNumber, txIdx } = await getBlockNumberAndTxIdx(provider, txHash) as { blockNumber: number, txIdx: number };

  //   const tx = await provider.getTransaction(txHash);
  //   if (!tx) {
  //     throw new Error("tx not found");
  //   }

  //   const chainId = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: TxField.ChainId }, console, tx);
  //   expect(chainId).toEqual(bytes32(1n));
  //   const nonce = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: TxField.Nonce }, console, tx);
  //   expect(nonce).toEqual(bytes32(4));
  //   const maxPriorityFeePerGas = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: TxField.MaxPriorityFeePerGas }, console, tx);
  //   expect(maxPriorityFeePerGas).toEqual(bytes32(100000000n));
  //   const maxFeePerGas = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: TxField.MaxFeePerGas }, console, tx);
  //   expect(maxFeePerGas).toEqual(bytes32(23249354679n));
  //   const gasLimit = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: TxField.GasLimit }, console, tx);
  //   expect(gasLimit).toEqual(bytes32(352692n));
  //   const to = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: TxField.To }, console, tx);
  //   expect(to).toEqual(bytes32("0x253553366Da8546fC250F225fe3d25d0C782303b"));
  //   const value = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: TxField.Value }, console, tx);
  //   expect(value).toEqual(bytes32(2750421866180485n));
  // }, 10000);

  test("get tx calldataIdx value", async () => {
    for (const { subquery, value } of txTestCases["get tx calldataIdx value"]) {
      const field_value = await getTxFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get tx contract data field values (tx too large; will be null)", async () => {
    for (const { subquery, value } of txTestCases[
      "get tx contract data field values (tx too large; will be null)"
    ]) {
      const field_value = await getTxFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get tx special field values (tx too large; will be null)", async () => {
    for (const { subquery, value } of txTestCases[
      "get tx special field values (tx too large; will be null)"
    ]) {
      const field_value = await getTxFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get tx special field values: contract creation (tx too large; will be null)", async () => {
    for (const { subquery, value } of txTestCases[
      "get tx special field values: contract creation (tx too large; will be null)"
    ]) {
      const field_value = await getTxFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get tx special field values: EOA transfer", async () => {
    for (const { subquery, value } of txTestCases["get tx special field values: EOA transfer"]) {
      const field_value = await getTxFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get tx special field values: tx data length (tx too large; will be null)", async () => {
    for (const { subquery, value } of txTestCases[
      "get tx special field values: tx data length (tx too large; will be null)"
    ]) {
      const field_value = await getTxFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get receipt field value", async () => {
    for (const { subquery, value } of receiptTestCases["get receipt field value"]) {
      const field_value = await getReceiptFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  // test("get receipt field value (via external receipt object)", async () => {
  //   let txHash = "0x540d8ddec902752fdac71a44274513b80b537ce9d8b60ab6668078b583e17453";
  //   let blockNumber = 17874577;
  //   let txIdx = 96;

  //   const receipt = await provider.getTransactionReceipt(txHash);
  //   if (!receipt) {
  //     throw new Error("receipt is null");
  //   }

  //   let value = await getReceiptFieldValue(provider, { blockNumber, txIdx, fieldOrLogIdx: ReceiptField.Status, eventSchema: "0x", topicOrDataOrAddressIdx: 0 }, console, receipt);
  //   expect(value).toEqual(bytes32(1));
  // }, 10000);

  test("get receipt logsBloom field value", async () => {
    for (const { subquery, value } of receiptTestCases["get receipt logsBloom field value"]) {
      const field_value = await getReceiptFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get receipt special field value", async () => {
    for (const { subquery, value } of receiptTestCases["get receipt special field value"]) {
      const field_value = await getReceiptFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get receipt logIdx value", async () => {
    for (const { subquery, value } of receiptTestCases["get receipt logIdx value"]) {
      const field_value = await getReceiptFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("Get solidity nested mapping value", async () => {
    for (const { subquery, value } of solidityTestCases["Get solidity nested mapping value"]) {
      const field_value = await getSolidityNestedMappingValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);
});
