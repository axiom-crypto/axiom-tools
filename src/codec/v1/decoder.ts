import { QueryRow, QueryV1 } from "./types";

// The packed query blob is encodePacked as [versionIdx, length, encdoedQueries[]]: ["uint8", "uint32", "bytes[]"]
// Each row is then encodePacked as [length, blockNumber, address, slot, value]: ["uint8", "uint32", "address", "uint256", "uint256"]
export function decodeQueryV1(
  query: string
): QueryV1 {
  const numQueryRows = parseInt(query.slice(0, 8), 16);
  const encodedQueries = query.slice(8);
  if (isNaN(numQueryRows)) {
    throw new Error(`Unable to decode number of query rows: ${query.slice(0, 8)}`)
  }

  let header = {
    version: 1,
    rows: numQueryRows,
  };
  const body = decodePackedQueryRows(encodedQueries, numQueryRows);
  
  return {
    header,
    body,
  };
}

function decodePackedQueryRows(encodedQueries: string, rows: number): QueryRow[] {
  let decodedQueries: QueryRow[] = [];
  let offset = 0;
  for (let i = 0; i < rows; i++) {
    const queryLength = parseInt(encodedQueries.slice(offset, offset + 2), 16);
    offset += 2;
    if (queryLength > 4) {
      throw new Error(`Invalid query length: greater than 4: ${queryLength}`);
    }

    const blockNumber = parseInt(encodedQueries.slice(offset, offset + 8), 16);
    offset += 8;

    if (queryLength === 1) {
      decodedQueries.push({
        blockNumber,
        address: undefined,
        slot: undefined,
        value: undefined,
      });
      continue;
    }
    const address = `0x${encodedQueries.slice(offset, offset + 40)}`;
    offset += 40;

    if (queryLength === 2) {
      decodedQueries.push({
        blockNumber,
        address,
        slot: undefined,
        value: undefined,
      });
      continue;
    }
    const slot = `0x${encodedQueries.slice(offset, offset + 64)}`;
    offset += 64;

    const value = `0x${encodedQueries.slice(offset, offset + 64)}`;
    offset += 64;
    decodedQueries.push({
      blockNumber,
      address,
      slot,
      value,
    });
  }

  return decodedQueries;
}
