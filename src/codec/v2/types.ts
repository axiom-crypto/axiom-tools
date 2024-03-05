export interface AxiomV2Query {
  version: number;
  sourceChainId: string;
  caller: string;
  dataQueryHash: string;
  computeQuery: AxiomV2ComputeQuery;
  callback: AxiomV2Callback;
  userSalt: string;
  feeData: AxiomV2FeeData;
  refundee: string;
}

export interface AxiomV2FullQuery {
  version: number;
  sourceChainId: string;
  caller: string;
  dataQuery: AxiomV2DataQuery;
  computeQuery: AxiomV2ComputeQuery;
  callback: AxiomV2Callback;
  userSalt: string;
  feeData: AxiomV2FeeData;
  refundee: string;
}

export interface AxiomV2ComputeQuery {
  k: number;
  resultLen?: number;
  vkey: string[];
  computeProof: string;
}

export interface AxiomV2DataQuery {
  sourceChainId: string;
  subqueries: DataSubquery[];
}

export interface AxiomV2Callback {
  target: string;
  extraData: string;
}

export interface AxiomV2FeeData {
  maxFeePerGas: string;
  callbackGasLimit: number;
  overrideAxiomQueryFee: string;
}

export interface AxiomV2QueryWitness {
  caller: string;
  userSalt: string;
  queryHash: string;
  callbackHash: string;
  refundee: string;
}

export interface AxiomV2Result {
  sourceChainId: string;
  dataResultsRoot: string;
  dataResultsPoseidonRoot: string;
  computeResultsHash: string;
}

export interface Subquery {
  /**
   * The block number of the block that the subquery needs data from.
   * `undefined` if no block is needed.
   */
  blockNumber?: number;
}

export interface StorageSubqueryV1 extends Subquery {
  blockNumber: number;
  address?: string;
  slot?: string;
  value?: string;
}

export interface HeaderSubquery extends Subquery {
  blockNumber: number;
  fieldIdx: number;
}

export interface AccountSubquery extends Subquery {
  blockNumber: number;
  addr: string;
  fieldIdx: number;
}

export interface StorageSubquery extends Subquery {
  blockNumber: number;
  addr: string;
  slot: string;
}

export interface TxSubquery extends Subquery {
  blockNumber: number;
  txIdx: number;
  fieldOrCalldataIdx: number;
}

export interface ReceiptSubquery extends Subquery {
  blockNumber: number;
  txIdx: number;
  fieldOrLogIdx: number;
  topicOrDataOrAddressIdx: number;
  eventSchema: string;
}

export interface SolidityNestedMappingSubquery extends Subquery {
  blockNumber: number;
  addr: string;
  mappingSlot: string;
  mappingDepth: number;
  keys: string[];
}

export interface BeaconValidatorSubquery extends Subquery {
  // WIP
}

export interface AccountState {
  nonce: string;
  balance: string;
  storageHash: string;
  codeHash: string;
}

export interface DataSubquery {
  type: DataSubqueryType;
  subqueryData: Subquery;
}

export enum DataSubqueryType {
  StorageV1,
  Header,
  Account,
  Storage,
  Transaction,
  Receipt,
  SolidityNestedMapping,
  BeaconValidator,
}

export enum HeaderField {
  ParentHash,
  Sha3Uncles,
  Miner,
  StateRoot,
  TransactionsRoot,
  ReceiptsRoot,
  LogsBloom,
  Difficulty,
  Number,
  GasLimit,
  GasUsed,
  Timestamp,
  ExtraData,
  MixHash,
  Nonce,
  BaseFeePerGas, // EIP-1559
  WithdrawalsRoot, // EIP-4895
  // BlobGasUsed, // EIP-4844
  // ExcessBlobGas, // EIP-4844
  // ParentBeaconBlockRoot, // EIP-4844
}

export enum AccountField {
  Nonce,
  Balance,
  StorageRoot,
  CodeHash,
}

export enum TxField {
  ChainId,
  Nonce,
  MaxPriorityFeePerGas,
  MaxFeePerGas,
  GasLimit,
  To,
  Value,
  Data,
  // AccessList is not supported
  GasPrice, // Legacy & EIP-2930
  v, // Legacy
  r, // Legacy
  s, // Legacy
}

export enum ReceiptField {
  Status, // status for post EIP-658
  PostState, // postState for pre EIP-658
  CumulativeGas,
  LogsBloom,
  Logs,
}

export enum TxType {
  Legacy,
  Eip2930,
  Eip1559,
  Eip4844,
}
