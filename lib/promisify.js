"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function promisify(func) {
    return (...args) => new Promise((resolve, reject) => {
        try {
            const callback = (err, data) => err ? reject(err) : resolve(data);
            func.apply(this, [...args, callback]);
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.promisify = promisify;
function http_promisify(func) {
    return (...args) => new Promise((resolve, reject) => {
        try {
            const callback = (data) => resolve(data);
            func.apply(this, [...args, callback]);
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.http_promisify = http_promisify;
//# sourceMappingURL=promisify.js.map