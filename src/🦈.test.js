import shark from "./🦈.js";
import { describe, beforeEach, it, expect } from '@jest/globals'
describe('shark', () => {
    let instance;

    beforeEach(() => {
        instance = new shark();
    });

    it('instance should be an instanceof shark', () => {
        expect(instance instanceof shark).toBeTruthy();
    });
});