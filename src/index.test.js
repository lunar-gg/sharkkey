import { program } from 'commander';
import shark from './🦈.js';
import fs from 'fs'
import { jest, test, afterEach, beforeAll, afterAll, describe, beforeEach, it, expect } from '@jest/globals'
var hashKey = await shark.cryptography.calculateKey(
    "jestPass", [],
    false,
    "jestFile.txt")
describe("function calcKey", () => {
    test("calcKey", () => {
        expect(hashKey).toBe("b8472966290cb802cffa3e06f43dccb648e6ec7ee03aebbba87996c6331d6055")
    })
})
describe("files", () => {

    test("encrypt file", async() => {
        fs.writeFileSync("jestFile.txt", "hello world", "utf8")
        expect(await shark.cryptography.encrypt(hashKey, "./jestFile.txt", true, [], false, false, false))
            .toBe(true)
    })
    test("decrypt file", async() => {
        expect(await shark.cryptography.decrypt("jestPass", "./jestFile.txt.🦈🔑", true, false, false))
            .toBe(true)
        if (fs.existsSync("jestFile.txt")) fs.unlinkSync("jestFile.txt")
    })

})
describe("strings", () => {
    test("encrypt string", async() => {
        expect(await shark.cryptography.encrypt(hashKey, "hello", false, [], false, true, false))
            .toBe(
                "ZmY4NGZmZjVmZmRmZmZkZmZmZGZmZmRmZmZkZGZmOGRmZjllZmY4OGZmZGRmZmM1ZmZkZmZmZGRmZmIyZmZhYmZmYjJmZmNjZmZiMmZmODVmZmI1ZmY5NmZmYjJmZmI4ZmZhOWZmOTdmZmIxZmY4NWZmYjJmZmNkZmZiMmZmOTVmZjk4ZmZjZmZmYjBmZmFiZmZiZWZmY2NmZmIyZmY4NWZmYTlmZjkzZmZiMWZmYjhmZmI2ZmY4NWZmYTZmZmE4ZmZiMmZmY2FmZmIxZmZjZGZmYjlmZjk1ZmZhNWZmOTJmZmI2ZmZjMmZmZGRmZmQzZmZmNWZmZGZmZmRmZmZkZmZmZGZmZmRkZmY5OWZmOTZmZjkzZmY5YWZmZGRmZmM1ZmZkZmZmZGRmZmI3ZmY5NmZmOWJmZjliZmY5YWZmOTFmZmRkZmZkM2ZmZjVmZmRmZmZkZmZmZGZmZmRmZmZkZGZmOTlmZjlhZmY5ZWZmOGJmZjhhZmY4ZGZmOWFmZjhjZmZkZGZmYzVmZmRmZmZhNGZmYTJmZmQzZmZmNWZmZGZmZmRmZmZkZmZmZGZmZmRkZmZhYmZmYjBmZmFiZmZhZmZmZGRmZmM1ZmZkZmZmOTlmZjllZmY5M2ZmOGNmZjlhZmZmNWZmODI="
            )
    })
    test("decrypt string", async() => {
        expect(await shark.cryptography.decrypt("jestPass",
            "ZmY4NGZmZjVmZmRmZmZkZmZmZGZmZmRmZmZkZGZmOGRmZjllZmY4OGZmZGRmZmM1ZmZkZmZmZGRmZmIyZmZhYmZmYjJmZmNjZmZiMmZmODVmZmI1ZmY5NmZmYjJmZmI4ZmZhOWZmOTdmZmIxZmY4NWZmYjJmZmNkZmZiMmZmOTVmZjk4ZmZjZmZmYjBmZmFiZmZiZWZmY2NmZmIyZmY4NWZmYTlmZjkzZmZiMWZmYjhmZmI2ZmY4NWZmYTZmZmE4ZmZiMmZmY2FmZmIxZmZjZGZmYjlmZjk1ZmZhNWZmOTJmZmI2ZmZjMmZmZGRmZmQzZmZmNWZmZGZmZmRmZmZkZmZmZGZmZmRkZmY5OWZmOTZmZjkzZmY5YWZmZGRmZmM1ZmZkZmZmZGRmZmI3ZmY5NmZmOWJmZjliZmY5YWZmOTFmZmRkZmZkM2ZmZjVmZmRmZmZkZmZmZGZmZmRmZmZkZGZmOTlmZjlhZmY5ZWZmOGJmZjhhZmY4ZGZmOWFmZjhjZmZkZGZmYzVmZmRmZmZhNGZmYTJmZmQzZmZmNWZmZGZmZmRmZmZkZmZmZGZmZmRkZmZhYmZmYjBmZmFiZmZhZmZmZGRmZmM1ZmZkZmZmOTlmZjllZmY5M2ZmOGNmZjlhZmZmNWZmODI=", false, true, false)).toBe("hello")
    })

})