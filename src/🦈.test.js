import shark from "./🦈.js";
import fs from 'fs';
import { describe, beforeEach, it, expect } from '@jest/globals';
describe('shark', () => {
    let instance;
    beforeEach(() => {
        instance = shark;
    });
    it('bind shark to instance', () => { //??
        expect(instance === shark).toBeTruthy();
    });
    it("imported shark should have the correct properties", () => {
        expect(shark.cryptography).toBeDefined();
        expect(shark.compression).toBeDefined();
        expect(shark.vlog).toBeDefined();
        expect(shark.art).toBeDefined();
    });
    describe("Check environment", () => {
        it("cleanup", () => {
            let trash = [];
            let files = fs.readdirSync("./");
            if (files.includes("🦈🔑")) { console.log("Cache has not yet been cleared"); } else {
                console.log("Old files that could've been used by sharkkey are not pressent 👍");
            }
            for (const file in files) {
                if (file.includes("🦈🔑")) trash.push(file);
            }
            for (const file in trash) {
                fs.unlinkSync(file);
            }
        });
    });
});