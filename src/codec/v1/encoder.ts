import { ZeroAddress, ethers } from "ethers";

export function encodeQueryV1(
  length: number,
  encodedQueries: string[]
): string {
  const encodedQueryData = ethers.solidityPacked(
    ["uint8", "uint32", "bytes[]"],
    [1, length, encodedQueries]
  );
  return encodedQueryData;
}

export function encodeQueryRowV1(
  length: number,
  blockNumber: number,
  address: string,
  slot: ethers.BigNumberish,
  value: ethers.BigNumberish
): string {
  const queryTypes = ["uint8", "uint32", "address", "uint256", "uint256"];
  const queryData = [length, blockNumber, address, slot, value];

  // Only encode the first `length + 1` elements
  const encodedQuery = ethers.solidityPacked(
    queryTypes.slice(0, length + 1),
    queryData.slice(0, length + 1)
  );
  return encodedQuery;
}

export function encodeRowHash(
  blockNumber: number,
  address?: string,
  slot?: ethers.BigNumberish
) {
  let length = 3;
  const addressValue = address ?? ZeroAddress;
  const slotValue = slot ?? ethers.toBeHex(0, 32);
  if (slot === undefined) {
    length = 2;
  }
  if (address === undefined) {
    length = 1;
  }

  const packed = ethers.solidityPacked(
    ["uint8", "uint32", "address", "uint256"],
    [length, blockNumber, addressValue, slotValue]
  );

  return ethers.keccak256(packed);
}