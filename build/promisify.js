"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class promisify {
    constructor(func) {
        return (...args) => new Promise((resolve, reject) => {
            const callback = (err, data) => err ? reject(err) : resolve(data);
            func.apply(this, [...args, callback]);
        });
    }
}
exports.promisify = promisify;
//# sourceMappingURL=promisify.js.map