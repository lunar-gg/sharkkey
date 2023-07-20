// Native imports
import { brotliCompressSync, brotliDecompressSync } from 'node:zlib';
import { Buffer } from 'buffer';
/**
 * Class that contains functions to compress and decompress data with brotli
 */
class Compression {
    /**
     * Compress a string using brotli
     * @param {string} str 
     * @returns {string} Base64 Encoded
     */
    static compressString(str) {
        return brotliCompressSync(str).toString("base64");
    }

    /**
     * Decompress a base64 encoded brotli compressed string
     * @param {string} str Base64 encoded string
     * @returns {string} Decompressed string
     */
    static decompressString(str) {
        return brotliDecompressSync(Buffer.from(str, "base64")).toString();
    }
}
export default Compression;