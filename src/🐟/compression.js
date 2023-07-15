import { brotliCompressSync, brotliDecompressSync } from 'zlib'
class compression {
    static compressString(str) {
        return brotliCompressSync(str).toString("base64")
    }
    static decompressString(str) {
        return brotliDecompressSync(Buffer.from(str, "base64")).toString()
    }
}
export default compression