import { getByteLength } from "./byteLength";

export class ByteStringReader {
  public currentIdx: number;
  public byteString: string;

  constructor(byteString: string) {
    this.currentIdx = 0;
    this.byteString = byteString;
    if (this.byteString.startsWith("0x")) {
      this.byteString = this.byteString.slice(2);
    }
  }

  /**
   * Sets the current index of the reader
   * @param idx Index value to set `currentIdx` to
   */
  setIndex(idx: number) {
    this.currentIdx = idx;
  }

  /**
    * Gets the number of bytes remaining in the hexString
    */
  getNumBytesRemaining(): number {
    return Math.ceil((this.byteString.length - this.currentIdx) / 2);
  }

  /**
   * Reads `numBytes` from the byteString as an integer
   * @param numBytes Number of bytes to read
   * @returns An integer
   */
  readInt(numBytes: number | string): number {
    if (typeof numBytes === "string") {
      numBytes = getByteLength(numBytes);
    }
    const numNibbles = numBytes * 2;
    if (this.currentIdx + numNibbles > this.byteString.length) {
      throw new Error(`Read past end of byteString: ${this.currentIdx} + ${numNibbles} > ${this.byteString.length}`);
    }
    if (numBytes > 6) {
      const warningMsg = "WARNING: Javascript's integer precision is limited to 53 " +
        "bits. Reading an int of >6 bytes will lead to a loss of precision. Consider " +
        "using `readBytes(numBytes)` and converting it to a BigInt instead.";
      console.warn(warningMsg);
    }

    const strSlice = this.byteString.slice(this.currentIdx, this.currentIdx + numNibbles);
    const value = parseInt(strSlice, 16);
    if (isNaN(value)) {
      throw new Error(`Unable to decode byteString slice strSlice`);
    }
    this.currentIdx += numNibbles;
    return value;
  }

  /**
   * Reads numBytes bytes from the byteString and returns them as a hex string
   * @param numBytes Number of bytes to read
   * @returns Hex string of the bytes read
   */
  readBytes(numBytes: number | string): string {
    if (typeof numBytes === "string") {
      numBytes = getByteLength(numBytes);
    }
    const numNibbles = numBytes * 2;
    if (this.currentIdx + numNibbles > this.byteString.length) {
      throw new Error(`Read past end of byteString: ${this.currentIdx} + ${numNibbles} > ${this.byteString.length}`);
    }
    const value = "0x" + this.byteString.slice(this.currentIdx, this.currentIdx + numNibbles);
    this.currentIdx += numNibbles;
    return value;
  }

  /**
   * Moves `currentIdx` forward by `numBytes` bytes
   * @param numBytes Number of bytes to skip
   */
  skipBytes(numBytes: number) {
    this.currentIdx += numBytes * 2;
  }

  /**
   * Reads a variable length amount of bytes, with the first `numLenBytes` bytes representing the
   * length, and the remaining `len` bytes representing the value.
   * @param numLenBytes Number of bytes to read for the length
   * @returns The value from the bytes read
   */
  readVarLenBytes(numLenBytes: number): string {
    const len = this.readInt(numLenBytes);
    const value = this.readBytes(len);
    return value;
  }

  /**
   * Reads a `len` number of bytes32 values from the byteString
   * @param len Number of bytes32 values to read
   * @returns An array of bytes32 values
   */
  readFixedLenBytes32(len: number): string[] {
    const arr = new Array(len).fill("");
    for (let i = 0; i < len; i++) {
      arr[i] = this.readBytes(32);
    }
    return arr;
  }


  /**
   * Checks that all bytes in the byteString have been read
   * @returns true if all bytes in the byteString have been read, false otherwise
   */
  validateAllBytesRead(): boolean {
    if (this.currentIdx != this.byteString.length) {
      return false;
    }
    return true;
  }

  /**
   * Gets a slice of the current byteString in number of bytes (number of string chars * 2)
   * @param index Index to start slice
   * @param numBytes Number of bytes to include in slice
   * @returns Hexstring of the byte slice
   */
  getByteSlice(index: number, numBytes: number): string {
    const numNibbles = numBytes * 2;
    const slice = this.byteString.slice(index, index + numNibbles);
    return "0x" + slice;
  }
}
