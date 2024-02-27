import { AbiCoder, ethers } from "ethers";
import { getByteLength } from "./byteLength";
import { ByteStringReader } from "./byteStringReader";

export function getSlotForMapping(
  mappingSlot: number | string | BigInt,
  keyType: string,
  key: number | string | BigInt
): string {
  const packed = AbiCoder.defaultAbiCoder().encode(
    [keyType, "uint256"],
    [key, mappingSlot]
  );
  return ethers.keccak256(packed);
}

export function getSlotForArray(
  arraySlot: number | string | BigInt,
  arrayType: string,
  arrayIdx: number | string | BigInt
): string {
  const packed = AbiCoder.defaultAbiCoder().encode(["uint256"], [arraySlot]);
  const baseSlot = ethers.keccak256(packed);
  const typeSize = getByteLength(arrayType);
  let slot =
    BigInt(baseSlot) +
    BigInt(arrayIdx.valueOf()) / BigInt(Math.floor(32 / typeSize));
  return "0x" + slot.toString(16);
}

export function checkFitsInSlot(types: string[]): boolean {
  const lengths = types
    .map((type) => getByteLength(type))
    .reduce((a, b) => a + b, 0);
  if (lengths > 32) {
    return false;
  }
  return true;
}

/**
 * Packs a 32-byte EVM storage slot from left to right with the given types and data
 * @param types Array of fixed-length Solidity types
 * @param data Array of data
 * @returns 32-byte hex string of packed data
 */
export function packSlot(types: string[], data: string[]): string {
  if (!checkFitsInSlot(types)) {
    throw new Error("Data does not fit in slot");
  }
  const packed = ethers.solidityPacked(types, data);
  return ethers.zeroPadValue(packed, 32);
}

/**
 * Unpacks a 32-byte EVM storage slot into an array of data, read from left to right
 * @param types Array of fixed-length Solidity types
 * @param slot 32-byte hex string of slot
 * @returns Array of data
 */
export function unpackSlot(types: string[], slot: string): string[] {
  if (!checkFitsInSlot(types)) {
    throw new Error("Data does not fit in slot");
  }
  if (!slot.startsWith("0x")) {
    throw new Error("Invalid slot value (needs to start with 0x)");
  }
  if (slot.length % 2 !== 0) {
    throw new Error("Invalid slot value (length must be even)");
  }
  const dataLength = types
    .map((type) => getByteLength(type))
    .reduce((a, b) => a + b, 0);
  const leftZeroes = (32 - dataLength) * 2;

  const reader = new ByteStringReader(slot);
  reader.setIndex(leftZeroes);

  let values: string[] = [];
  for (let i = 0; i < types.length; i++) {
    const value = reader.readBytes(getByteLength(types[i]));
    values.push(value);
  }
  return values;
}

export function isAssignedSlot(key: string, proof: string[]) {
  const keyHash = ethers.keccak256(key);
  let claimedKeyHash = "0x";
  let keyIdx = 0;
  for (let i = 0; i < proof.length; i += 1) {
    const parsedNode = ethers.decodeRlp(proof[i]!);
    if (parsedNode.length === 17) {
      claimedKeyHash += keyHash[keyIdx + 2];
      keyIdx += 1;
    } else {
      const prefix = parsedNode[0][2];
      if (prefix === "1" || prefix === "3") {
        claimedKeyHash += parsedNode[0].slice(3);
        keyIdx = keyIdx + parsedNode[0].length - 3;
      } else {
        claimedKeyHash += parsedNode[0].slice(4);
        keyIdx = keyIdx + parsedNode[0].length - 4;
      }
    }
  }
  return keyHash === claimedKeyHash;
}
