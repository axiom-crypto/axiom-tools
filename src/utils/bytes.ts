import { ethers } from "ethers";

export function getNumBytes(hexStr: string | undefined | null): number {
  if (hexStr === undefined || hexStr === null) {
    return 0;
  }
  if (hexStr.startsWith("0x")) {
    hexStr = hexStr.slice(2);
  }
  // Pad length to closest full byte
  return Math.ceil(hexStr.length / 2);
}

export function bytes32(data: string | number | ethers.BigNumberish): string {
  return ethers.toBeHex(data, 32);
}

export function bytes32OrNull(
  data: string | number | ethers.BigNumberish | undefined | null,
): string | null {
  if (data === undefined || data === null) {
    return null;
  }
  return bytes32(data);
}

export function toLeHex(data: string, numBytes: number): string {
  if (data.startsWith("0x")) {
    data = data.slice(2);
  }
  if (data.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }
  return "0x" + data.padEnd(numBytes * 2, "0");
}

export function resizeArray(arr: string[], size: number, defaultValue: string) {
  if (arr.length < size) {
    return arr.concat(Array(size - arr.length).fill(defaultValue));
  }
  return arr.slice(0, size);
}

export function validateAddress(address: string) {
  if (!ethers.isAddress(address)) {
    throw new Error(`Invalid address: ${address}`);
  }
}

export function validateBytes4(bytes: string) {
  if (!ethers.isBytesLike(bytes) || getNumBytes(bytes) !== 4) {
    throw new Error(`Invalid bytes4: ${bytes}`);
  }
}

export function validateBytes32(bytes32: string) {
  if (!ethers.isBytesLike(bytes32) || getNumBytes(bytes32) !== 32) {
    throw new Error(`Invalid bytes32: ${bytes32}`);
  }
}

export function removeZerosLeft(hex: string): string {
  if (hex.substring(0, 2) === "0x") {
    const hexSubstr = hex.substring(2, hex.length);
    if (hexSubstr === "" || Number(hexSubstr) === 0) {
      return "0x0";
    }
    const stripped = hexSubstr.replace(/^0+/, "");
    return `0x${stripped}`;
  }

  hex = hex.replace(/^0+/, "");
  if (hex === "") {
    return "0x0";
  }
  return `0x${hex}`;
}

export function shortenedHex(num: number): string {
  return removeZerosLeft(ethers.toBeHex(num));
}
