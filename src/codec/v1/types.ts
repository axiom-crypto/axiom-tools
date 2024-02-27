export interface QueryV1 {
  header: any;
  body: QueryRow[];
}

export interface QueryRow {
  blockNumber: number;
  address?: string;
  slot?: string;
  value?: string;
}