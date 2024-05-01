import { ethers } from "ethers";
import {
  AccountSubquery,
  AxiomV2Callback,
  AxiomV2ComputeQuery,
  AxiomV2DataQuery,
  AxiomV2FeeData,
  AxiomV2Result,
  BeaconValidatorSubquery,
  DataSubquery,
  DataSubqueryType,
  ECDSASubquery,
  Groth16Subquery,
  HeaderSubquery,
  ReceiptSubquery,
  SolidityNestedMappingSubquery,
  StorageSubquery,
  TxSubquery,
} from "./types";
import { ConstantsV2 } from "./constants";
import {
  bytes32,
  getNumBytes,
  resizeArray,
  validateAddress,
  validateBytes32,
  validateBytes4,
} from "../../utils/bytes";
import { validateSize } from "../../utils/byteLength";
import { AxiomV2CircuitConstant } from "../../constants";

/**
 * Encodes a v2 Query as a hex string
 * @param sourceChainId
 * @param caller
 * @param dataQueryHash
 * @param computeQuery
 * @param callback
 * @param feeData
 * @param userSalt
 * @param refundee
 * @returns data encoded as hex string of bytes
 */
export function encodeQueryV2(
  sourceChainId: number | string | BigInt,
  caller: string,
  dataQueryHash: string,
  computeQuery: AxiomV2ComputeQuery,
  callback: AxiomV2Callback,
  feeData: AxiomV2FeeData,
  userSalt: string,
  refundee: string,
): string {
  validateSize(sourceChainId, "uint64");
  validateAddress(caller);
  validateBytes32(dataQueryHash);
  validateBytes32(userSalt);
  validateAddress(refundee);

  const encodedPart0 = ethers.solidityPacked(
    ["uint8", "uint64", "address", "bytes32"],
    [ConstantsV2.VERSION, sourceChainId, caller, dataQueryHash],
  );

  const encodedComputeQuery = encodeComputeQuery(
    computeQuery.k,
    computeQuery.resultLen ?? AxiomV2CircuitConstant.UserMaxOutputs,
    computeQuery.vkey,
    computeQuery.computeProof,
  );

  const encodedCallback = encodeCallback(callback.target, callback.extraData);

  const encodedFeeData = encodeFeeData(
    feeData.maxFeePerGas,
    feeData.callbackGasLimit,
    feeData.overrideAxiomQueryFee,
  );

  return ethers.concat([
    encodedPart0,
    encodedComputeQuery,
    encodedCallback,
    encodedFeeData,
    userSalt,
    refundee,
  ]);
}

/**
 * Encodes the full AxiomV2Query that can be fully decoded later
 *
 */
export function encodeFullQueryV2(
  sourceChainId: number | string | BigInt,
  caller: string,
  dataQuery: AxiomV2DataQuery,
  computeQuery: AxiomV2ComputeQuery,
  callback: AxiomV2Callback,
  feeData: AxiomV2FeeData,
  userSalt: string,
  refundee: string,
): string {
  validateSize(sourceChainId, "uint64");
  validateAddress(caller);
  validateBytes32(userSalt);
  validateAddress(refundee);

  const encodedPart0 = ethers.solidityPacked(
    ["uint8", "uint64", "address"],
    [ConstantsV2.VERSION, sourceChainId, caller],
  );

  const encodedDataQuery = encodeDataQuery(dataQuery.sourceChainId, dataQuery.subqueries);

  const encodedComputeQuery = encodeComputeQuery(
    computeQuery.k,
    computeQuery.resultLen ?? AxiomV2CircuitConstant.UserMaxOutputs,
    computeQuery.vkey,
    computeQuery.computeProof,
  );

  const encodedCallback = encodeCallback(callback.target, callback.extraData);

  const encodedFeeData = encodeFeeData(
    feeData.maxFeePerGas,
    feeData.callbackGasLimit,
    feeData.overrideAxiomQueryFee,
  );

  return ethers.concat([
    encodedPart0,
    encodedDataQuery,
    encodedComputeQuery,
    encodedCallback,
    encodedFeeData,
    userSalt,
    refundee,
  ]);
}

/**
 * Computes the query hash for a v2 query:
 *   queryHash = keccak(version . sourceChainId . dataQueryHash . computeQuery)
 * @param sourceChainId
 * @param dataQueryHash
 * @param computeQuery
 * @returns query hash as hex string of bytes
 */
export function getQueryHashV2(
  sourceChainId: number | string | BigInt,
  dataQueryHash: string,
  computeQuery: AxiomV2ComputeQuery,
): string {
  validateSize(sourceChainId, "uint64");
  validateBytes32(dataQueryHash);

  const encoded = ethers.solidityPacked(
    ["uint8", "uint64", "bytes32"],
    [ConstantsV2.VERSION, sourceChainId, dataQueryHash],
  );
  const encodedComputeQuery = encodeComputeQuery(
    computeQuery.k,
    computeQuery.resultLen ?? 0,
    computeQuery.vkey,
    computeQuery.computeProof,
  );
  const concatenated = ethers.concat([encoded, encodedComputeQuery]);
  return ethers.keccak256(concatenated);
}

/**
 * Calculates the queryId:
 *   queryId = keccak(targetChainId . caller . userSalt . queryHash . callbackHash . refundee)
 */
export function getQueryId(
  targetChainId: string,
  caller: string,
  userSalt: string,
  queryHash: string,
  callbackHash: string,
  refundee: string,
): string {
  validateSize(targetChainId, "uint64");
  validateAddress(caller);
  validateBytes32(userSalt);
  validateBytes32(queryHash);
  validateBytes32(callbackHash);
  validateAddress(refundee);

  const encoded = ethers.solidityPacked(
    ["uint64", "address", "bytes32", "bytes32", "bytes32", "address"],
    [targetChainId, caller, userSalt, queryHash, callbackHash, refundee],
  );
  return ethers.keccak256(encoded);
}

export function encodeResult(
  sourceChainId: number | string | BigInt,
  dataResultsRoot: string,
  dataResultsPoseidonRoot: string,
  computeResultsHash: string,
): string {
  validateSize(sourceChainId, "uint64");
  validateBytes32(dataResultsRoot);
  validateBytes32(dataResultsPoseidonRoot);
  validateBytes32(computeResultsHash);

  const encoded = ethers.solidityPacked(
    ["uint64", "bytes32", "bytes32", "bytes32"],
    [sourceChainId, dataResultsRoot, dataResultsPoseidonRoot, computeResultsHash],
  );
  return encoded;
}

export function getResultHash(result: AxiomV2Result): string {
  const encoded = encodeResult(
    result.sourceChainId,
    result.dataResultsRoot,
    result.dataResultsPoseidonRoot,
    result.computeResultsHash,
  );
  return ethers.keccak256(encoded);
}

export function getQuerySchemaHash(
  k: number | string | BigInt,
  resultLen: number | string | BigInt,
  vkey: string[],
): string {
  if (k === 0) {
    return bytes32(0);
  }

  const encodedQuerySchema = encodeQuerySchema(k, resultLen, vkey);
  return ethers.keccak256(encodedQuerySchema);
}

export function getDataQueryHash(
  sourceChainId: number | string | BigInt,
  subqueryHashes: string[],
): string {
  validateSize(sourceChainId, "uint64");

  const encodedSourceChainId = ethers.solidityPacked(["uint64"], [sourceChainId]);
  const encodedSubqueryHashes = ethers.concat(subqueryHashes);
  return ethers.keccak256(ethers.concat([encodedSourceChainId, encodedSubqueryHashes]));
}

export function getDataQueryHashFromSubqueries(
  sourceChainId: number | string | BigInt,
  dataSubqueries: DataSubquery[],
): string {
  return getDataQueryHash(
    sourceChainId,
    dataSubqueries.map((subquery) => getSubqueryHash(subquery.type, encodeDataSubquery(subquery))),
  );
}

export function getSubqueryHash(type: DataSubqueryType, subqueryData: string): string {
  const encoded = encodeSubquery(type, subqueryData);
  return ethers.keccak256(encoded);
}

/**
 * Encodes a full DataQuery
 * @param sourceChainId (uint64) chainId of the source chain
 * @param dataSubqueries (DataSubquery[]) an array of DataSubqueries to be encoded
 * @returns hex string of encoded query data
 */
export function encodeDataQuery(
  sourceChainId: number | string | BigInt,
  dataSubqueries: DataSubquery[],
): string {
  validateSize(sourceChainId, "uint64");

  let encodedSubqueries = "0x";
  for (const subquery of dataSubqueries) {
    let encodedSubquery = encodeDataSubquery(subquery);
    encodedSubqueries = ethers.concat([
      encodedSubqueries,
      encodeSubquery(subquery.type, encodedSubquery),
    ]);
  }
  const encodedSourceChainId = ethers.solidityPacked(
    ["uint64", "uint16"],
    [sourceChainId, dataSubqueries.length],
  );
  return ethers.concat([encodedSourceChainId, encodedSubqueries]);
}

export function encodeDataSubquery(subquery: DataSubquery): string {
  let encodedSubquery;
  switch (subquery.type) {
    case DataSubqueryType.Header:
      const headerSubquery = subquery.subqueryData as HeaderSubquery;
      encodedSubquery = encodeHeaderSubquery(headerSubquery.blockNumber, headerSubquery.fieldIdx);
      break;
    case DataSubqueryType.Account:
      const accountSubquery = subquery.subqueryData as AccountSubquery;
      encodedSubquery = encodeAccountSubquery(
        accountSubquery.blockNumber,
        accountSubquery.addr,
        accountSubquery.fieldIdx,
      );
      break;
    case DataSubqueryType.Storage:
      const storageSubquery = subquery.subqueryData as StorageSubquery;
      encodedSubquery = encodeStorageSubquery(
        storageSubquery.blockNumber,
        storageSubquery.addr,
        storageSubquery.slot,
      );
      break;
    case DataSubqueryType.Transaction:
      const txSubquery = subquery.subqueryData as TxSubquery;
      encodedSubquery = encodeTxSubquery(
        txSubquery.blockNumber,
        txSubquery.txIdx,
        txSubquery.fieldOrCalldataIdx,
      );
      break;
    case DataSubqueryType.Receipt:
      const receiptSubquery = subquery.subqueryData as ReceiptSubquery;
      encodedSubquery = encodeReceiptSubquery(
        receiptSubquery.blockNumber,
        receiptSubquery.txIdx,
        receiptSubquery.fieldOrLogIdx,
        receiptSubquery.topicOrDataOrAddressIdx,
        receiptSubquery.eventSchema,
      );
      break;
    case DataSubqueryType.SolidityNestedMapping:
      const solidityNestedMappingSubquery = subquery.subqueryData as SolidityNestedMappingSubquery;
      encodedSubquery = encodeSolidityNestedMappingSubquery(
        solidityNestedMappingSubquery.blockNumber,
        solidityNestedMappingSubquery.addr,
        solidityNestedMappingSubquery.mappingSlot,
        solidityNestedMappingSubquery.mappingDepth,
        solidityNestedMappingSubquery.keys,
      );
      break;
    case DataSubqueryType.ECDSA:
      const { pubkey, r, s, msgHash } = subquery.subqueryData as ECDSASubquery;
      encodedSubquery = encodeECDSASubquery(pubkey, r, s, msgHash);
      break;
    case DataSubqueryType.Groth16:
      const groth16Subquery = subquery.subqueryData as Groth16Subquery;
      encodedSubquery = encodeGroth16Subquery(groth16Subquery.bytes);
      break;
    default:
      throw new Error("Invalid subquery type");
  }
  return encodedSubquery;
}

export function encodeQuerySchema(
  k: number | string | BigInt,
  resultLen: number | string | BigInt,
  vkey: string[],
): string {
  validateSize(k, "uint8");
  validateSize(resultLen, "uint16");

  // If k is 0, then the querySchema is empty
  if (k === 0) {
    return ethers.solidityPacked(["uint8", "uint16"], [0, resultLen]);
  }

  const encodedComputeQueryParams = ethers.solidityPacked(
    ["uint8", "uint16", "uint8"],
    [k, resultLen, vkey.length],
  );

  // Ensure all elements of vkey array are 32 bytes long
  vkey.forEach((element) => {
    if (getNumBytes(element) !== 32) {
      throw new Error("Invalid vkey");
    }
  });

  const encodedVKey = encodeBytes32Array(vkey, vkey.length);

  return ethers.concat([encodedComputeQueryParams, encodedVKey]);
}

export function encodeComputeQuery(
  k: number | string | BigInt,
  resultLen: number | string | BigInt,
  vkey: string[],
  computeProof: string,
): string {
  validateSize(k, "uint8");
  validateSize(resultLen, "uint16");

  // If k is 0, then the compute query is empty
  if (k === 0) {
    return ethers.solidityPacked(["uint8", "uint16"], [0, resultLen]);
  }

  const encodedQuerySchema = encodeQuerySchema(k, resultLen, vkey);
  const encodedComputeProof = encodeVarLenBytes(computeProof, "uint32");

  return ethers.concat([encodedQuerySchema, encodedComputeProof]);
}

export function encodeCallback(target: string, extraData: string): string {
  validateAddress(target);

  const encodedTarget = ethers.solidityPacked(["address"], [target]);
  const encodedExtraData = encodeVarLenBytes(extraData, "uint16");
  return ethers.concat([encodedTarget, encodedExtraData]);
}

export function getCallbackHash(target: string, extraData: string): string {
  const encodedCallback = ethers.solidityPacked(["address", "bytes"], [target, extraData]);
  return ethers.keccak256(encodedCallback);
}

export function encodeFeeData(
  maxFeePerGas: number | string | BigInt,
  callbackGasLimit: number | string | BigInt,
  overrideAxiomQueryFee: number | string | BigInt,
): string {
  validateSize(maxFeePerGas, "uint64");
  validateSize(callbackGasLimit, "uint32");
  validateSize(overrideAxiomQueryFee, "uint256");

  return ethers.solidityPacked(
    ["uint64", "uint32", "uint256"],
    [maxFeePerGas, callbackGasLimit, overrideAxiomQueryFee],
  );
}

function encodeVarLenBytes(data: string, numType: string): string {
  const numBytes = getNumBytes(data);
  return ethers.solidityPacked([numType, "bytes"], [numBytes, data]);
}

/**
 * Encodes an array into a concatenated array of `length` bytes32 items
 * @param data Array of data
 * @param length Desired length of 32-byte array items
 * @returns Hex string of encoded data
 */
function encodeBytes32Array(data: string[], length: number): string {
  if (data.length > length) {
    throw new Error(`Invalid data length: ${data.length} (must be <= ${length})`);
  }
  const paddedData = data.map((d) => ethers.toBeHex(d, 32));
  const gap = length - data.length;
  for (let i = 0; i < gap; i++) {
    paddedData.push(ethers.ZeroHash);
  }
  return ethers.concat(paddedData);
}

export function encodeSubquery(type: DataSubqueryType, encodedData: string): string {
  const encodedType = ethers.solidityPacked(["uint16"], [type]);
  return ethers.concat([encodedType, encodedData]);
}

export function encodeHeaderSubquery(
  blockNumber: number | string | BigInt,
  fieldIdx: number | string | BigInt,
): string {
  validateSize(blockNumber, "uint32");
  validateSize(fieldIdx, "uint32");

  return ethers.solidityPacked(["uint32", "uint32"], [blockNumber, fieldIdx]);
}

export function encodeAccountSubquery(
  blockNumber: number | string | BigInt,
  addr: string,
  fieldIdx: number | string | BigInt,
): string {
  validateSize(blockNumber, "uint32");
  validateAddress(addr);
  validateSize(fieldIdx, "uint32");

  return ethers.solidityPacked(["uint32", "address", "uint32"], [blockNumber, addr, fieldIdx]);
}

export function encodeStorageSubquery(
  blockNumber: number | string | BigInt,
  addr: string,
  slot: number | string | BigInt,
): string {
  validateSize(blockNumber, "uint32");
  validateAddress(addr);
  validateSize(slot, "uint256");

  return ethers.solidityPacked(["uint32", "address", "uint256"], [blockNumber, addr, slot]);
}

export function encodeTxSubquery(
  blockNumber: number | string | BigInt,
  txIdx: number | string | BigInt,
  fieldOrCalldataIdx: number | string | BigInt,
): string {
  validateSize(blockNumber, "uint32");
  validateSize(txIdx, "uint16");
  validateSize(fieldOrCalldataIdx, "uint32");

  return ethers.solidityPacked(
    ["uint32", "uint16", "uint32"],
    [blockNumber, txIdx, fieldOrCalldataIdx],
  );
}

export function encodeReceiptSubquery(
  blockNumber: number | string | BigInt,
  txIdx: number | string | BigInt,
  fieldOrLogIdx: number | string | BigInt,
  topicOrDataOrAddressIdx: number | string | BigInt,
  eventSchema: string,
): string {
  validateSize(blockNumber, "uint32");
  validateSize(txIdx, "uint16");
  validateSize(fieldOrLogIdx, "uint32");
  validateSize(topicOrDataOrAddressIdx, "uint32");
  validateBytes32(eventSchema);

  return ethers.solidityPacked(
    ["uint32", "uint16", "uint32", "uint32", "bytes32"],
    [blockNumber, txIdx, fieldOrLogIdx, topicOrDataOrAddressIdx, eventSchema],
  );
}

export function encodeSolidityNestedMappingSubquery(
  blockNumber: number | string | BigInt,
  addr: string,
  mappingSlot: number | string | BigInt,
  mappingDepth: number | string | BigInt,
  keys: string[],
): string {
  validateSize(blockNumber, "uint32");
  validateAddress(addr);
  validateSize(mappingSlot, "uint256");
  validateSize(mappingDepth, "uint8");
  keys.forEach((key) => validateBytes32(key));

  const keysConcat = ethers.concat(resizeArray(keys, Number(mappingDepth), ethers.ZeroHash));
  return ethers.solidityPacked(
    ["uint32", "address", "uint256", "uint8", "bytes"],
    [blockNumber, addr, mappingSlot, mappingDepth, keysConcat],
  );
}

export function encodeECDSASubquery(
  pubkey: [string, string],
  r: string,
  s: string,
  msgHash: string,
): string {
  validateBytes32(pubkey[0]);
  validateBytes32(pubkey[1]);
  validateBytes32(r);
  validateBytes32(s);
  validateBytes32(msgHash);

  return ethers.solidityPacked(
    ["bytes32", "bytes32", "bytes32", "bytes32", "bytes32"],
    [pubkey[0], pubkey[1], r, s, msgHash],
  );
}

export function encodeGroth16Subquery(bytes: string[]): string {
  const types = new Array(AxiomV2CircuitConstant.MaxSubqueryInputs).fill("bytes32");
  bytes.forEach(validateBytes32);
  return ethers.solidityPacked(types, bytes);
}
