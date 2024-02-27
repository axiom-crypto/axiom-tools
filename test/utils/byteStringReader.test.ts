import { ByteStringReader } from "../../src";

describe("ByteStringReader", () => {
  test("Get remaining bytes", () => {
    const reader = new ByteStringReader("0x1234567890");
    const _val0 = reader.readInt(1);
    const _val1 = reader.readBytes(2);
    expect(reader.getNumBytesRemaining()).toEqual(2);
  });

  test("Read past", () => {
    const errFn = () => {
      const reader = new ByteStringReader("0x1234");
      const _val = reader.readBytes(3);
    }
    expect(errFn).toThrowError("Read past end of byteString: 0 + 6 > 4");
  });

  test("Skip bytes", () => {
    const reader = new ByteStringReader("0x1234567890");
    reader.readBytes(1);
    reader.skipBytes(1);
    const val = reader.readBytes(2);
    expect(val).toEqual("0x5678");
    expect(reader.getNumBytesRemaining()).toEqual(1);
  });

  test("Get byte slice", () => {
    const reader = new ByteStringReader("0x1234567890");
    const slice = reader.getByteSlice(2, 3);
    expect(slice).toEqual("0x345678");
  });
});
