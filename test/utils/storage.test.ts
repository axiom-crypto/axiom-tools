import {
  getSlotForArray,
  getSlotForMapping,
  packSlot,
  unpackSlot
} from "../../src";

describe("Storage utils", () => {
  test("Get a slot for a mapping", () => {
    let slot = getSlotForMapping("0", "address", "0xf04a5cc80b1e94c69b48f5ee68a08cd2f09a7c3e");
    expect(slot).toEqual("0xd0c386c7992a61692dd631be5c2845db0880e9f9c30b875db5bf9ef5fb6ee6ac");
    slot = getSlotForMapping("1", "address", "0xf04a5cc80b1e94c69b48f5ee68a08cd2f09a7c3e");
    expect(slot).toEqual("0xcac6d248fc0d6bf8c6a52162bb6cf2c0b626f0982031c72927e232a49e300468");
    slot = getSlotForMapping("3", "address", "0xf04a5cc80b1e94c69b48f5ee68a08cd2f09a7c3e");
    expect(slot).toEqual("0x1f8193c3f94e8840dc3a6dfc0bc012432d338ef33c4f3e4b3aca0d6d3c5a09b6");
    slot = getSlotForMapping("5", "address", "0x0000000000085d4780b73119b644ae5ecd22b376");
    expect(slot).toEqual("0xf7f4542d22cad9850f689b595147030708dddeaebc315a4597b1fc4696e63568");
  });

  test("Get a slot for array items", () => {
    let slot = getSlotForArray("5", "uint128", "0");
    expect(slot).toEqual("0x36b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0");
    slot = getSlotForArray("5", "uint128", "1");
    expect(slot).toEqual("0x36b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0");
    slot = getSlotForArray("5", "uint128", "2");
    expect(slot).toEqual("0x36b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db1");
    slot = getSlotForArray("5", "uint128", "3");
    expect(slot).toEqual("0x36b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db1");
    slot = getSlotForArray("5", "uint128", "4");
    expect(slot).toEqual("0x36b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db2");
  });

  test("Pack a storage slot", () => {
    const value = packSlot(
      ["uint32", "uint8", "address", "bool", "uint16"],
      ["1155599", "129", "0xab5801a7d398351b8be11c439e05c5b3259aec9b", "true", "65535"]
    );
    expect(value).toEqual("0x000000000011a20f81ab5801a7d398351b8be11c439e05c5b3259aec9b01ffff");
  });

  test("Unpack a storage slot", () => {
    const packed = "0x000000000011a20f81ab5801a7d398351b8be11c439e05c5b3259aec9b01ffff";
    const [blockNumber, fieldIdx, addr, isSet, value] = unpackSlot(["uint32", "uint8", "address", "bool", "uint16"], packed);
    expect(parseInt(blockNumber, 16).toString()).toEqual("1155599");
    expect(parseInt(fieldIdx, 16).toString()).toEqual("129");
    expect(addr).toEqual("0xab5801a7d398351b8be11c439e05c5b3259aec9b");
    expect(Boolean(parseInt(isSet))).toEqual(true);
    expect(parseInt(value, 16).toString()).toEqual("65535");
  });
});
