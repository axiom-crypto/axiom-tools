import { ethers } from "ethers";
import { TxField, getBlockNumberAndTxIdx, getTxFieldValue } from "../../src";

const sepoliaTxType3 = [
  "0xad7dd29f8f3c3f0680631a89b2fefd7dfcc3019bc19e6e4d4bb3fd65a12ae54a",
  "0xbea5ec4587db8363f262b3562c05e5166dbe8bae39d69cf006f0e9f288f18def",
  "0x832fffc6a57ea1c907fd6dd23b8b3a1ea93158ef3c818452473dbaf5fc066b06",
  "0x8e6de26d3a47a996da2bbb077fac738125a7d751c637cd1a262acfe1ba4312fd",
  "0xd9e943b493bfe3ddb190673e0a969bfac9d4af8f86be7c66e0400c00f05367bc",
];

const sepoliaTxType2 = [
  "0x5f81624938de3e5145b54cebe38d7418eb3b122a6759b70b7aeaf5e2e7499314",
  "0xa86accf260b9b9b8e634cf816da4ee87f5193892028a7215de5b6aeae780f72b",
  "0x8f7529231530970c8d2208a59c83ce11b4ab8d48577a373cd51c5560632f15c6",
];

const sepoliaTxType0 = [
  "0x6a35bbd6b1f74aade93e1ffd8416fad713421c645aae45f024f180ff552498d8",
  "0x87dbf175b899474bc0bb29e3e6b0afb8f831b4dd64ae742b6770d84853a06790",
  "0x0c2fdc47cd33ce9cf85adbe6286b0170ea3d0808fca87c066d71f118258c8e03",
];

describe("ChainData Sepolia", () => {
  const provider = new ethers.JsonRpcProvider(
    process.env.PROVIDER_URI_SEPOLIA as string,
  );

  test("check that we block tx type 3", async () => {
    for await (const txHash of sepoliaTxType3) {
      const { blockNumber, txIdx } = await getBlockNumberAndTxIdx(provider, txHash);
      if (blockNumber === null || txIdx === null) {
        throw new Error("Error getting block number and tx idx");
      }
      const val = await getTxFieldValue(provider, {
        blockNumber,
        txIdx,
        fieldOrCalldataIdx: TxField.To,
      });
      expect(val).toBeNull();
    }

    for await (const txHash of [...sepoliaTxType2, ...sepoliaTxType0]) {
      const { blockNumber, txIdx } = await getBlockNumberAndTxIdx(provider, txHash);
      if (blockNumber === null || txIdx === null) {
        throw new Error("Error getting block number and tx idx");
      }
      const val = await getTxFieldValue(provider, {
        blockNumber,
        txIdx,
        fieldOrCalldataIdx: TxField.To,
      });
      expect(val).not.toBeNull();
    }
  }, 60000);
});