import { ethers } from "ethers";
import { getRawReceipt, getRawTransaction, objectToRlp } from "../../src";

describe("basic RPC getter functions", () => {
  const provider = new ethers.JsonRpcProvider(
    process.env.PROVIDER_URI as string,
  );

  test(`get raw transaction`, async () => {
    const tx = await getRawTransaction(
      provider,
      "0x39a1a929926d3ce2a7eeb92066abe9ab74fe00ad372505fdb4c998a7a9886408",
    );
    expect(tx).toBeDefined();
  });

  test(`get undefined transaction`, async () => {
    const tx = await getRawTransaction(
      provider,
      "0x00a1a929926d3ce2a7eeb92066abe9ab74fe00ad372505fdb4c998a7a9886400",
    );
    expect(tx).toEqual(null);
  });

  test(`get raw transaction`, async () => {
    const receipt = await getRawReceipt(
      provider,
      "0x39a1a929926d3ce2a7eeb92066abe9ab74fe00ad372505fdb4c998a7a9886408",
    );
    expect(receipt).toBeDefined();
  });

  test(`get undefined transaction`, async () => {
    const receipt = await getRawReceipt(
      provider,
      "0x00a1a929926d3ce2a7eeb92066abe9ab74fe00ad372505fdb4c998a7a9886400",
    );
    expect(receipt).toEqual(null);
  });
});
