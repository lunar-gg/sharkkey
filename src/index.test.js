import shark from './🦈.js';
import fs from 'fs';
import process from 'process';
import { test, describe, expect } from '@jest/globals';
const hashKey = shark.cryptography.calculateKey(
    "jestPass", [],
    false,
    "jestFile.txt");
describe("calcKey", () => {
    test("calcKey", () => {
        expect(hashKey).toBe("f4ae94915992469a97b348ca406f43dccb648e6ec7ee03aebbba87996502c4b8");
    });
});
describe("files", () => {

    test("encrypt file", () => {
        fs.writeFileSync("jestFile.txt", "hello world", "utf8");
        fs.writeFileSync("jestFile2.txt", "hello world", "utf8");
        expect(shark.cryptography.encrypt(hashKey, "./jestFile.txt", {
                features: [],
                createIDFile: false,
                isString: false,
                doCopy: false,
                userkey: "cHaNgE-mE"
            }, true))
            .toBe(true);
    });
    test("encrypt file with compression", () => {
        fs.writeFileSync("jestFile2.txt", "hello world", "utf8");
        expect(shark.cryptography.encrypt(hashKey, "./jestFile2.txt", {
                features: [],
                createIDFile: false,
                isString: false,
                doCopy: false,
                userkey: "cHaNgE-mE",
                compression: true
            }, true))
            .toBe(true);
    });
    test("encrypt file with features", () => {
        fs.writeFileSync("jestFile3.txt", "features test", "utf8");
        let localHashKey = shark.cryptography.calculateKey(
            "cHaNgE-mE", ['hwid', 'distro', 'lip', 'username', 'timezone', 'locale', 'hostname', 'platform', 'serial', 'filename'],
            false,
            "./jestFile3.txt");
        expect(shark.cryptography.encrypt(localHashKey, "./jestFile3.txt", {
                features: ['hwid', 'distro', 'lip', 'username', 'timezone', 'locale', 'hostname', 'platform', 'serial', 'filename'],
                createIDFile: false,
                isString: false,
                doCopy: false,
                userkey: "cHaNgE-mE",
                compression: false
            }, true))
            .toBe(true);
    });
    test("encrypt file with id", () => {
        fs.writeFileSync("jestFileId.txt", "hello world", "utf8");
        let hk = shark.cryptography.calculateKey(
            "jestPass", [],
            true,
            "jestFileId.txt");
        expect(shark.cryptography.encrypt(hk, "./jestFileId.txt", {
                features: [],
                createIDFile: true,
                isString: false,
                doCopy: false,
                userkey: "jestPass"
            }, true))
            .toBe(true);
    });
    test("checkid file", () => {
        expect(shark.cryptography.checkid("jestFileId.txt.🦈🔑🪪", "jestPass"))
            .toHaveProperty('id', { '0': '992469a97b348ca4', '1': '502c4b8f4ae94915' });
    });
    test("decrypt file", () => {
        expect(shark.cryptography.decrypt("jestPass", "./jestFile.txt.🦈🔑", true, false, false, false))
            .toBe(true);
        if (fs.existsSync("jestFile.txt")) fs.unlinkSync("jestFile.txt");
        if (fs.existsSync("jestFile2.txt")) fs.unlinkSync("jestFile2.txt");
        if (fs.existsSync("jestFileId.txt.🦈🔑")) fs.unlinkSync("jestFileId.txt.🦈🔑");
        if (fs.existsSync("jestFileId.txt.🦈🔑🪪")) fs.unlinkSync("jestFileId.txt.🦈🔑🪪");
        if (fs.existsSync("jestFileTOTP.txt.🦈🔑")) fs.unlinkSync("jestFileTOTP.txt.🦈🔑");
    });
    test("decrypt file with compression", () => {
        expect(shark.cryptography.decrypt("jestPass", "./jestFile2.txt.🦈🔑", true, false, false, true))
            .toBe(true);
        if (fs.existsSync("jestFile.txt")) fs.unlinkSync("jestFile.txt");
        if (fs.existsSync("jestFile2.txt")) fs.unlinkSync("jestFile2.txt");
        if (fs.existsSync("jestFileId.txt.🦈🔑")) fs.unlinkSync("jestFileId.txt.🦈🔑");
        if (fs.existsSync("jestFileId.txt.🦈🔑🪪")) fs.unlinkSync("jestFileId.txt.🦈🔑🪪");
        if (fs.existsSync("jestFileTOTP.txt.🦈🔑")) fs.unlinkSync("jestFileTOTP.txt.🦈🔑");
    });
    test("decrypt file with features", () => {
        expect(shark.cryptography.decrypt("cHaNgE-mE", "./jestFile3.txt.🦈🔑", true, false, false, false))
            .toBe(true);
        if (fs.existsSync("jestFile.txt")) fs.unlinkSync("jestFile.txt");
        if (fs.existsSync("jestFile2.txt")) fs.unlinkSync("jestFile2.txt");
        if (fs.existsSync("jestFile3.txt")) fs.unlinkSync("jestFile3.txt");
        if (fs.existsSync("jestFileId.txt.🦈🔑")) fs.unlinkSync("jestFileId.txt.🦈🔑");
        if (fs.existsSync("jestFileId.txt.🦈🔑🪪")) fs.unlinkSync("jestFileId.txt.🦈🔑🪪");
        if (fs.existsSync("jestFileTOTP.txt.🦈🔑")) fs.unlinkSync("jestFileTOTP.txt.🦈🔑");
    });

});
describe("strings", () => {
    test("encrypt string", () => {
        expect(shark.cryptography.encrypt(hashKey, "hello", {
                features: [],
                createIDFile: false,
                isString: true,
                doCopy: false,
                userkey: "jestPass"
            }, false))
            .toBe(
                "ODRmNWRmZGZkZmRmZGQ4ZDllODhkZGM1ZGZkZGNhYzg5ZTllY2FjODk5Y2U5Y2NjZGJkYmNmY2Y5ZWM5OWNjOWM3Y2VjOWNhYzc5YmM4Y2Q5ZGM2OWNjYTlhY2NjZmNjY2JjNmNiYzg5YWM2OWJjYTliY2JkYmRiY2NjZGM5Y2NjY2M2Y2NjYWM5Y2FjOWNhYzljZGNjYzljY2NkYzljYWM5Y2RjOWNkYzljZWNjYzZjOWNlY2NjZmRkZDNmNWRmZGZkZmRmZGQ5OTk2OTM5YWRkYzVkZmRkYjc5NjliOWI5YTkxZGRkM2Y1ZGZkZmRmZGZkZDk5OWE5ZThiOGE4ZDlhOGNkZGM1ZGZhNGEyZDNmNWRmZGZkZmRmZGRhYmIwYWJhZmRkYzVkZjk5OWU5MzhjOWFmNTgy"
            );
    });
    test("decrypt string", () => {
        expect(shark.cryptography.decrypt("jestPass",
            "ODRmNWRmZGZkZmRmZGQ4ZDllODhkZGM1ZGZkZGNhYzg5ZTllY2FjODk5Y2U5Y2NjZGJkYmNmY2Y5ZWM5OWNjOWM3Y2VjOWNhYzc5YmM4Y2Q5ZGM2OWNjYTlhY2NjZmNjY2JjNmNiYzg5YWM2OWJjYTliY2JkYmRiY2NjZGM5Y2NjY2M2Y2NjYWM5Y2FjOWNhYzljZGNjYzljY2NkYzljYWM5Y2RjOWNkYzljZWNjYzZjOWNlY2NjZmRkZDNmNWRmZGZkZmRmZGQ5OTk2OTM5YWRkYzVkZmRkYjc5NjliOWI5YTkxZGRkM2Y1ZGZkZmRmZGZkZDk5OWE5ZThiOGE4ZDlhOGNkZGM1ZGZhNGEyZDNmNWRmZGZkZmRmZGRhYmIwYWJhZmRkYzVkZjk5OWU5MzhjOWFmNTgy", false, true, false)).toBe("hello");
    });

});
describe("compression", () => {
    test("compression", () => {
        expect(shark.compression.compressString("hello world"))
            .toBe("CwWAaGVsbG8gd29ybGQD");
    });
    test("decompression", () => {
        expect(shark.compression.decompressString("CwWAaGVsbG8gd29ybGQD"))
            .toBe("hello world");
    });
});
describe("generic", () => {
    test("art", () => {
        expect(shark.art())
            .toContain(`@********..........(..(...***,...******@@@@@@@@@@@@@@@@@@@**********************`);
    });
    test("verboseLog", () => {
        expect(shark.vlog("hello world"))
            .toBe(undefined);
    });
    test("vlog verbose enabled", () => {
        process.argv.push("--verbose");
        expect(shark.vlog("hello world"))
            .toBe(undefined);
    });
    test("get file info", () => {
        expect(shark.cryptography.getFilePath("./index.test.js"))
            .toMatchObject({ filename: 'index.test.js', extension: '.js', directoryPath: '.' });
    });
    test("string to hex hash", () => {
        expect(shark.cryptography.hash.fish128("hello world", "utf8").toString("hex"))
            .toBe("7a3405bfd4fc5750e747480dcd60510a35a92bbb489b041eb5c70a891f2fc634");
    });
});
describe("fish hash", () => {
    let h = shark.cryptography.hash;
    test("fish64short", () => {
        expect(h.fish64("hello world", "utf8", true))
            .toBe("0321d345f1ff969e");
    });
    test("fish64normal", () => {
        expect(h.fish64("hello world", "utf8", false))
            .toBe("f50de3a4f45a24e345f1ff969e0321d9");
    });
    test("fish128", () => {
        expect(h.fish128("hello world", "utf8"))
            .toBe("7a3405bfd4fc5750e747480dcd60510a35a92bbb489b041eb5c70a891f2fc634");
    });
    test("fish256", () => {
        expect(h.fish256("hello world", "utf8"))
            .toBe("012d955a49b00bddb7ea38576f6fb05c43c2e0eca8308c97c7509d43aa5291f1de1d3bfdaeab7c4556bde213f165089198fa6be1fd2d5d983435261ff70c44ca");
    });
    test("fish512", () => {
        expect(h.fish512("hello world", "utf8"))
            .toBe("0b876d42c8e72587b32b443feaeac514305046146b0cc9152194c80ce53994ae0c5f8484cb3c8ea6350db144a857a3d45876371980a24f109717424cd56ba934889dc38f657a8fe499f924a51146fa8ae1a0d6d68dfed639084f261ce5fffc5a5298798fed6f230f5846d2a9d424d0a154a642d673514f8f73e62a03778af865");
    });
});
describe("disklist", () => {
    test("Check drives", () => {
        expect(typeof shark.disklist.listDrivesSync() === 'object')
            .toBeTruthy();
    }, 20000);
});