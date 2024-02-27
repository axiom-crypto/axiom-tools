import { shortenedHex, removeZerosLeft } from "../../src";

describe("Bytes", () => {
  test("shortened hex", () => {
    let val = shortenedHex(0);
    expect(val).toEqual("0x0");
    val = shortenedHex(1);
    expect(val).toEqual("0x1");
    val = shortenedHex(100000);
    expect(val).toEqual("0x186a0");
  });

  test("remove zeros left", () => {
    let val = removeZerosLeft("0x001230");
    expect(val).toEqual("0x1230");
    val = removeZerosLeft("0x0001230");
    expect(val).toEqual("0x1230");
    val = removeZerosLeft("0001230");
    expect(val).toEqual("0x1230");
  });
});
