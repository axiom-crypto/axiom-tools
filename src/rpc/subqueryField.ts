import { ethers, ZeroHash } from "ethers";
import {
  bytes32,
  ByteStringReader,
  getNumBytes,
  isAssignedSlot,
  rlpEncodeBlockHeader,
  toLeHex,
} from "../utils";
import {
  AccountField,
  HeaderField,
  ReceiptField,
  TxField,
  HeaderSubquery,
  AccountSubquery,
  StorageSubquery,
  TxSubquery,
  ReceiptSubquery,
  SolidityNestedMappingSubquery,
  TxType,
} from "../codec";
import {
  getAccountData,
  getFullBlock,
  getRawReceipt,
  getRawTransaction,
  getTxHash,
} from "./getters";
import { AxiomV2CircuitConstant, AxiomV2FieldConstant } from "../constants";
import { CommonConstants } from "../constants/common/constants";

export async function getHeaderFieldValue(
  provider: ethers.JsonRpcProvider,
  { blockNumber, fieldIdx }: HeaderSubquery,
  logger: any = console,
): Promise<string | null> {
  const block = await getFullBlock(provider, blockNumber);
  if (!block) {
    logger.info(`Block ${blockNumber} does not exist`);
    return null;
  }

  const getValue = () => {
    if (
      fieldIdx >= AxiomV2FieldConstant.Header.LogsBloomFieldIdxOffset &&
      fieldIdx < AxiomV2FieldConstant.Header.LogsBloomFieldIdxOffset + 8
    ) {
      const logIdx = fieldIdx - AxiomV2FieldConstant.Header.LogsBloomFieldIdxOffset;
      if (!block.logsBloom || logIdx >= block.logsBloom.slice(2).length / 64) {
        return null;
      }
      const reader = new ByteStringReader(block.logsBloom);
      for (let i = 0; i < logIdx; i++) {
        reader.readBytes("bytes32");
      }
      const logsBloomValue = reader.readBytes("bytes32");
      return logsBloomValue;
    }

    switch (fieldIdx) {
      case HeaderField.ParentHash:
        return block.parentHash ?? null;
      case HeaderField.Sha3Uncles:
        return block.sha3Uncles ?? null;
      case HeaderField.Miner:
        return block.miner ?? null;
      case HeaderField.StateRoot:
        return block.stateRoot ?? null;
      case HeaderField.TransactionsRoot:
        return block.transactionsRoot ?? null;
      case HeaderField.ReceiptsRoot:
        return block.receiptsRoot ?? null;
      case HeaderField.LogsBloom:
        return block.logsBloom?.slice(0, 66) ?? null;
      case HeaderField.Difficulty:
        return block.difficulty ?? null;
      case HeaderField.Number:
        return block.number ?? null;
      case HeaderField.GasLimit:
        return block.gasLimit ?? null;
      case HeaderField.GasUsed:
        return block.gasUsed ?? null;
      case HeaderField.Timestamp:
        return block.timestamp ?? null;
      case HeaderField.ExtraData:
        // Get the first 32 bytes of extra data, and right pad with 0s
        return block.extraData?.slice(0, 66).padEnd(66, "0") ?? null;
      case HeaderField.MixHash:
        return block.mixHash ?? null;
      case HeaderField.Nonce:
        return block.nonce ?? null;
      case HeaderField.BaseFeePerGas:
        return block.baseFeePerGas ?? null;
      case HeaderField.WithdrawalsRoot:
        return block.withdrawalsRoot ?? null;
      // case HeaderField.BlobGasUsed:
      //   return block.blobGasUsed ?? null;
      // case HeaderField.ExcessBlobGas:
      //   return block.excessBlobGas ?? null;
      // case HeaderField.ParentBeaconBlockRoot:
      //   return block.parentBeaconBlockRoot ?? null;
      case AxiomV2FieldConstant.Header.HashFieldIdx:
        return block.hash ?? null;
      case AxiomV2FieldConstant.Header.HeaderSizeFieldIdx:
        return getNumBytes(rlpEncodeBlockHeader(block));
      case AxiomV2FieldConstant.Header.ExtraDataLenFieldIdx:
        if (!block.extraData) {
          return 0;
        }
        return getNumBytes(block.extraData);
      default:
        logger.info(`Invalid header field: ${fieldIdx}`);
        return null;
    }
  };

  const value = getValue();
  if (!value) return null;
  return bytes32(value);
}

export async function getAccountFieldValue(
  provider: ethers.JsonRpcProvider,
  { blockNumber, addr, fieldIdx }: AccountSubquery,
  logger: any = console,
): Promise<string | null> {
  const block = await getFullBlock(provider, blockNumber);
  if (!block) {
    logger.info(`Block ${blockNumber} does not exist`);
    return null;
  }

  if (!ethers.isAddress(addr)) {
    logger.info(`Address ${addr} is not a correctly-formed EVM address`);
    return getNonexistentAccountFieldValue(fieldIdx);
  }

  const account = await getAccountData(provider, blockNumber, addr, []);
  if (!account) {
    logger.info(`proof is null for block ${blockNumber}, address ${addr}`);
    return getNonexistentAccountFieldValue(fieldIdx);
  }

  const accountProof = account.accountProof;

  if (!isAssignedSlot(addr, accountProof)) {
    return getNonexistentAccountFieldValue(fieldIdx);
  }

  const stateRoot = ethers.keccak256(accountProof[0]);
  if (stateRoot !== block.stateRoot) {
    logger.info(`State root mismatch: ${block.stateRoot} (block) ${stateRoot} (accountProof)`);
    return null;
  }

  const getValue = () => {
    switch (fieldIdx) {
      case AccountField.Nonce:
        return account.nonce ?? 0;
      case AccountField.Balance:
        return account.balance ?? 0;
      case AccountField.StorageRoot:
        return account.storageHash ?? CommonConstants.StorageHashEmpty;
      case AccountField.CodeHash:
        return account.codeHash ?? CommonConstants.CodeHashEmpty;
      default:
        logger.info(`Invalid account field: ${fieldIdx}`);
        return null;
    }
  };
  const value = getValue();
  if (!value) return null;
  return bytes32(value);
}

export async function getStorageFieldValue(
  provider: ethers.JsonRpcProvider,
  { blockNumber, addr, slot }: StorageSubquery,
  logger: any = console,
): Promise<string | null> {
  const block = await getFullBlock(provider, blockNumber);
  if (!block) {
    logger.info(`Block ${blockNumber} does not exist`);
    return null;
  }

  if (!ethers.isAddress(addr)) {
    logger.info(`Address ${addr} is not a valid address`);
    return null;
  }

  slot = bytes32(slot);
  let slots = [slot];

  const account = await getAccountData(provider, blockNumber, addr, slots);
  if (!account) {
    logger.info(`proof is null for block ${blockNumber}, address ${addr}`);
    return null;
  }

  const accountProof = account.accountProof;

  const stateRoot = ethers.keccak256(accountProof[0]);
  if (stateRoot !== block.stateRoot) {
    logger.info(`State root mismatch: ${block.stateRoot} (block) ${stateRoot} (accountProof)`);
    return null;
  }

  const storageProof = account.storageProof[0];
  const proof = storageProof.proof;
  let value = storageProof.value;
  if (proof.length === 0) {
    logger.info(`Slot ${slot} has empty MPT proof in account ${addr} at block ${blockNumber}`);
    return ZeroHash;
  }

  value = bytes32(value);
  if (!isAssignedSlot(slot, proof) && value !== ZeroHash) {
    logger.warn(`eth_getProof returned non-zero value on an empty slot`);
    return null;
  }

  const storageHash = ethers.keccak256(proof[0]);
  if (account.storageHash !== storageHash) {
    logger.info(
      `Storage hash mismatch: ${account.storageHash} (account) ${storageHash} (storageProof)`,
    );
    return null;
  }

  return value;
}

export async function getTxFieldValue(
  provider: ethers.JsonRpcProvider,
  { blockNumber, txIdx, fieldOrCalldataIdx }: TxSubquery,
  logger: any = console,
  tx?: any, // `tx` input is raw output of JSON-RPC call from `getRawTransaction`
): Promise<string | null> {
  if (!tx || tx?.hash === undefined || tx.hash === "") {
    // To preserve compatibility w/ ethers provder interface and return object flow, we'll
    // use one RPC call to first get the txHash
    const txHash = await getTxHash(provider, blockNumber, txIdx);
    if (!txHash) {
      logger.info(`Failed to find txHash for block ${blockNumber} txIdx ${txIdx}`);
      return null;
    }
    tx = await getRawTransaction(provider, txHash);
    if (!tx) {
      logger.info(`Failed to find tx for txHash ${txHash}`);
      return null;
    }
  }

  const getValue = (tx: any, type: TxType) => {
    if (fieldOrCalldataIdx < AxiomV2FieldConstant.Tx.CalldataIdxOffset) {
      switch (fieldOrCalldataIdx) {
        case TxField.ChainId:
          if (type === TxType.Legacy) {
            return null;
          }
          return tx?.chainId ?? null;
        case TxField.Nonce:
          return tx?.nonce ?? null;
        case TxField.MaxPriorityFeePerGas:
          if (type === TxType.Legacy || type === TxType.Eip2930) {
            return null;
          }
          return tx?.maxPriorityFeePerGas ?? null;
        case TxField.MaxFeePerGas:
          if (type === TxType.Legacy || type === TxType.Eip2930) {
            return null;
          }
          return tx?.maxFeePerGas ?? null;
        case TxField.GasLimit:
          return tx?.gas ?? null;
        case TxField.To:
          return tx?.to ?? null;
        case TxField.Value:
          return tx?.value ?? null;
        case TxField.Data:
          if (tx?.input === "0x") {
            return "0x0";
          }
          return tx?.input?.slice(0, 66) ?? null;
        case TxField.GasPrice:
          if (type === TxType.Eip1559) {
            return null;
          }
          return tx?.gasPrice ?? null;
        case TxField.v:
          return tx?.v ?? null;
        case TxField.r:
          return tx?.r ?? null;
        case TxField.s:
          return tx?.s ?? null;
        case AxiomV2FieldConstant.Tx.TxTypeFieldIdx:
          return tx?.type ?? null;
        case AxiomV2FieldConstant.Tx.BlockNumberFieldIdx:
          return tx?.blockNumber ?? null;
        case AxiomV2FieldConstant.Tx.TxIndexFieldIdx:
          return tx?.transactionIndex ?? null;
        case AxiomV2FieldConstant.Tx.FunctionSelectorFieldIdx:
          if (!tx.to && !!tx.input) {
            return AxiomV2FieldConstant.Tx.ContractDeploySelectorValue;
          }
          if (tx.input === "0x") {
            return AxiomV2FieldConstant.Tx.NoCalldataSelectorValue;
          }
          if (tx.input.length < 10) {
            return null;
          }
          const selectorReader = new ByteStringReader(tx.input);
          const selector = selectorReader.readBytes("bytes4"); // function selector
          return selector;
        case AxiomV2FieldConstant.Tx.CalldataHashFieldIdx:
          return ethers.keccak256(tx.input);
        case AxiomV2FieldConstant.Tx.DataLengthFieldIdx:
          return getNumBytes(tx.input);
        default:
          logger.info(`Invalid tx field index: ${fieldOrCalldataIdx}`);
          return null;
      }
    }

    if (fieldOrCalldataIdx < AxiomV2FieldConstant.Tx.ContractDataIdxOffset) {
      // Parse calldata blob (ignoring function selector) to get calldata at specified idx
      const calldata = tx.input;
      const calldataIdx = fieldOrCalldataIdx - AxiomV2FieldConstant.Tx.CalldataIdxOffset;
      if (
        !tx.input ||
        // Slice off the 0x plus 4 bytes of the function signature. The EVM encodes all calldata datatypes
        // as 32-bytes regardless of size, so the remaining items minus function signature are 32 bytes each.
        calldataIdx >= tx.input.slice(10).length / 64
      ) {
        return null;
      }
      const reader = new ByteStringReader(calldata);
      const _functionSignature = reader.readBytes("bytes4"); // unused
      for (let i = 0; i < calldataIdx; i++) {
        reader.readBytes("bytes32");
      }
      const calldataValue = reader.readBytes("bytes32");
      return calldataValue;
    }

    // Get contractData Idx
    // Contract construction: https://blog.smlxl.io/evm-contract-construction-93c98cc4ca96
    const contractDataIdx = fieldOrCalldataIdx - AxiomV2FieldConstant.Tx.ContractDataIdxOffset;
    const contractData = tx.input;
    const numSlots = Math.ceil(tx.input.slice(2).length / 64);
    if (!tx.input || contractDataIdx >= numSlots) {
      return null;
    }
    if (contractDataIdx === numSlots - 1) {
      // Special case for last slot: we need to pad the last slot with 0s to 32 bytes
      return toLeHex(tx.input.slice(2 + (numSlots - 1) * 64), 32);
    }
    const reader = new ByteStringReader(contractData);
    for (let i = 0; i < contractDataIdx; i++) {
      reader.readBytes("bytes32");
    }
    const contractDataValue = reader.readBytes("bytes32");
    return contractDataValue;
  };

  const type = Number(tx?.type);
  if (type === TxType.Eip4844) {
    logger.error(`EIP-4844 transactions are not yet supported`);
    return null;
  } else if (type = TxType.OpSystem) {
    logger.error(`OP stack System transactions are not yet supported`);
    return null;
  }
  const value = getValue(tx, type);

  if (!value) return null;
  return bytes32(value);
}

export async function getReceiptFieldValue(
  provider: ethers.JsonRpcProvider,
  { blockNumber, txIdx, fieldOrLogIdx, topicOrDataOrAddressIdx, eventSchema }: ReceiptSubquery,
  logger: any = console,
  receipt?: any, // `receipt` input is raw output of JSON-RPC call from `getRawReceipt`
): Promise<string | null> {
  if (!receipt || receipt?.transactionHash === undefined || receipt.transactionHash === "") {
    // To preserve compatibility w/ ethers provder interface and return object flow, we'll
    // use one RPC call to first get the txHash
    const txHash = await getTxHash(provider, blockNumber, txIdx);
    if (!txHash) {
      logger.info(`Failed to find txHash for block ${blockNumber} txIdx ${txIdx}`);
      return null;
    }
    // const receipt = await provider.getTransactionReceipt(txHash);
    receipt = await getRawReceipt(provider, txHash);
    if (!receipt) {
      logger.info(`Failed to find receipt for txHash ${txHash}`);
      return null;
    }
  }

  const getValue = (receipt: any) => {
    if (
      fieldOrLogIdx >= AxiomV2FieldConstant.Receipt.LogsBloomIdxOffset &&
      fieldOrLogIdx < AxiomV2FieldConstant.Receipt.LogsBloomIdxOffset + 8
    ) {
      const logIdx = fieldOrLogIdx - AxiomV2FieldConstant.Receipt.LogsBloomIdxOffset;
      if (!receipt.logsBloom || logIdx >= receipt.logsBloom.slice(2).length / 64) {
        return null;
      }
      const reader = new ByteStringReader(receipt.logsBloom);
      for (let i = 0; i < logIdx; i++) {
        reader.readBytes("bytes32");
      }
      const logsBloomValue = reader.readBytes("bytes32");
      return logsBloomValue;
    }

    if (fieldOrLogIdx < AxiomV2FieldConstant.Receipt.LogIdxOffset) {
      switch (fieldOrLogIdx) {
        case ReceiptField.Status:
          return receipt?.status ?? null;
        case ReceiptField.PostState:
          return receipt?.root ?? null;
        case ReceiptField.CumulativeGas:
          return receipt?.cumulativeGasUsed ?? null;
        case ReceiptField.LogsBloom:
          return receipt?.logsBloom ?? null;
        case ReceiptField.Logs:
          logger.info(
            "Use `getFieldIdxReceiptLogIdx(idx) to get a log at index `idx` in this transaction",
          );
          return null;
        case AxiomV2FieldConstant.Receipt.TxTypeFieldIdx:
          return receipt?.type ?? null;
        case AxiomV2FieldConstant.Receipt.BlockNumberFieldIdx:
          return receipt?.blockNumber ?? null;
        case AxiomV2FieldConstant.Receipt.TxIndexFieldIdx:
          return receipt?.transactionIndex ?? null;
        default:
          logger.info(`Invalid receipt field index: ${fieldOrLogIdx}`);
          return null;
      }
    }

    const logIdx = fieldOrLogIdx - AxiomV2FieldConstant.Receipt.LogIdxOffset;
    const logItem = receipt.logs[logIdx] ?? null;
    if (!logItem) {
      logger.info(
        `log is null for block ${blockNumber} txIdx ${txIdx} fieldOrLogIdx ${fieldOrLogIdx}`,
      );
      return null;
    }
    const topics = logItem.topics;
    if (eventSchema !== ZeroHash && eventSchema !== topics[0]) {
      logger.info(`eventSchema do not match topics`);
      return null;
    }

    if (topicOrDataOrAddressIdx < AxiomV2FieldConstant.Receipt.DataIdxOffset) {
      // Return topic
      if (topicOrDataOrAddressIdx < logItem.topics.length) {
        return logItem.topics[topicOrDataOrAddressIdx];
      }

      // Return address
      if (topicOrDataOrAddressIdx === AxiomV2FieldConstant.Receipt.AddressIdx) {
        return logItem.address ?? null;
      }

      logger.info("Invalid topic index: ", topicOrDataOrAddressIdx);
      return null;
    }

    // Return data
    const dataIdx = topicOrDataOrAddressIdx - AxiomV2FieldConstant.Receipt.DataIdxOffset;
    if (!logItem.data || dataIdx >= logItem.data.slice(2).length / 64) {
      return null;
    }
    const reader = new ByteStringReader(logItem.data);
    for (let i = 0; i < dataIdx; i++) {
      reader.readBytes("bytes32");
    }
    const dataValue = reader.readBytes("bytes32");
    return dataValue;
  };

  if (Number(receipt?.type) === TxType.Eip4844) {
    logger.error(`EIP-4844 transaction receipts are not yet supported`);
    return null;
  } else if (Number(receipt?.type) === TxType.OpSystem) {
    logger.error(`OP stack System transaction receipts are not yet supported`);
    return null;
  }

  const value = getValue(receipt);

  if (!value) return null;
  return bytes32(value);
}

export async function getSolidityNestedMappingValue(
  provider: ethers.JsonRpcProvider,
  { blockNumber, addr, mappingSlot, mappingDepth, keys }: SolidityNestedMappingSubquery,
  logger: any = console,
): Promise<string | null> {
  let slot = bytes32(mappingSlot);
  for (let i = 0; i < mappingDepth; i++) {
    const key = bytes32(keys[i]);
    slot = ethers.keccak256(ethers.concat([key, slot]));
  }
  return await getStorageFieldValue(provider, { blockNumber, addr, slot }, logger);
}

function getNonexistentAccountFieldValue(fieldIdx: AccountField): string {
  switch (fieldIdx) {
    case AccountField.Nonce:
      return bytes32(0);
    case AccountField.Balance:
      return bytes32(0);
    case AccountField.StorageRoot:
      return CommonConstants.StorageHashEmpty;
    case AccountField.CodeHash:
      return bytes32(0);
    default:
      throw new Error(`Unknown AccountField index: ${fieldIdx}`);
  }
}
