"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
class httpPromise {
    constructor(parmas, body) {
        this.send = (params, body) => {
            return new Promise((ret, err) => __awaiter(this, void 0, void 0, function* () {
                if (params !== undefined) {
                    this.params = params;
                }
                if (body !== undefined) {
                    this.body = body;
                }
                let jsonRet;
                jsonRet = {};
                //console.log(params);
                const req = https.request(this.params, (res) => {
                    //    console.log('statusCode:', res.statusCode);
                    let data = '';
                    jsonRet.statusCode = res.statusCode;
                    jsonRet.headers = res.headers;
                    //  console.log('headers:', res.headers);
                    //  console.log(res);
                    res.on('data', (d) => {
                        data += d;
                    });
                    res.on('end', () => {
                        jsonRet.body = data;
                        ret(jsonRet);
                    });
                });
                if (this.body !== undefined) {
                    req.write(this.body);
                }
                req.on('error', (e) => {
                    jsonRet.error = e;
                    err(jsonRet);
                });
                req.end();
            }));
        };
        this.params = parmas;
        this.body = body;
    }
    set setParams(params) {
        this.params = params;
    }
    get getParams() {
        return this.params;
    }
    set setBody(body) {
        this.body = body;
    }
    get getBody() {
        return this.body;
    }
}
exports.httpPromise = httpPromise;
//# sourceMappingURL=httpsPromise.js.map