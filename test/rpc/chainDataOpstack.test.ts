import { ethers } from "ethers";
import { getBlockNumberAndTxIdx, getTxFieldValue, TxField } from "../../src";

const optimismTx = [
  "0x25214e8c125f7c9749614d8f81e162e4cca5c86a94d532628edc70c3016163e2",
  "0x58f48d2419d09a1797de977e1c4fdffc49b32a799c8d493479a5882201309469",
  "0x0c369868122e1af5d10d43e67bc970e1b62444be4ea8886e1fad6234b86b431f",
]

const optimismSystem = [
  "0xbd5ac52db73613d6586832ce34762ba6a1e1f241d8d9e6e6412acbab32054a41",
  "0x1406a2d4cde0551c8b5837bb51233f18e375fdf303ce6ace10fca9dc8fed9c71",
  "0x65189cfa8f7678b058e88de47dbb8c74635598bc7e441dc8d180803d357605d4",
];

const baseTx = [
  "0x3ed6efd80791ab4108c2ea9e696100b79e83e82f0ae4d6087e189b90bb1b22e8",
  "0xa4f3f097bae6aab76a035440effa0b752cb56d9098c25f709624315c7ffd19a9",
  "0x012c8d77174aa6ab8e63933a2f74f69fe9820915ab44c5d844da9c7276a51ff0",
];

const baseSystem = [
  "0xcbbe74fd041d136b4bccab96f50a32e41326afb464ae69727b19cdf78e6ff03b",
  "0x5eb5119f26565c90ff816ae74869459b9338694196cedd0f26ca04831643d413",
  "0xe990e2c2531707144a6d60d4a74f0d19f8e905b9065678988e3f1a70d20db05a",
];

describe("Chaindata OpStack", () => {
  const providerOptimism = new ethers.JsonRpcProvider(
    process.env.PROVIDER_URI_10 as string,
  );

  const providerBase = new ethers.JsonRpcProvider(
    process.env.PROVIDER_URI_8453 as string,
  );

  test("Optimism: Check that we allow tx types < 0x03", async () => {
    for await (const txHash of optimismTx) {
      const { blockNumber, txIdx } = await getBlockNumberAndTxIdx(providerOptimism, txHash);
      if (blockNumber === null || txIdx === null) {
        throw new Error("Error getting block number and tx idx");
      }
      const val = await getTxFieldValue(providerOptimism, {
        blockNumber,
        txIdx,
        fieldOrCalldataIdx: TxField.To,
      });
      expect(val).not.toBeNull();
    }
  });

  test("Optimism: Check that we block tx type 0x7E", async () => {
    for await (const txHash of optimismSystem) {
      const { blockNumber, txIdx } = await getBlockNumberAndTxIdx(providerOptimism, txHash);
      if (blockNumber === null || txIdx === null) {
        throw new Error("Error getting block number and tx idx");
      }
      const val = await getTxFieldValue(providerOptimism, {
        blockNumber,
        txIdx,
        fieldOrCalldataIdx: TxField.To,
      });
      expect(val).toBeNull();
    }
  });

  test("Base: Check that we allow tx types < 0x03", async () => {
    for await (const txHash of baseTx) {
      const { blockNumber, txIdx } = await getBlockNumberAndTxIdx(providerBase, txHash);
      if (blockNumber === null || txIdx === null) {
        throw new Error("Error getting block number and tx idx");
      }
      const val = await getTxFieldValue(providerBase, {
        blockNumber,
        txIdx,
        fieldOrCalldataIdx: TxField.To,
      });
      expect(val).not.toBeNull();
    }
  });

  test("Base: Check that we block tx type 0x7E", async () => {
    for await (const txHash of baseSystem) {
      const { blockNumber, txIdx } = await getBlockNumberAndTxIdx(providerBase, txHash);
      if (blockNumber === null || txIdx === null) {
        throw new Error("Error getting block number and tx idx");
      }
      const val = await getTxFieldValue(providerBase, {
        blockNumber,
        txIdx,
        fieldOrCalldataIdx: TxField.To,
      });
      expect(val).toBeNull();
    }
  });
});
