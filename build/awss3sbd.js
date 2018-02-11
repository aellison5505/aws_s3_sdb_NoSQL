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
const aws2 = require("aws2");
const querystring = require("querystring");
const xmltojson = require("xml2js");
class AWS_S3_SBD {
    constructor(db, options) {
        this.db = db;
        this.options = options;
        this.createDB = () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((cb, rerr) => __awaiter(this, void 0, void 0, function* () {
                this.awsSDB = {
                    'Action': 'CreateDomain',
                    'DomainName': this.dbname,
                    'Version': '2009-04-15'
                };
                try {
                    cb(yield this.sendSDB(yield this.createOpts()));
                }
                catch (err) {
                    rerr(err);
                }
            }));
        });
        this.openDB = () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((cb, rerr) => __awaiter(this, void 0, void 0, function* () {
                this.awsSDB = {
                    'Action': 'DomainMetadata',
                    'DomainName': this.dbname,
                    'Version': '2009-04-15'
                };
                try {
                    cb(yield this.sendSDB(yield this.createOpts()));
                }
                catch (err) {
                    rerr(err);
                }
            }));
        });
        this.sendSDB = (params) => {
            return new Promise((ret, err) => {
                let jsonRet;
                jsonRet = {};
                var sign = aws2.sign({
                    'service': 'sdb',
                    'port': 443,
                    'path': '/',
                    'body': params
                });
                //console.log(sign);
                const req = https.request(sign, (res) => {
                    //    console.log('statusCode:', res.statusCode);
                    jsonRet.statusCode = res.statusCode;
                    jsonRet.headers = res.headers;
                    //  console.log('headers:', res.headers);
                    //  console.log(res);
                    res.on('data', (d) => {
                        xmltojson.parseString(d.toString(), (err, result) => {
                            if (err) {
                                jsonRet.error = err;
                                err(jsonRet);
                            }
                            jsonRet.body = result;
                            ret(jsonRet);
                        });
                    });
                });
                req.write(sign['body']);
                req.on('error', (e) => {
                    jsonRet.error = e.message;
                    err(jsonRet);
                });
                req.end();
            });
        };
        this.createOpts = () => {
            return new Promise((ret) => {
                ret(Object.keys(this.awsSDB).sort().map((key) => {
                    return querystring.escape(key) + '=' + querystring.escape(this.awsSDB[key]);
                }).join('&'));
            });
        };
        this.dbname = db;
        this.awsCreds = options;
        this.awsSDB = {};
    }
}
exports.AWS_S3_SBD = AWS_S3_SBD;
//# sourceMappingURL=awss3sbd.js.map