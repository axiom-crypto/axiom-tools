import {
  decodeQuery,
  encodeQueryV1,
  encodeQueryRowV1,
} from '../../../src';

describe('Encoder V1', () => {
  test('Encoding a QueryV1', () => {
    const query = [
      {
        blockNumber: 15537394,
        address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        slot: 0,
        value: 0,
      },
      {
        blockNumber: 15822595,
        address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        slot: 0,
        value: 0,
      },
      {
        blockNumber: 17000000,
        address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      },
    ]
    let queryRows: string[] = [];
    for (const queryRow of query) {
      const length = Object.keys(queryRow).length;
      const rowHash = encodeQueryRowV1(length, queryRow.blockNumber, queryRow.address, queryRow.slot ?? 0, queryRow.value ?? 0);
      queryRows.push(rowHash);
    }
    const encodedQuery = encodeQueryV1(query.length, queryRows);

    expect(encodedQuery).toEqual("0x01000000030400ed14f25c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400f16f035c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002010366405c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f");

    // Decode the query again and verify
    const decoded = decodeQuery(encodedQuery);
    const decodedRows = decoded.body;

    expect(decodedRows.length).toEqual(3);
    for (const [i, queryRow] of decodedRows.entries()) {
      expect(queryRow.blockNumber).toEqual(query[i].blockNumber);
      expect(queryRow.address).toEqual(query[i].address.toLowerCase());
    }
  });
});