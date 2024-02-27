import { ByteStringReader } from "../../utils/byteStringReader";
import { decodeQueryV1 } from "../v1/decoder";
import { decodeQueryV2 } from "../v2";

/**
 * Decodes a queryString into a Query object. You can typecast the result to the appropriate Query 
 * type (i.e. QueryV1, QueryV2).
 * @param query The query as bytes in hex string format
 * @returns A Query object conforming to the decoded Query version
 */
export function decodeQuery(query: string): any {
  const reader = new ByteStringReader(query);

  const version = reader.readInt(1);
  switch (version) {
    case 1:
      return decodeQueryV1(reader.byteString.slice(reader.currentIdx));
    case 2:
      return decodeQueryV2(reader.byteString.slice(reader.currentIdx));
    default:
      throw new Error(`Unsupported version: ${version}`);
  }
}