"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IdGenerator {
    constructor() {
        this._index = 0;
    }
    next() {
        return { value: this._index++, done: false };
    }
    reset() {
        this._index = 0;
    }
}
exports.IdGenerator = IdGenerator;
//# sourceMappingURL=idGenerator.js.map