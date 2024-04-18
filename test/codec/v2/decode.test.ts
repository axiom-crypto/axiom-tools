import { ethers } from "ethers";
import {
  AccountField,
  AccountSubquery,
  AxiomV2DataQuery,
  ByteStringReader,
  DataSubquery,
  DataSubqueryType,
  HeaderField,
  HeaderSubquery,
  ReceiptSubquery,
  SolidityNestedMappingSubquery,
  StorageSubquery,
  TxField,
  TxSubquery,
  decodeAccountSubquery,
  decodeCallback,
  decodeComputeQuery,
  decodeDataQuery,
  decodeHeaderSubquery,
  decodeQuery,
  decodeReceiptSubquery,
  decodeSolidityNestedMappingSubquery,
  decodeStorageSubquery,
  decodeTxSubquery,
  bytes32,
  decodeFullQueryV2,
  decodeECDSASubquery,
} from "../../../src";
import {
  BLOCK_NUMBER,
  MSGHASH,
  PUBKEY,
  R,
  S,
  UNI_V3_FACTORY_ADDR,
  VITALIK_ADDR,
  WETH_ADDR,
  WSOL_ADDR,
  callbackGasLimit,
  caller,
  computeProof,
  dataQuery,
  dataQueryHash,
  encodedAccountSubquery,
  encodedCallback,
  encodedComputeQuery,
  encodedDataQuery,
  encodedEcdsaSubquery,
  encodedFullQuery,
  encodedFullQueryInvalidVersion,
  encodedHeaderSubquery,
  encodedQuery,
  encodedQueryNoCompute,
  encodedReceiptSubquery,
  encodedSolidityNestedMappingSubquery,
  encodedStorageSubquery,
  encodedTxSubquery,
  extraData,
  k,
  maxFeePerGas,
  overrideAxiomQueryFee,
  refundee,
  resultLen,
  sourceChainId,
  target,
  userSalt,
  vkey,
} from "./data/codecData";

describe("Decoder V2", () => {
  test("Decoding a QueryV2 with computeQuery", () => {
    const decodedQuery = decodeQuery(encodedQuery);

    const packedMaxFeePerGas = ethers.solidityPacked(["uint64"], [maxFeePerGas]);
    expect(decodedQuery.version).toEqual(2);
    expect(Number(decodedQuery.sourceChainId)).toEqual(sourceChainId);
    expect(decodedQuery.caller).toEqual(caller.toLowerCase());
    expect(decodedQuery.dataQueryHash).toEqual(dataQueryHash);
    expect(decodedQuery.computeQuery.k).toEqual(k);
    expect(decodedQuery.computeQuery.resultLen).toEqual(resultLen);
    expect(decodedQuery.computeQuery.vkey.length).toEqual(vkey.length);
    expect(decodedQuery.computeQuery.vkey).toEqual(vkey);
    expect(decodedQuery.computeQuery.computeProof).toEqual(computeProof);
    expect(decodedQuery.callback.target).toEqual(target.toLowerCase());
    expect(decodedQuery.callback.extraData).toEqual(extraData.toLowerCase());
    expect(decodedQuery.userSalt).toEqual(userSalt);
    expect(decodedQuery.feeData.maxFeePerGas).toEqual(packedMaxFeePerGas);
    expect(decodedQuery.feeData.callbackGasLimit).toEqual(callbackGasLimit);
    expect(decodedQuery.feeData.overrideAxiomQueryFee).toEqual(bytes32(overrideAxiomQueryFee));
    expect(decodedQuery.refundee).toEqual(refundee.toLowerCase());
  });

  test("Decoding a full QueryV2", () => {
    const decodedQuery = decodeFullQueryV2(encodedFullQuery);
    if (!decodedQuery) {
      throw new Error("Decoding failed");
    }

    const packedMaxFeePerGas = ethers.solidityPacked(["uint64"], [maxFeePerGas]);
    expect(decodedQuery.version).toEqual(2);
    expect(Number(decodedQuery.sourceChainId)).toEqual(sourceChainId);
    expect(decodedQuery.caller).toEqual(caller.toLowerCase());
    expect(decodedQuery.dataQuery).toEqual(dataQuery);
    expect(decodedQuery.computeQuery.k).toEqual(k);
    expect(decodedQuery.computeQuery.resultLen).toEqual(resultLen);
    expect(decodedQuery.computeQuery.vkey.length).toEqual(vkey.length);
    expect(decodedQuery.computeQuery.vkey).toEqual(vkey);
    expect(decodedQuery.computeQuery.computeProof).toEqual(computeProof);
    expect(decodedQuery.callback.target).toEqual(target.toLowerCase());
    expect(decodedQuery.callback.extraData).toEqual(extraData.toLowerCase());
    expect(decodedQuery.userSalt).toEqual(userSalt);
    expect(decodedQuery.feeData.maxFeePerGas).toEqual(packedMaxFeePerGas);
    expect(decodedQuery.feeData.callbackGasLimit).toEqual(callbackGasLimit);
    expect(decodedQuery.feeData.overrideAxiomQueryFee).toEqual(bytes32(overrideAxiomQueryFee));
    expect(decodedQuery.refundee).toEqual(refundee.toLowerCase());
  });

  test("Decoding a full QueryV2 with invalid version number", () => {
    const testFn = () => {
      const decodedQuery = decodeFullQueryV2(encodedFullQueryInvalidVersion);
    };
    expect(testFn).toThrowError("Invalid version number");
  });

  test("Decoding a QueryV2 with no computeQuery", () => {
    const decodedQuery = decodeQuery(encodedQueryNoCompute);

    const packedMaxFeePerGas = ethers.solidityPacked(["uint64"], [maxFeePerGas]);
    expect(decodedQuery.version).toEqual(2);
    expect(Number(decodedQuery.sourceChainId)).toEqual(sourceChainId);
    expect(decodedQuery.caller).toEqual(caller.toLowerCase());
    expect(decodedQuery.dataQueryHash).toEqual(dataQueryHash);
    expect(decodedQuery.computeQuery.k).toEqual(0);
    expect(decodedQuery.computeQuery.resultLen).toEqual(resultLen);
    expect(decodedQuery.computeQuery.vkey.length).toEqual(0);
    expect(decodedQuery.computeQuery.vkey).toEqual([]);
    expect(decodedQuery.computeQuery.computeProof).toEqual("");
    expect(decodedQuery.callback.target).toEqual(target.toLowerCase());
    expect(decodedQuery.callback.extraData).toEqual(extraData.toLowerCase());
    expect(decodedQuery.userSalt).toEqual(userSalt);
    expect(decodedQuery.feeData.maxFeePerGas).toEqual(packedMaxFeePerGas);
    expect(decodedQuery.feeData.callbackGasLimit).toEqual(callbackGasLimit);
    expect(decodedQuery.feeData.overrideAxiomQueryFee).toEqual(bytes32(overrideAxiomQueryFee));
    expect(decodedQuery.refundee).toEqual(refundee.toLowerCase());
  });

  test("Decoding a ComputeQuery", () => {
    const reader = new ByteStringReader(encodedComputeQuery);
    const decoded = decodeComputeQuery(reader);
    if (!decoded) {
      throw new Error("Decoding failed");
    }
    expect(decoded.k).toEqual(k);
    expect(decoded.resultLen).toEqual(resultLen);
    expect(decoded.vkey.length).toEqual(vkey.length);
    expect(decoded.vkey).toEqual(vkey);
    expect(decoded.computeProof).toEqual(computeProof);
  });

  test("Decoding a Callback", () => {
    const reader = new ByteStringReader(encodedCallback);
    const decoded = decodeCallback(reader);
    if (!decoded) {
      throw new Error("Decoding failed");
    }
    expect(decoded.target).toEqual(target.toLowerCase());
    expect(decoded.extraData).toEqual(extraData.toLowerCase());
  });

  test("Decoding a header subquery", () => {
    const reader = new ByteStringReader(encodedHeaderSubquery);
    const decodedQuery = decodeHeaderSubquery(reader);
    if (!decodedQuery) {
      throw new Error("Decoding failed");
    }
    expect(decodedQuery.blockNumber).toEqual(BLOCK_NUMBER);
    expect(decodedQuery.fieldIdx).toEqual(0);
  });

  test("Decoding a account subquery", () => {
    const reader = new ByteStringReader(encodedAccountSubquery);
    const decodedQuery = decodeAccountSubquery(reader);
    if (!decodedQuery) {
      throw new Error("Decoding failed");
    }
    expect(decodedQuery.blockNumber).toEqual(BLOCK_NUMBER);
    expect(decodedQuery.addr).toEqual(VITALIK_ADDR.toLowerCase());
    expect(decodedQuery.fieldIdx).toEqual(0);
  });

  test("Decoding a storage subquery", () => {
    const reader = new ByteStringReader(encodedStorageSubquery);
    const decodedQuery = decodeStorageSubquery(reader);
    if (!decodedQuery) {
      throw new Error("Decoding failed");
    }
    expect(decodedQuery.blockNumber).toEqual(BLOCK_NUMBER);
    expect(decodedQuery.addr).toEqual(VITALIK_ADDR.toLowerCase());
    expect(decodedQuery.slot).toEqual(ethers.ZeroHash);
  });

  test("Decoding a transaction subquery", () => {
    const reader = new ByteStringReader(encodedTxSubquery);
    const decodedQuery = decodeTxSubquery(reader);
    if (!decodedQuery) {
      throw new Error("Decoding failed");
    }
    expect(decodedQuery.blockNumber).toEqual(15060942);
    expect(decodedQuery.txIdx).toEqual(114);
    expect(decodedQuery.fieldOrCalldataIdx).toEqual(0);
  });

  test("Decoding a receipt subquery", () => {
    const reader = new ByteStringReader(encodedReceiptSubquery);
    const decodedQuery = decodeReceiptSubquery(reader);
    if (!decodedQuery) {
      throw new Error("Decoding failed");
    }
    expect(decodedQuery.blockNumber).toEqual(15060942);
    expect(decodedQuery.txIdx).toEqual(114);
    expect(decodedQuery.fieldOrLogIdx).toEqual(0);
    expect(decodedQuery.topicOrDataOrAddressIdx).toEqual(0);
    expect(decodedQuery.eventSchema).toEqual(
      "0x255910aca2752f3c05fcb4a54d3d8d93bb809a9c8cc215d5eed2504d44cbd865",
    );
  });

  test("Decoding a Solidity nested mapping subquery", () => {
    const reader = new ByteStringReader(encodedSolidityNestedMappingSubquery);
    const decodedQuery = decodeSolidityNestedMappingSubquery(reader);
    if (!decodedQuery) {
      throw new Error("Decoding failed");
    }
    const key0 = bytes32(WETH_ADDR);
    const key1 = bytes32(WSOL_ADDR);
    const key2 = bytes32(10000);

    expect(decodedQuery.blockNumber).toEqual(BLOCK_NUMBER);
    expect(decodedQuery.addr).toEqual(UNI_V3_FACTORY_ADDR.toLowerCase());
    expect(decodedQuery.mappingSlot).toEqual(bytes32("5"));
    expect(decodedQuery.mappingDepth).toEqual(3);
    expect(decodedQuery.keys).toEqual([key0, key1, key2]);
  });

  test("Decoding an ECDSA subquery", () => {
    const reader = new ByteStringReader(encodedEcdsaSubquery);
    const decodedQuery = decodeECDSASubquery(reader);
    if (!decodedQuery) {
      throw new Error("Decoding failed");
    }
    expect(decodedQuery.pubkey[0]).toEqual(PUBKEY[0]);
    expect(decodedQuery.pubkey[1]).toEqual(PUBKEY[1]);
    expect(decodedQuery.r).toEqual(R);
    expect(decodedQuery.s).toEqual(S);
    expect(decodedQuery.msgHash).toEqual(MSGHASH);
  });

  test("Decoding a DataQuery", () => {
    const reader = new ByteStringReader(encodedDataQuery);
    const dataQuery = decodeDataQuery(reader);
    if (!dataQuery) {
      throw new Error("Decoding failed");
    }
    const headerSubquery0 = dataQuery.subqueries[0].subqueryData as HeaderSubquery;
    const headerSubquery1 = dataQuery.subqueries[1].subqueryData as HeaderSubquery;
    const accountSubquery = dataQuery.subqueries[2].subqueryData as AccountSubquery;
    const storageSubquery = dataQuery.subqueries[3].subqueryData as StorageSubquery;
    const txSubquery = dataQuery.subqueries[4].subqueryData as TxSubquery;
    const receiptSubquery = dataQuery.subqueries[5].subqueryData as ReceiptSubquery;
    const solidityNestedMappingSubquery = dataQuery.subqueries[6]
      .subqueryData as SolidityNestedMappingSubquery;

    expect(Number(dataQuery.sourceChainId)).toEqual(1);
    expect(dataQuery.subqueries.length).toEqual(7);
    expect(headerSubquery0.blockNumber).toEqual(BLOCK_NUMBER);
    expect(headerSubquery0.fieldIdx).toEqual(0);
    expect(headerSubquery1.blockNumber).toEqual(BLOCK_NUMBER + 1);
    expect(headerSubquery1.fieldIdx).toEqual(1);
    expect(accountSubquery.blockNumber).toEqual(BLOCK_NUMBER);
    expect(accountSubquery.addr).toEqual(VITALIK_ADDR.toLowerCase());
    expect(accountSubquery.fieldIdx).toEqual(0);
    expect(storageSubquery.blockNumber).toEqual(BLOCK_NUMBER);
    expect(storageSubquery.addr).toEqual(VITALIK_ADDR.toLowerCase());
    expect(storageSubquery.slot).toEqual(ethers.ZeroHash);
    expect(txSubquery.blockNumber).toEqual(15060942);
    expect(txSubquery.txIdx).toEqual(114);
    expect(txSubquery.fieldOrCalldataIdx).toEqual(0);
    expect(receiptSubquery.blockNumber).toEqual(15060942);
    expect(receiptSubquery.txIdx).toEqual(114);
    expect(receiptSubquery.fieldOrLogIdx).toEqual(0);
    expect(receiptSubquery.topicOrDataOrAddressIdx).toEqual(0);
    expect(receiptSubquery.eventSchema).toEqual(
      "0x255910aca2752f3c05fcb4a54d3d8d93bb809a9c8cc215d5eed2504d44cbd865",
    );
    expect(solidityNestedMappingSubquery.blockNumber).toEqual(BLOCK_NUMBER);
    expect(solidityNestedMappingSubquery.addr).toEqual(UNI_V3_FACTORY_ADDR.toLowerCase());
    expect(solidityNestedMappingSubquery.mappingSlot).toEqual(bytes32("5"));
    expect(solidityNestedMappingSubquery.mappingDepth).toEqual(3);
    expect(solidityNestedMappingSubquery.keys).toEqual([
      bytes32(WETH_ADDR),
      bytes32(WSOL_ADDR),
      bytes32(10000),
    ]);
  });
});
