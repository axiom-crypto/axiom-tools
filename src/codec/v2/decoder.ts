import { AxiomV2CircuitConstant } from "../../constants";
import { ByteStringReader } from "../../utils/byteStringReader";
import { ConstantsV2 } from "./constants";
import {
  AccountSubquery,
  AxiomV2Query,
  AxiomV2Callback,
  AxiomV2ComputeQuery,
  AxiomV2DataQuery,
  AxiomV2Result,
  BeaconValidatorSubquery,
  DataSubquery,
  DataSubqueryType,
  HeaderSubquery,
  ReceiptSubquery,
  SolidityNestedMappingSubquery,
  StorageSubquery,
  TxSubquery,
  AxiomV2FeeData,
  AxiomV2FullQuery,
} from "./types";

/**
 * Decodes a query string into an AxiomV2Query object
 * @param query The query as a bytes hex string without the first byte (version number)
 * @returns The decoded query as a QueryV2 object
 */
export function decodeQueryV2(query: string): AxiomV2Query | null {
  const reader = new ByteStringReader(query);

  const sourceChainId = reader.readBytes(8);
  const caller = reader.readBytes(20);
  const dataQueryHash = reader.readBytes(32);

  const computeQuery = decodeComputeQuery(reader);
  if (!computeQuery) {
    console.warn(`Unable to decode compute query at index ${reader.currentIdx}`);
    return null;
  }

  const callback = decodeCallback(reader);
  if (!callback) {
    console.warn(`Unable to decode callback at index ${reader.currentIdx}`);
    return null;
  }

  const feeData = decodeFeeData(reader);
  if (!feeData) {
    console.warn(`Unable to decode fee data at index ${reader.currentIdx}`);
    return null;
  }

  const userSalt = reader.readBytes(32);
  const refundee = reader.readBytes(20);

  if (!reader.validateAllBytesRead()) {
    console.warn(`All nibbles not read: ${reader.currentIdx} / ${reader.byteString.length}`);
    return null;
  }

  return {
    version: ConstantsV2.VERSION,
    sourceChainId,
    caller,
    dataQueryHash,
    computeQuery,
    callback,
    userSalt,
    feeData,
    refundee,
  }
}

export function decodeFullQueryV2(query: string): AxiomV2FullQuery | null {
  const reader = new ByteStringReader(query);

  // Need to include version here because it is not called by the decodeQuery function
  const version = reader.readInt(1);
  if (version !== ConstantsV2.VERSION) {
    throw new Error(`Invalid version number: ${version}`);
  }

  const sourceChainId = reader.readBytes(8);
  const caller = reader.readBytes(20);

  const dataQuery = decodeDataQuery(reader);
  if (!dataQuery) {
    console.warn(`Unable to decode data query at index ${reader.currentIdx}`);
    return null;
  }

  const computeQuery = decodeComputeQuery(reader);
  if (!computeQuery) {
    console.warn(`Unable to decode compute query at index ${reader.currentIdx}`);
    return null;
  }

  const callback = decodeCallback(reader);
  if (!callback) {
    console.warn(`Unable to decode callback at index ${reader.currentIdx}`);
    return null;
  }

  const feeData = decodeFeeData(reader);
  if (!feeData) {
    console.warn(`Unable to decode fee data at index ${reader.currentIdx}`);
    return null;
  }

  const userSalt = reader.readBytes(32);
  const refundee = reader.readBytes(20);

  if (!reader.validateAllBytesRead()) {
    console.warn(`All nibbles not read: ${reader.currentIdx} / ${reader.byteString.length}`);
    return null;
  }

  return {
    version,
    sourceChainId,
    caller,
    dataQuery,
    computeQuery,
    callback,
    userSalt,
    feeData,
    refundee,
  }
}

export function decodeDataQuery(reader: ByteStringReader): AxiomV2DataQuery | null {
  const sourceChainId = reader.readBytes(8);
  const subqueryLen = reader.readInt(2);
  const subqueries: DataSubquery[] = [];
  for (let i = 0; i < subqueryLen; i++) {
    const type = reader.readInt(2);
    switch (type) {
      case DataSubqueryType.Header:
        const headerSubquery = decodeHeaderSubquery(reader);
        if (!headerSubquery) {
          console.warn(`Unable to decode header subquery at index ${reader.currentIdx}`);
          return null;
        }
        subqueries.push({
          type: DataSubqueryType.Header,
          subqueryData: headerSubquery,
        });
        break;
      case DataSubqueryType.Account:
        const accountSubquery = decodeAccountSubquery(reader);
        if (!accountSubquery) {
          console.warn(`Unable to decode account subquery at index ${reader.currentIdx}`);
          return null;
        }
        subqueries.push({
          type: DataSubqueryType.Account,
          subqueryData: accountSubquery,
        });
        break;
      case DataSubqueryType.Storage:
        const storageSubquery = decodeStorageSubquery(reader);
        if (!storageSubquery) {
          console.warn(`Unable to decode storage subquery at index ${reader.currentIdx}`);
          return null;
        }
        subqueries.push({
          type: DataSubqueryType.Storage,
          subqueryData: storageSubquery,
        });
        break;
      case DataSubqueryType.Transaction:
        const txSubquery = decodeTxSubquery(reader);
        if (!txSubquery) {
          console.warn(`Unable to decode tx subquery at index ${reader.currentIdx}`);
          return null;
        }
        subqueries.push({
          type: DataSubqueryType.Transaction,
          subqueryData: txSubquery,
        });
        break;
      case DataSubqueryType.Receipt:
        const receiptSubquery = decodeReceiptSubquery(reader);
        if (!receiptSubquery) {
          console.warn(`Unable to decode receipt subquery at index ${reader.currentIdx}`);
          return null;
        }
        subqueries.push({
          type: DataSubqueryType.Receipt,
          subqueryData: receiptSubquery,
        });
        break;
      case DataSubqueryType.SolidityNestedMapping:
        const solidityNestedMappingSubquery = decodeSolidityNestedMappingSubquery(reader);
        if (!solidityNestedMappingSubquery) {
          console.warn(`Unable to decode solidity nested mapping subquery at index ${reader.currentIdx}`);
          return null;
        }
        subqueries.push({
          type: DataSubqueryType.SolidityNestedMapping,
          subqueryData: solidityNestedMappingSubquery,
        });
        break;
      case DataSubqueryType.BeaconValidator:
        const beaconValidatorSubquery = decodeBeaconValidatorsSubquery(reader);
        if (!beaconValidatorSubquery) {
          console.warn(`Unable to decode beacon validator subquery at index ${reader.currentIdx}`);
          return null;
        }
        subqueries.push({
          type: DataSubqueryType.BeaconValidator,
          subqueryData: beaconValidatorSubquery,
        });
        break;
      default:
        throw new Error(`Unknown subquery type ${type} at index ${reader.currentIdx}`);
    }
  }
  // We do not check all bytes are read here because we are passing in a querySlice that is
  // longer than the actual dataQuery.

  return {
    sourceChainId,
    subqueries,
  }
}

export function decodeComputeQuery(reader: ByteStringReader): AxiomV2ComputeQuery | null {
  const k = reader.readInt(1);
  const resultLen = reader.readInt(2);
  if (k === 0) {
    return {
      k,
      resultLen,
      vkey: [],
      computeProof: "",
    }
  }
  const vkeyLen = reader.readInt(1);
  const vkey = reader.readFixedLenBytes32(vkeyLen);
  const computeProof = reader.readVarLenBytes(AxiomV2CircuitConstant.UserProofLenBytes);

  return {
    k,
    resultLen,
    vkey,
    computeProof,
  }
}

export function decodeCallback(reader: ByteStringReader): AxiomV2Callback | null {
  const target = reader.readBytes(20);
  const extraData = reader.readVarLenBytes(2);

  return {
    target,
    extraData,
  }
}

export function decodeFeeData(reader: ByteStringReader): AxiomV2FeeData | null {
  const maxFeePerGas = reader.readBytes(8);
  const callbackGasLimit = reader.readInt(4);
  const overrideAxiomQueryFee = reader.readBytes(32);

  return {
    maxFeePerGas,
    callbackGasLimit,
    overrideAxiomQueryFee,
  }
}

export function decodeResult(query: string): AxiomV2Result | null {
  const reader = new ByteStringReader(query);

  const sourceChainId = reader.readBytes(8);
  const dataResultsRoot = reader.readBytes(32);
  const dataResultsPoseidonRoot = reader.readBytes(32);
  const computeResultsHash = reader.readBytes(32);

  if (!reader.validateAllBytesRead()) {
    return null;
  }

  return {
    sourceChainId,
    dataResultsRoot,
    dataResultsPoseidonRoot,
    computeResultsHash,
  }
}

export function decodeHeaderSubquery(reader: ByteStringReader): HeaderSubquery | null {
  const blockNumber = reader.readInt(4);
  const fieldIdx = reader.readInt(4);

  return {
    blockNumber,
    fieldIdx,
  }
}

export function decodeAccountSubquery(reader: ByteStringReader): AccountSubquery | null {
  const blockNumber = reader.readInt(4);
  const addr = reader.readBytes(20);
  const fieldIdx = reader.readInt(4);

  return {
    blockNumber,
    addr,
    fieldIdx,
  }
}

export function decodeStorageSubquery(reader: ByteStringReader): StorageSubquery | null {
  const blockNumber = reader.readInt(4);
  const addr = reader.readBytes(20);
  const slot = reader.readBytes(32);

  return {
    blockNumber,
    addr,
    slot,
  }
}

export function decodeTxSubquery(reader: ByteStringReader): TxSubquery | null {
  const blockNumber = reader.readInt(4);
  const txIdx = reader.readInt(2);
  const fieldOrCalldataIdx = reader.readInt(4);

  return {
    blockNumber,
    txIdx,
    fieldOrCalldataIdx,
  }
}

export function decodeReceiptSubquery(reader: ByteStringReader): ReceiptSubquery | null {
  const blockNumber = reader.readInt(4);
  const txIdx = reader.readInt(2);
  const fieldOrLogIdx = reader.readInt(4);
  const topicOrDataOrAddressIdx = reader.readInt(4);
  const eventSchema = reader.readBytes(32);

  return {
    blockNumber,
    txIdx,
    fieldOrLogIdx,
    topicOrDataOrAddressIdx,
    eventSchema,
  }
}

export function decodeSolidityNestedMappingSubquery(reader: ByteStringReader): SolidityNestedMappingSubquery | null {
  const blockNumber = reader.readInt(4);
  const addr = reader.readBytes(20);
  const mappingSlot = reader.readBytes(32);
  const mappingDepth = reader.readInt(1);
  let keys: string[] = [];
  for (let i = 0; i < mappingDepth; i++) {
    keys.push(reader.readBytes(32));
  }

  return {
    blockNumber,
    addr,
    mappingSlot,
    mappingDepth,
    keys,
  }
}

export function decodeBeaconValidatorsSubquery(reader: ByteStringReader): BeaconValidatorSubquery {
  // WIP
  return {}
}
