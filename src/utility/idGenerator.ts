export class IdGenerator {
    private _index: number;

    constructor() {
        this._index = 0;
    }

    next() {
        return {value: this._index++, done: false};
    }

    reset() {
        this._index = 0;
    }
}