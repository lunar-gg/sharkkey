import shark from "./🦈.js";
import { describe, beforeEach, it, expect } from '@jest/globals'
describe('shark', () => {
    let instance;
    beforeEach(() => {
        instance = shark
    });
    it('bind shark to instance', () => { //??
        expect(instance === shark).toBeTruthy();
    });
    it("imported shark should have the correct properties", () => {
        expect(shark.cryptography).toBeDefined();
        expect(shark.compression).toBeDefined();
        expect(shark.vlog).toBeDefined();
        expect(shark.art).toBeDefined();
    })
});