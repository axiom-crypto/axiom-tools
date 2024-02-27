import { ethers } from "ethers";
import {
  bytes32,
  bytes32OrNull,
  getFullBlock,
  getRawReceipt,
  getRawTransaction,
  getTxHash,
  rlpEncodeTransaction,
} from "../../src";

describe("Compare jsonrpc Tx vs ethers Tx", () => {
  const provider = new ethers.JsonRpcProvider(
    process.env.PROVIDER_URI as string,
  );
  // const blockNumbers = [
  //   300005, 4000000, 8000000, 10000000, 12000000, 12500000, 13000000, 14000000,
  //   15000000, 16000000, 17000000, 18000000, 18400000,
  // ];
  const mainnetBlocks = [
    10000, // Frontier
    200000, // Frontier thawing
    1150000, // Homestead
    1920000, // DAO fork
    2463000, // Tangerine Whistle
    2675000, // Spurious Dragon
    4370000, // Byzantium
    7280000, // Constantinople
    9069000, // Istanbul
    9200000, // Muir Glacier
    11052984, // Staking deposit
    12244000, // Berlin
    12965000, // London
    13773000, // Arrow Glacier
    15050000, // Gray Glacier
    15537394, // Paris
    17034870, // Shanghai
  ];
  const txIdx = 0;

  const transactions = [
    // after block 200000:
    "0x5f7a1e2c69a6e2e098a09240ff9d9071abb61bbb4bbc37626b7f7958d168bff1",
    // after block 1150000:
    "0x38f299591902bfada359527fa6b9b597a959c41c6f72a3b484807fbf52dc8abe",
    // after block 1920000:
    "0x4677a93807b73a0875d3a292eacb450d0af0d6f0eec6f283f8ad927ec539a17b",
    // after block 2463000:
    "0xd418fc5d2871d28645f676637864e13ae2568ef40ae61c902924887ab5d40475",
    // after block 2675000:
    "0x427b0b68b1ccc46b01d99ed399b61c4ae681e22216035eb6953afc83ef463e17",
    // after block 4370000:
    "0x1421a887a02301ae127bf2cd4c006116053c9dc4a255e69ea403a2d77c346cf5",
    // after block 7280000:
    "0x84683c7adbabe359e83c2e8debdcc183cfde347ea93d08aa2b0c4eafe56fa27e",
    // after block 9069000:
    "0x97db74bf76e827c2eb490473a3556f619784fcacfa42e7830f6856237bbeb705",
    // after block 9200000:
    "0x0673374d420a78a6fe87c5accdb111739fe7c1d12ea8bb5d5ba7296503b56b9f",
    // after block 12244000:
    "0xac503dd98281d4d52c2043e297a6e684d175339a7ebf831605fe593f01ce82c3",
    "0xbb2aec6dd61e394d6383035497babd9da1c5d62d255744fb6df74d4ca9237f07",
    // after block 12965000 (3 tx types):
    "0x2ecd08e86079f08cfc27c326aa01b1c8d62f288d5961118056bac7da315f94d9",
    "0xf6a0743de5a49d44a87e3f050824a9e20b9bbacaa6227595b66a3a5653f13b92",
    "0x9a9ef0627ea3f968e28198f3ed702a5722a5aad4feb47cad6875ac5db0e6efea",
    // after block 13773000 (3 tx types):
    "0x5fc2adae80de60cf96d15d0607cd534b365499b568fb29180214913340fe96d0",
    "0xb2be368406308023b9ee037af54b637b1b0aac69604cb0ef3a2b1856eaf3a0b6",
    "0xc827f3d856270c744ffe9f534a6435aa06dce8bf847502ca318da719e1e3194a",
    // after block 15050000 (3 tx types):
    "0xaf8a8a310222520617b7f60285fa1a5051359ffa78f99e4dc22b1b6306b36774",
    "0x5d99dcbfa067a0b4b04967c2b623a6cec141855efe6f6c54b74ee35f38411b73",
    "0xacc456d95586b5fbf378403931abbb228224c97ddd5e247a99c99a670b0e4071",
    // after block 15537394 (3 tx types):
    "0x5ad934ee3bf2f8938d8518a3b978e81f178eaa21824ee52fef83338f786e7b59",
    "0x22d749c5302aae6698c54867c08399f838784522fadd53ffd024fe2f16f1052e",
    "0x99de44266793f7069fd164e13afb5e5476399905153c8cbfd614184a243ceb0b",
    // after block 17034870 (3 tx types):
    "0x0e8908e11dad841f433ab071f206833e7d00eeaef255e08a3e87f7c2a66e9ece",
    "0x363dd4fedaa08172e49141c816f6d600c58a66bc985871d20b37cefa68ff7af8",
    "0x171d7c0137360ea32c5300d3c57a42aba6511656735830e03428f521ee2ba2f7",
  ];

  for (const transaction of transactions) {
    test(`validate tx getter with RLP header calculation ${transaction}`, async () => {
      const tx = await getRawTransaction(provider, transaction);
      const txRlp = rlpEncodeTransaction(tx);
      if (txRlp === null) {
        throw new Error("txRlp is null");
      }
      const txHash = ethers.keccak256(txRlp);
      expect(txHash).toEqual(tx.hash);
    });
  }

  for (const [i, blockNum] of mainnetBlocks.entries()) {
    test(`${i}: Tx values for block number ${blockNum}`, async () => {
      const txHash = await getTxHash(provider, blockNum, txIdx);
      if (!txHash) {
        // No transactions in this block
        return;
      }
      const ethersTx = (await provider.getTransaction(txHash))!;
      const rawTx = await getRawTransaction(provider, txHash);
      // console.log(blockNum, "ethersTx", ethersTx);
      // console.log(blockNum, "rawTx", rawTx);
      // console.log(i, blockNum, "ethersTx.signature.v, networkV, rawTx.v", ethersTx.signature.v, ethersTx.signature.networkV, rawTx.v);

      // NOTE: chainId will not match because ethers adds this in whereas the raw provider query does not.
      // expect(bytes32OrNull(ethersTx.chainId)).toEqual(
      //   bytes32OrNull(rawTx.chainId),
      // );

      expect(bytes32(ethersTx.nonce)).toEqual(bytes32(rawTx.nonce));
      expect(bytes32OrNull(ethersTx.maxPriorityFeePerGas)).toEqual(
        bytes32OrNull(rawTx.maxPriorityFeePerGas),
      );
      expect(bytes32OrNull(ethersTx.maxFeePerGas)).toEqual(
        bytes32OrNull(rawTx.maxFeePerGas),
      );
      expect(bytes32(ethersTx.gasLimit)).toEqual(bytes32(rawTx.gas));
      expect(ethersTx.to?.toLowerCase()).toEqual(rawTx.to);
      expect(bytes32(ethersTx.value)).toEqual(bytes32(rawTx.value));
      expect(ethersTx.data).toEqual(rawTx.input);
      expect(bytes32(ethersTx.gasPrice)).toEqual(bytes32(rawTx.gasPrice));
      // expect(bytes32(ethersTx.signature.networkV as bigint)).toEqual(bytes32(rawTx.v));
      expect(bytes32(ethersTx.signature.r)).toEqual(bytes32(rawTx.r));
      expect(bytes32(ethersTx.signature.s)).toEqual(bytes32(rawTx.s));
    });
  }

  for (const [i, blockNum] of mainnetBlocks.entries()) {
    test(`${i} Receipt values for block number ${blockNum}`, async () => {
      const txHash = await getTxHash(provider, blockNum, txIdx);
      if (!txHash) {
        // No transactions in this block
        return;
      }
      const ethersRc = await provider.getTransactionReceipt(txHash);
      if (!ethersRc) {
        throw new Error("ethersRc is null");
      }
      const rawRc = await getRawReceipt(provider, txHash);
      if (!rawRc) {
        throw new Error("rawRc is null");
      }
      // console.log(blockNum, "ethersRc", ethersRc);
      // console.log(blockNum, "ethersRc logs", ethersRc.logs);
      // console.log(blockNum, "rawRc", rawRc);
      expect(bytes32OrNull(ethersRc.status)).toEqual(
        bytes32OrNull(rawRc.status),
      );

      // NOTE: postState will not match because ethers Receipt struct does not include it
      // expect(bytes32OrNull(ethersRc.postState)).toEqual(bytes32OrNull(rawRc.postState));

      expect(bytes32(ethersRc.cumulativeGasUsed)).toEqual(
        bytes32(rawRc.cumulativeGasUsed),
      );
      expect(ethersRc?.logs[0]?.transactionHash).toEqual(
        rawRc?.logs[0]?.transactionHash,
      );
    });
  }

  // test("generate list of transactions at various hard fork block numbers for all tx types", async () => {
  //   const findTx = async (startBlockNum: number) => {
  //     let txs: string[] = [];
  //     let types = [0, 1, 2];
  //     for (let i = startBlockNum; i < startBlockNum + 10000; i += 100) {
  //       const block = await getFullBlock(provider, i);
  //       if (!block) {
  //         continue;
  //       }
  //       if (block.transactions.length === 0) {
  //         continue;
  //       }
  //       for (let j = 0; j < block.transactions.length; j++) {
  //         const tx = block.transactions[j];
  //         const type = Number(tx.type);
  //         if (types.includes(type)) {
  //           txs.push(tx.hash);
  //           types.splice(types.indexOf(type), 1);
  //           console.log(startBlockNum, types, txs);
  //         }
  //         if (types.length === 0) {
  //           break;
  //         }
  //       }
  //     }
  //     return txs;
  //   };

  //   let foundTxHashes: { [key: string]: any } = {};
  //   for (const blockNum of mainnetBlocks) {
  //     console.log("start", blockNum);
  //     const txs = await findTx(blockNum);
  //     foundTxHashes[blockNum.toString()] = txs;
  //     console.log(blockNum, txs);
  //     console.log(foundTxHashes);
  //   }
  //   console.log(foundTxHashes);
  //   console.log("final");
  // }, 1000000);
});

/**
                  ethers Tx         raw Tx
blockNum  signature.v   networkV    v
300005    27            null        0x1b
4000000   27            37n         0x25
8000000   27            null        0x1b
10000000  28            38n         0x26
12000000  27            37n         0x25
12500000  28            38n         0x26
13000000  27            37n         0x25
14000000  27            null        0x0
15000000  28            null        0x1
16000000  28            38n         0x26
17000000  28            null        0x1
18000000  28            null        0x1
18400000  28            null        0x1
*/

/**
const transactions = [
  // after block 200000:
  '0x5f7a1e2c69a6e2e098a09240ff9d9071abb61bbb4bbc37626b7f7958d168bff1',
  // after block 1150000:
  '0x38f299591902bfada359527fa6b9b597a959c41c6f72a3b484807fbf52dc8abe',
  // after block 1920000:
  '0x4677a93807b73a0875d3a292eacb450d0af0d6f0eec6f283f8ad927ec539a17b',
  // after block 2463000:
  '0xd418fc5d2871d28645f676637864e13ae2568ef40ae61c902924887ab5d40475',
  // after block 2675000:
  '0x427b0b68b1ccc46b01d99ed399b61c4ae681e22216035eb6953afc83ef463e17',
  // after block 4370000:
  '0x1421a887a02301ae127bf2cd4c006116053c9dc4a255e69ea403a2d77c346cf5',
  // after block 7280000:
  '0x84683c7adbabe359e83c2e8debdcc183cfde347ea93d08aa2b0c4eafe56fa27e',
  // after block 9069000:
  '0x97db74bf76e827c2eb490473a3556f619784fcacfa42e7830f6856237bbeb705',
  // after block 9200000:
  '0x0673374d420a78a6fe87c5accdb111739fe7c1d12ea8bb5d5ba7296503b56b9f',
  // after block 12244000:
  '0xac503dd98281d4d52c2043e297a6e684d175339a7ebf831605fe593f01ce82c3',
  '0xbb2aec6dd61e394d6383035497babd9da1c5d62d255744fb6df74d4ca9237f07',
  // after block 12965000:
  '0x2ecd08e86079f08cfc27c326aa01b1c8d62f288d5961118056bac7da315f94d9',
  '0xf6a0743de5a49d44a87e3f050824a9e20b9bbacaa6227595b66a3a5653f13b92',
  '0x9a9ef0627ea3f968e28198f3ed702a5722a5aad4feb47cad6875ac5db0e6efea',
  // after block 13773000:
  '0x5fc2adae80de60cf96d15d0607cd534b365499b568fb29180214913340fe96d0',
  '0xb2be368406308023b9ee037af54b637b1b0aac69604cb0ef3a2b1856eaf3a0b6',
  '0xc827f3d856270c744ffe9f534a6435aa06dce8bf847502ca318da719e1e3194a',
  // after block 15050000:
  '0xaf8a8a310222520617b7f60285fa1a5051359ffa78f99e4dc22b1b6306b36774',
  '0x5d99dcbfa067a0b4b04967c2b623a6cec141855efe6f6c54b74ee35f38411b73',
  '0xacc456d95586b5fbf378403931abbb228224c97ddd5e247a99c99a670b0e4071',
  // after block 15537394:
  '0x5ad934ee3bf2f8938d8518a3b978e81f178eaa21824ee52fef83338f786e7b59',
  '0x22d749c5302aae6698c54867c08399f838784522fadd53ffd024fe2f16f1052e',
  '0x99de44266793f7069fd164e13afb5e5476399905153c8cbfd614184a243ceb0b',
  // after block 17034870:
  '0x0e8908e11dad841f433ab071f206833e7d00eeaef255e08a3e87f7c2a66e9ece',
  '0x363dd4fedaa08172e49141c816f6d600c58a66bc985871d20b37cefa68ff7af8',
  '0x171d7c0137360ea32c5300d3c57a42aba6511656735830e03428f521ee2ba2f7',
];
*/
