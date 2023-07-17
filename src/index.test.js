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
        expect(hashKey).toBe("f4ae94915992469a97b348ca406f43dccb648e6ec7ee03aebbba87996502c4b8")
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
                "ZmY4NGZmZjVmZmRmZmZkZmZmZGZmZmRmZmZkZGZmOGRmZjllZmY4OGZmZGRmZmM1ZmZkZmZmZGRmZmE2ZmY5MmZmYjJmZmNiZmZhNWZmYmJmZjkzZmY5NGZmYjFmZjk1ZmY5N2ZmOTdmZmIxZmY5MmZmYTlmZjk0ZmZhNmZmYWJmZmI2ZmZjZGZmYjJmZmE4ZmZhNmZmODdmZmIxZmZiOGZmYWRmZjk3ZmZiMWZmOTJmZmFhZmZjYWZmYTVmZmFiZmY5OGZmY2JmZmIyZmY4NWZmYTlmZjk0ZmZhNWZmOTVmZmJlZmZjMmZmZGRmZmQzZmZmNWZmZGZmZmRmZmZkZmZmZGZmZmRkZmY5OWZmOTZmZjkzZmY5YWZmZGRmZmM1ZmZkZmZmZGRmZmI3ZmY5NmZmOWJmZjliZmY5YWZmOTFmZmRkZmZkM2ZmZjVmZmRmZmZkZmZmZGZmZmRmZmZkZGZmOTlmZjlhZmY5ZWZmOGJmZjhhZmY4ZGZmOWFmZjhjZmZkZGZmYzVmZmRmZmZhNGZmYTJmZmQzZmZmNWZmZGZmZmRmZmZkZmZmZGZmZmRkZmZhYmZmYjBmZmFiZmZhZmZmZGRmZmM1ZmZkZmZmOTlmZjllZmY5M2ZmOGNmZjlhZmZmNWZmODI="
            )
    })
    test("decrypt string", async() => {
        expect(await shark.cryptography.decrypt("jestPass",
            "ZmY4NGZmZjVmZmRmZmZkZmZmZGZmZmRmZmZkZGZmOGRmZjllZmY4OGZmZGRmZmM1ZmZkZmZmZGRmZmE2ZmY5MmZmYjJmZmNiZmZhNWZmYmJmZjkzZmY5NGZmYjFmZjk1ZmY5N2ZmOTdmZmIxZmY5MmZmYTlmZjk0ZmZhNmZmYWJmZmI2ZmZjZGZmYjJmZmE4ZmZhNmZmODdmZmIxZmZiOGZmYWRmZjk3ZmZiMWZmOTJmZmFhZmZjYWZmYTVmZmFiZmY5OGZmY2JmZmIyZmY4NWZmYTlmZjk0ZmZhNWZmOTVmZmJlZmZjMmZmZGRmZmQzZmZmNWZmZGZmZmRmZmZkZmZmZGZmZmRkZmY5OWZmOTZmZjkzZmY5YWZmZGRmZmM1ZmZkZmZmZGRmZmI3ZmY5NmZmOWJmZjliZmY5YWZmOTFmZmRkZmZkM2ZmZjVmZmRmZmZkZmZmZGZmZmRmZmZkZGZmOTlmZjlhZmY5ZWZmOGJmZjhhZmY4ZGZmOWFmZjhjZmZkZGZmYzVmZmRmZmZhNGZmYTJmZmQzZmZmNWZmZGZmZmRmZmZkZmZmZGZmZmRkZmZhYmZmYjBmZmFiZmZhZmZmZGRmZmM1ZmZkZmZmOTlmZjllZmY5M2ZmOGNmZjlhZmZmNWZmODI=", false, true, false)).toBe("hello")
    })

})