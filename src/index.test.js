import shark from './🦈.js';
import fs from 'fs'
import process from 'process';
import { test, describe, expect } from '@jest/globals'
const hashKey = await shark.cryptography.calculateKey(
    "jestPass", [],
    false,
    "jestFile.txt")
describe("calcKey", () => {
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
    test("encrypt file with id", async() => {
        fs.writeFileSync("jestFileId.txt", "hello world", "utf8")
        let hk = await shark.cryptography.calculateKey(
            "jestPass", [],
            true,
            "jestFileId.txt")
        expect(await shark.cryptography.encrypt(hk, "./jestFileId.txt", true, [], true, false, false))
            .toBe(true)
    })
    test("encrypt file with TOTP", async() => {
        fs.writeFileSync("jestFileTOTP.txt", "hello world", "utf8")
        expect(await shark.cryptography.encrypt(hashKey, "./jestFileTOTP.txt", true, ["totp"], false, false, false))
            .toBe(true)
    })
    test("decrypt file", async() => {
        expect(await shark.cryptography.decrypt("jestPass", "./jestFile.txt.🦈🔑", true, false, false))
            .toBe(true)
        if (fs.existsSync("jestFile.txt")) fs.unlinkSync("jestFile.txt")
        if (fs.existsSync("jestFileId.txt.🦈🔑")) fs.unlinkSync("jestFileId.txt.🦈🔑")
        if (fs.existsSync("jestFileId.txt.🦈🔑🪪")) fs.unlinkSync("jestFileId.txt.🦈🔑🪪")
        if (fs.existsSync("jestFileTOTP.txt.🦈🔑")) fs.unlinkSync("jestFileTOTP.txt.🦈🔑")
    })

})
describe("strings", () => {
    test("encrypt string", async() => {
        expect(await shark.cryptography.encrypt(hashKey, "hello", false, [], false, true, false))
            .toBe(
                "ODRmNWRmZGZkZmRmZGQ4ZDllODhkZGM1ZGZkZGE2OTJiMmNiYTViYjkzOTRiMTk1OTc5N2IxOTJhOTk0YTZhYmI2Y2RiMmE4YTY4N2IxYjhhZDk3YjE5MmFhY2FhNWFiOThjYmIyODVhOTk0YTU5NWJlYzJkZGQzZjVkZmRmZGZkZmRkOTk5NjkzOWFkZGM1ZGZkZGI3OTY5YjliOWE5MWRkZDNmNWRmZGZkZmRmZGQ5OTlhOWU4YjhhOGQ5YThjZGRjNWRmYTRhMmQzZjVkZmRmZGZkZmRkYWJiMGFiYWZkZGM1ZGY5OTllOTM4YzlhZjU4Mg=="
            )
    })
    test("decrypt string", async() => {
        expect(await shark.cryptography.decrypt("jestPass",
            "ODRmNWRmZGZkZmRmZGQ4ZDllODhkZGM1ZGZkZGE2OTJiMmNiYTViYjkzOTRiMTk1OTc5N2IxOTJhOTk0YTZhYmI2Y2RiMmE4YTY4N2IxYjhhZDk3YjE5MmFhY2FhNWFiOThjYmIyODVhOTk0YTU5NWJlYzJkZGQzZjVkZmRmZGZkZmRkOTk5NjkzOWFkZGM1ZGZkZGI3OTY5YjliOWE5MWRkZDNmNWRmZGZkZmRmZGQ5OTlhOWU4YjhhOGQ5YThjZGRjNWRmYTRhMmQzZjVkZmRmZGZkZmRkYWJiMGFiYWZkZGM1ZGY5OTllOTM4YzlhZjU4Mg==", false, true, false)).toBe("hello")
    })

})
describe("compression", () => {
    test("compression", () => {
        expect(shark.compression.compressString("hello world"))
            .toBe("CwWAaGVsbG8gd29ybGQD")
    })
    test("decompression", () => {
        expect(shark.compression.decompressString("CwWAaGVsbG8gd29ybGQD"))
            .toBe("hello world")
    })
})
describe("generic", () => {
    test("art", () => {
        expect(shark.art())
            .toContain(`@********..........(..(...***,...******@@@@@@@@@@@@@@@@@@@**********************`)
    })
    test("vlog", () => {
        expect(shark.vlog("hello world"))
            .toBe(undefined)
    })
    test("vlog verbose enabled", () => {
        process.argv.push("--verbose")
        expect(shark.vlog("hello world"))
            .toBe(undefined)
    })
    test("get file info", () => {
        expect(shark.cryptography.getFilePath("./index.test.js"))
            .toMatchObject({ filename: 'index.test.js', extension: '.js', directoryPath: '.' })
    })
    test("string to hex hash", () => {
        expect(shark.cryptography.getKeyFromPassphrase("hello world").toString("hex"))
            .toBe("f3399f2597c239c53bb3ac36a611ad558ae61aea3a20736455179d4390050482")
    })
})
describe("fish hash", () => {
    let h = shark.cryptography.hash
    test("fish64short", () => {
        expect(h.fish64("hello world", "utf8", true))
            .toBe("0321d345f1ff969e")
    })
    test("fish64normal", () => {
        expect(h.fish64("hello world", "utf8", false))
            .toBe("f50de3a4f45a24e345f1ff969e0321d9")
    })
    test("fish128", () => {
        expect(h.fish128("hello world", "utf8"))
            .toBe("7a3405bfd4fc5750e747480dcd60510a35a92bbb489b041eb5c70a891f2fc634")
    })
    test("fish256", () => {
        expect(h.fish256("hello world", "utf8"))
            .toBe("012d955a49b00bddb7ea38576f6fb05c43c2e0eca8308c97c7509d43aa5291f1de1d3bfdaeab7c4556bde213f165089198fa6be1fd2d5d983435261ff70c44ca")
    })
    test("fish512", () => {
        expect(h.fish512("hello world", "utf8"))
            .toBe("0b876d42c8e72587b32b443feaeac514305046146b0cc9152194c80ce53994ae0c5f8484cb3c8ea6350db144a857a3d45876371980a24f109717424cd56ba934889dc38f657a8fe499f924a51146fa8ae1a0d6d68dfed639084f261ce5fffc5a5298798fed6f230f5846d2a9d424d0a154a642d673514f8f73e62a03778af865")
    })
})