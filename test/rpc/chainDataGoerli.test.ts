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
  getRawReceipt,
  getRawTransaction,
  getReceiptFieldValue,
  getSolidityNestedMappingValue,
  getStorageFieldValue,
  getTxFieldValue,
  getTxHash,
} from "../../src";
import {
  AccountField,
  HeaderField,
  ReceiptField,
  TxField,
  bytes32,
} from "../../src";
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

function getGoerliTestCases(subquery: string): any {
  const testCases = fs.readFileSync("test/rpc/data/goerli/" + subquery + ".json", "utf8");
  return JSON.parse(testCases);
}

export function getHeaderGoerliTestCases(): any {
  return getGoerliTestCases("header");
}
export function getAccountGoerliTestCases(): any {
  return getGoerliTestCases("account");
}
export function getStorageGoerliTestCases(): any {
  return getGoerliTestCases("storage");
}
export function getTxGoerliTestCases(): any {
  return getGoerliTestCases("tx");
}
export function getReceiptGoerliTestCases(): any {
  return getGoerliTestCases("receipt");
}

describe("ChainData query tests", () => {
  const MATIC_ADDR = "0xDA5F92B81B7095b5763a09BD4A668DcfE6F3b133";
  const UNI_V3_FACTORY_ADDR = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

  const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URI_GOERLI as string);
  const headerTestCases = getHeaderGoerliTestCases();
  const accountTestCases = getAccountGoerliTestCases();
  const storageTestCases = getStorageGoerliTestCases();
  const txTestCases = getTxGoerliTestCases();
  const receiptTestCases = getReceiptGoerliTestCases();

  test("get header fields", async () => {
    for (const { subquery, value } of headerTestCases["get header fields"]) {
      const field_value = await getHeaderFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("header field negative test cases", async () => {
    // Shanghai upgrade for withdrawalsRoot was at block 1000000
    const withdrawalsRoot = await getHeaderFieldValue(provider, { blockNumber: 1000000, fieldIdx: HeaderField.WithdrawalsRoot });
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

  test("get tx field value", async () => {
    for (const { subquery, value } of txTestCases["get tx field value"]) {
      const field_value = await getTxFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get problem tx field value", async () => {
    for (const { subquery, value } of txTestCases["get problem tx field value"]) {
      const field_value = await getTxFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get problem receipt field value (log data size too large)", async () => {
    for (const { subquery, value } of receiptTestCases["get problem receipt field value (log data size too large)"]) {
      const field_value = await getReceiptFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  // test("get tx calldataIdx value", async () => {
  //   // for txHash = "0xe64c1d17a69ee91d41f054fd981f4ad073d9f807e1ddfad78b4a696a4a79f921";
  //   const blockNumber = 9800000;
  //   const txIdx = 5;
  //   let calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(0) });
  //   expect(calldataValue).toEqual("0x0000000000000000000000000000000000000000000000000000000000000100");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(1) });
  //   expect(calldataValue).toEqual("0x000000000000000000000000b392448932f6ef430555631f765df0dfae34eff3");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(2) });
  //   expect(calldataValue).toEqual("0x0000000000000000000000000000000000000000000000000000000001e13380");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(3) });
  //   expect(calldataValue).toEqual("0x9923eb9400000003082a0a4936bd94a9078de18bea9fb1e023ecfb31b44c5f9d");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(4) });
  //   expect(calldataValue).toEqual("0x000000000000000000000000231b0ee14048e9dccd1d247744d114a4eb5e8e63");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(5) });
  //   expect(calldataValue).toEqual("0x0000000000000000000000000000000000000000000000000000000000000140");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(6) });
  //   expect(calldataValue).toEqual("0x0000000000000000000000000000000000000000000000000000000000000001");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(7) });
  //   expect(calldataValue).toEqual("0x0000000000000000000000000000000000000000000000000000000000000000");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(8) });
  //   expect(calldataValue).toEqual("0x0000000000000000000000000000000000000000000000000000000000000006");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(9) });
  //   expect(calldataValue).toEqual("0x7a65726f6b700000000000000000000000000000000000000000000000000000");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(10) });
  //   expect(calldataValue).toEqual("0x0000000000000000000000000000000000000000000000000000000000000001");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(11) });
  //   expect(calldataValue).toEqual("0x0000000000000000000000000000000000000000000000000000000000000020");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(12) });
  //   expect(calldataValue).toEqual("0x00000000000000000000000000000000000000000000000000000000000000a4");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(13) });
  //   expect(calldataValue).toEqual("0x8b95dd717610115e31b8be283a240f1b8ea09ca53abfdfaa17c79175efd8cfef");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(14) });
  //   expect(calldataValue).toEqual("0x62b37ab900000000000000000000000000000000000000000000000000000000");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(15) });
  //   expect(calldataValue).toEqual("0x0000003c00000000000000000000000000000000000000000000000000000000");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(16) });
  //   expect(calldataValue).toEqual("0x0000006000000000000000000000000000000000000000000000000000000000");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(17) });
  //   expect(calldataValue).toEqual("0x00000014b392448932f6ef430555631f765df0dfae34eff30000000000000000");
  //   calldataValue = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxCalldataIdx(18) });
  //   expect(calldataValue).toEqual("0x0000000000000000000000000000000000000000000000000000000000000000");
  // }, 10000);

  // test("get tx contract data field values", async () => {
  //   // Contract creation
  //   const contractCreateTxHash = "0x5a532ae8eb36dad0058b78f00ee459c42d58157dc11cc290e939b8aa91aa59d4";
  //   const { blockNumber, txIdx } = await getBlockNumberAndTxIdx(provider, contractCreateTxHash) as { blockNumber: number, txIdx: number };
  //   let value = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxContractDataIdx(0) });
  //   expect(value).toEqual("0x6060604052341561000c57fe5b5b60018054600160a060020a033316600160a0");
  //   value = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxContractDataIdx(284) });
  //   expect(value).toEqual("0xf517e648a165627a7a72305820c3039feace276128a8a24bc387d61714eecae7");
  //   value = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxContractDataIdx(285) });
  //   expect(value).toEqual("0x40de955c6578526a4a4027bebc00290000000000000000000000000000000000");
  // }, 10000);

  test("get tx special field values", async () => {
    for (const { subquery, value } of txTestCases["get tx special field values"]) {
      const field_value = await getTxFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }

    // // Contract creation 
    // NOTE: Incomplete for Goerli
    // const contractCreateTxHash = "0x5a532ae8eb36dad0058b78f00ee459c42d58157dc11cc290e939b8aa91aa59d4";
    // const { blockNumber: contractCreateBlockNumber, txIdx: contractCreateTxIdx } = await getBlockNumberAndTxIdx(provider, contractCreateTxHash) as { blockNumber: number, txIdx: number };
    // value = await getTxFieldValue(provider, { blockNumber: contractCreateBlockNumber, txIdx: contractCreateTxIdx, fieldOrCalldataIdx: getFieldIdxTxFunctionSelector() });
    // expect(value).toEqual(bytes32(AxiomV2FieldConstant.Tx.ContractDeploySelectorValue));

    // // EOA transfer
    // const eoaTransferTxHash = "0xb1257d8484c43929d7bae46b2aecd509e5d9278273063c9bac2a2d9cb4f1c9f1";
    // const { blockNumber: eoaTransferBlockNumber, txIdx: eoaTransferTxIdx } = await getBlockNumberAndTxIdx(provider, eoaTransferTxHash) as { blockNumber: number, txIdx: number };
    // value = await getTxFieldValue(provider, { blockNumber: eoaTransferBlockNumber, txIdx: eoaTransferTxIdx, fieldOrCalldataIdx: getFieldIdxTxFunctionSelector() });
    // expect(value).toEqual(bytes32(AxiomV2FieldConstant.Tx.NoCalldataSelectorValue));

    // value = await getTxFieldValue(provider, { blockNumber, txIdx, fieldOrCalldataIdx: getFieldIdxTxDataLength() });
    // expect(value).toEqual("0x0000000000000000000000000000000000000000000000000000000000011104");
  }, 10000);

  test("get receipt field value", async () => {
    for (const { subquery, value } of receiptTestCases["get receipt field value"]) {
      const field_value = await getReceiptFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  test("get receipt logsBloom field value", async () => {
    for (const { subquery, value } of receiptTestCases["get receipt logsBloom field value"]) {
      const field_value = await getReceiptFieldValue(provider, subquery);
      expect(field_value).toEqual(value);
    }
  }, 10000);

  // test("get receipt special field value", async () => {
  //   const txHash = "0x190414997454151f9bd4bc9c60fbae709bd2301f4d36adbe246b27157dde83ac"; // rug tx?
  //   const { blockNumber, txIdx } = await getBlockNumberAndTxIdx(provider, txHash) as { blockNumber: number, txIdx: number };
  //   let value = await getReceiptFieldValue(provider, { blockNumber, txIdx, fieldOrLogIdx: getFieldIdxReceiptTxType(), eventSchema: ethers.ZeroHash, topicOrDataOrAddressIdx: 0 });
  //   expect(value).toEqual(bytes32(2));
  //   value = await getReceiptFieldValue(provider, { blockNumber, txIdx, fieldOrLogIdx: getFieldIdxReceiptBlockNumber(), eventSchema: ethers.ZeroHash, topicOrDataOrAddressIdx: 0 });
  //   expect(value).toEqual(bytes32(17500000));
  //   value = await getReceiptFieldValue(provider, { blockNumber, txIdx, fieldOrLogIdx: getFieldIdxReceiptTxIndex(), eventSchema: ethers.ZeroHash, topicOrDataOrAddressIdx: 0 });
  //   expect(value).toEqual(bytes32(119));
  // }, 10000);

  // test("get receipt logIdx value", async () => {
  //   const txHash = "0xe64c1d17a69ee91d41f054fd981f4ad073d9f807e1ddfad78b4a696a4a79f921";
  //   const { blockNumber, txIdx } = await getBlockNumberAndTxIdx(provider, txHash) as { blockNumber: number, txIdx: number };

  //   const eventSchema = "0x65412581168e88a1e60c6459d7f44ae83ad0832e670826c05a4e2476b57af752";
  //   let receiptValue = await getReceiptFieldValue(provider, { blockNumber, txIdx, fieldOrLogIdx: getFieldIdxReceiptLogIdx(7), eventSchema, topicOrDataOrAddressIdx: 0 });
  //   expect(receiptValue).toEqual("0x65412581168e88a1e60c6459d7f44ae83ad0832e670826c05a4e2476b57af752");
  //   receiptValue = await getReceiptFieldValue(provider, { blockNumber, txIdx, fieldOrLogIdx: getFieldIdxReceiptLogIdx(7), eventSchema, topicOrDataOrAddressIdx: 1 });
  //   expect(receiptValue).toEqual("0x7610115e31b8be283a240f1b8ea09ca53abfdfaa17c79175efd8cfef62b37ab9");
  //   receiptValue = await getReceiptFieldValue(provider, { blockNumber, txIdx, fieldOrLogIdx: getFieldIdxReceiptLogIdx(7), eventSchema, topicOrDataOrAddressIdx: 2 });
  //   // Expect invalid topic index
  //   expect(receiptValue).toEqual(null);
  //   receiptValue = await getReceiptFieldValue(provider, { blockNumber, txIdx, fieldOrLogIdx: getFieldIdxReceiptLogIdx(7), eventSchema, topicOrDataOrAddressIdx: getFieldIdxReceiptDataIdx(0) });
  //   expect(receiptValue).toEqual("0x000000000000000000000000000000000000000000000000000000000000003c");
  //   receiptValue = await getReceiptFieldValue(provider, { blockNumber, txIdx, fieldOrLogIdx: getFieldIdxReceiptLogIdx(7), eventSchema, topicOrDataOrAddressIdx: getFieldIdxReceiptDataIdx(1) });
  //   expect(receiptValue).toEqual("0x0000000000000000000000000000000000000000000000000000000000000040");
  //   receiptValue = await getReceiptFieldValue(provider, { blockNumber, txIdx, fieldOrLogIdx: getFieldIdxReceiptLogIdx(7), eventSchema, topicOrDataOrAddressIdx: getFieldIdxReceiptDataIdx(2) });
  //   expect(receiptValue).toEqual("0x0000000000000000000000000000000000000000000000000000000000000014");
  //   receiptValue = await getReceiptFieldValue(provider, { blockNumber, txIdx, fieldOrLogIdx: getFieldIdxReceiptLogIdx(7), eventSchema, topicOrDataOrAddressIdx: getFieldIdxReceiptDataIdx(3) });
  //   expect(receiptValue).toEqual("0xb392448932f6ef430555631f765df0dfae34eff3000000000000000000000000");
  //   receiptValue = await getReceiptFieldValue(provider, { blockNumber, txIdx, fieldOrLogIdx: getFieldIdxReceiptLogIdx(7), eventSchema, topicOrDataOrAddressIdx: getFieldIdxReceiptLogAddress() });
  //   expect(receiptValue).toEqual(bytes32('0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63'));
  // }, 10000);

  // test("Get solidity nested mapping value", async () => {
  //   const blockNumber = 9000000;
  //   const addr = UNI_V3_FACTORY_ADDR;
  //   const mappingSlot = "5";
  //   const mappingDepth = 3;
  //   const keys: [string, string, string, string] = [
  //     bytes32("0x0000000000085d4780b73119b644ae5ecd22b376"),
  //     bytes32("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"),
  //     bytes32(3000),
  //     "",
  //   ];
  //   const value = await getSolidityNestedMappingValue(provider, { blockNumber, addr, mappingSlot, mappingDepth, keys });
  //   expect(value).toEqual(bytes32("0xf5148fbdae394c553d019b4caeffc5f845dcd12c"));
  // }, 10000);
});
