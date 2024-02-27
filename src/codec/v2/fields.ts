import { AxiomV2FieldConstant } from "../../constants";

export function getFieldIdxHeaderLogsBloomIdx(idx: number): number {
  return AxiomV2FieldConstant.Header.LogsBloomFieldIdxOffset + idx;
}

export function getFieldIdxHeaderTxHash(): number {
  return AxiomV2FieldConstant.Header.HashFieldIdx;
}

export function getFieldIdxHeaderTxSize(): number {
  return AxiomV2FieldConstant.Header.HeaderSizeFieldIdx;
}

export function getFieldIdxHeaderExtraDataLen(): number {
  return AxiomV2FieldConstant.Header.ExtraDataLenFieldIdx;
}

export function getFieldIdxTxCalldataIdx(idx: number): number {
  return AxiomV2FieldConstant.Tx.CalldataIdxOffset + idx;
}

export function getFieldIdxTxContractDataIdx(idx: number): number {
  return AxiomV2FieldConstant.Tx.ContractDataIdxOffset + idx;
}

export function getFieldIdxTxType(): number {
  return AxiomV2FieldConstant.Tx.TxTypeFieldIdx;
}

export function getFieldIdxTxBlockNumber(): number {
  return AxiomV2FieldConstant.Tx.BlockNumberFieldIdx;
}

export function getFieldIdxTxIndex(): number {
  return AxiomV2FieldConstant.Tx.TxIndexFieldIdx;
}

export function getFieldIdxTxFunctionSelector(): number {
  return AxiomV2FieldConstant.Tx.FunctionSelectorFieldIdx;
}

export function getFieldIdxTxCalldataHash(): number {
  return AxiomV2FieldConstant.Tx.CalldataHashFieldIdx;
}

export function getFieldIdxTxDataLength(): number {
  return AxiomV2FieldConstant.Tx.DataLengthFieldIdx;
}

export function getFieldIdxReceiptTxType(): number {
  return AxiomV2FieldConstant.Receipt.TxTypeFieldIdx;
}

export function getFieldIdxReceiptBlockNumber(): number {
  return AxiomV2FieldConstant.Receipt.BlockNumberFieldIdx;
}

export function getFieldIdxReceiptTxIndex(): number {
  return AxiomV2FieldConstant.Receipt.TxIndexFieldIdx;
}

export function getFieldIdxReceiptLogIdx(idx: number): number {
  return AxiomV2FieldConstant.Receipt.LogIdxOffset + idx;
}

export function getFieldIdxReceiptTopicIdx(idx: number): number {
  return idx;
}

export function getFieldIdxReceiptDataIdx(idx: number): number {
  return AxiomV2FieldConstant.Receipt.DataIdxOffset + idx;
}

export function getFieldIdxReceiptLogsBloomIdx(idx: number): number {
  return AxiomV2FieldConstant.Receipt.LogsBloomIdxOffset + idx;
}

export function getFieldIdxReceiptLogAddress(): number {
  return AxiomV2FieldConstant.Receipt.AddressIdx;
}
