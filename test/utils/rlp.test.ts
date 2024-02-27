import { ethers } from "ethers";
import {
  getFullBlock,
  rlpEncodeBlockHeader,
  getRawTransaction,
  rlpEncodeTransaction
} from "../../src";

const sepoliaBlocks = [
  // type 3
  5191458,
  5191454,
  5191448,
  5191430,
  5191447,
  5191431,
  5191548,
  5191525,
  5091454,
  4000000,
  3000000,
];

const sepoliaTransactions = [
  // type 3
  "0xad7dd29f8f3c3f0680631a89b2fefd7dfcc3019bc19e6e4d4bb3fd65a12ae54a",
  "0xbea5ec4587db8363f262b3562c05e5166dbe8bae39d69cf006f0e9f288f18def",
  "0x832fffc6a57ea1c907fd6dd23b8b3a1ea93158ef3c818452473dbaf5fc066b06",
  "0x8e6de26d3a47a996da2bbb077fac738125a7d751c637cd1a262acfe1ba4312fd",
  "0xd9e943b493bfe3ddb190673e0a969bfac9d4af8f86be7c66e0400c00f05367bc",

  // type 2
  "0x5f81624938de3e5145b54cebe38d7418eb3b122a6759b70b7aeaf5e2e7499314",
  "0xa86accf260b9b9b8e634cf816da4ee87f5193892028a7215de5b6aeae780f72b",
  "0x8f7529231530970c8d2208a59c83ce11b4ab8d48577a373cd51c5560632f15c6",

  // type 0
  "0x6a35bbd6b1f74aade93e1ffd8416fad713421c645aae45f024f180ff552498d8",
  "0x87dbf175b899474bc0bb29e3e6b0afb8f831b4dd64ae742b6770d84853a06790",
  "0x0c2fdc47cd33ce9cf85adbe6286b0170ea3d0808fca87c066d71f118258c8e03",
];


describe("RLP Sepolia", () => {
  const provider = new ethers.JsonRpcProvider(
    process.env.PROVIDER_URI_SEPOLIA as string,
  );

  test("check block RLP with type 3 tx", async () => {
    for await (const blockNumber of sepoliaBlocks) {
      const block = await getFullBlock(provider, blockNumber);
      const rlp = rlpEncodeBlockHeader(block) ?? "0x";
      const rlpHash = ethers.keccak256(rlp);
      expect(rlpHash).toEqual(block.hash);
    }
  });

  test("check sepolia RLP transactions of different types", async () => {
    for await (const txHash of sepoliaTransactions) {
      const tx = await getRawTransaction(provider, txHash);
      const rlp = rlpEncodeTransaction(tx);
      if (rlp === null) {
        throw new Error("Error encoding tx");
      }
      const rlpHash = ethers.keccak256(rlp);
      expect(rlpHash).toEqual(tx.hash);
    }
  });
});