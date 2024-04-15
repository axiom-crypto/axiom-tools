import { PinataIpfsClient, QuicknodeIpfsClient } from "../../src";
import { LARGE_DATA, SIZE_DIFF_THRESHOLD, calculatePercentageDiff, generateRandomHexString, sleep } from "./ipfsTest";

describe("Additional IPFS scenarios to test", () => {
  const NUM_PINS = 5;

  const pinata = new PinataIpfsClient(process.env.PINATA_JWT);
  const quicknode = new QuicknodeIpfsClient(process.env.QUICKNODE_API_KEY as string, process.env.QUICKNODE_IPFS_URL as string);
  const ipfsClients = [
    pinata, 
    quicknode,
  ];

  let pinnedData: {[client: string]: {[cid: string]: string}} = {};

  test(`Large IPFS data`, async () => {
    for await (const client of ipfsClients) {
      const pin = await client.pin(LARGE_DATA);
      if (pin.status - 200 > 99) {
        throw new Error("Failed to write data to IPFS");
      }

      const size = await client.getSize(pin.value as string);
      if (size.status - 200 > 99) {
        throw new Error("Failed to get size of pinned data");
      }
      const diff = calculatePercentageDiff(size.value as number, LARGE_DATA.length);
      expect(diff).toBeLessThan(SIZE_DIFF_THRESHOLD);

      const read = await client.read(pin.value as string);
      if (read.status - 200 > 99) {
        throw new Error("Failed to read data from IPFS");
      }
      expect(read.value as string).toEqual(LARGE_DATA);
    }
  });

  
  test(`Pin multiple random data`, async () => {
    for await (const client of ipfsClients) {
      for await (const _ of Array(NUM_PINS).keys()) {
        const data = generateRandomHexString(2,7);
        const pin = await client.pin(data);
        if (pin.status - 200 > 99) {
          throw new Error("Failed to write data to IPFS");
        }
        pinnedData[client.getName()] = {
          ...pinnedData[client.getName()],
          [pin.value as string]: data,
        };
      }
    }
  }, 50000);

  test(`Read all pinned data`, async () => {
    for await (const client of ipfsClients) {
      for await (const [_clientStr, dataObj] of Object.entries(pinnedData)) {
        for await (const [cid, data] of Object.entries(dataObj)) {
          const read = await client.read(cid);
          if (read.status - 200 > 99) {
            throw new Error("Failed to read data from IPFS");
          }
          expect(read.value as string).toEqual(data);
        }
      }
    }
  }, 50000);

  test(`Unpin all data`, async () => {
    for await (const client of ipfsClients) {
      for await (const cid of Object.keys(pinnedData[client.getName()])) {
        const unpin = await client.unpin(cid);
        expect(unpin.value as boolean).toEqual(true);
      }
    }
  }, 50000);
});