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
const aws2 = require("aws-sign-v2");
const xmltojson = require("xml2js");
class SBD {
    constructor(options) {
        this.options = options;
        this.create = (db) => {
            return new Promise((cb, rerr) => __awaiter(this, void 0, void 0, function* () {
                this.dbname = db;
                this.awsSDB = {
                    'Action': 'CreateDomain',
                    'DomainName': this.dbname,
                    'Version': '2009-04-15'
                };
                try {
                    cb(yield this.sendSDB());
                }
                catch (err) {
                    rerr(err);
                }
            }));
        };
        this.ListDomains = () => {
            return new Promise((cb, rerr) => __awaiter(this, void 0, void 0, function* () {
                this.awsSDB = {
                    'Action': 'ListDomains',
                    //    'DomainName': this.dbname,
                    'Version': '2009-04-15'
                };
                try {
                    cb(yield this.sendSDB());
                }
                catch (err) {
                    rerr(err);
                }
            }));
        };
        this.destroy = (NameDB) => {
            return new Promise((cb, rerr) => __awaiter(this, void 0, void 0, function* () {
                if (this.awsSDB !== NameDB) {
                    rerr('DB Names Don\'t Match');
                }
                this.awsSDB = {
                    'Action': 'DeleteDomain',
                    'DomainName': this.dbname,
                    'Version': '2009-04-15'
                };
                try {
                    cb(yield this.sendSDB());
                }
                catch (err) {
                    rerr(err);
                }
            }));
        };
        this.open = (db) => {
            return new Promise((cb, rerr) => __awaiter(this, void 0, void 0, function* () {
                this.dbname = db;
                this.awsSDB = {
                    'Action': 'DomainMetadata',
                    'DomainName': this.dbname,
                    'Version': '2009-04-15'
                };
                try {
                    cb(yield this.sendSDB());
                }
                catch (err) {
                    rerr(err);
                }
            }));
        };
        this.get = (item) => {
            return new Promise((cb, rerr) => __awaiter(this, void 0, void 0, function* () {
                this.awsSDB = {
                    'Action': 'GetAttributes',
                    'DomainName': this.dbname,
                    'Version': '2009-04-15',
                    'ItemName': item
                };
                try {
                    cb(yield this.sendSDB());
                }
                catch (err) {
                    rerr(err);
                }
            }));
        };
        this.select = (expression) => {
            return new Promise((cb, rerr) => __awaiter(this, void 0, void 0, function* () {
                this.awsSDB = {
                    'Action': 'Select',
                    'Version': '2009-04-15',
                    'SelectExpression': expression
                };
                try {
                    cb(yield this.sendSDB());
                }
                catch (err) {
                    rerr(err);
                }
            }));
        };
        this.delete = (item) => {
            return new Promise((cb, rerr) => {
                try {
                    let count = 0;
                    let internal = {
                        add: (name) => {
                            return new Promise((cb, rerr) => {
                                count = count + 1;
                                this.awsSDB['Attribute.' + count + '.Name'] = name;
                                //    this.awsSDB['Attribute.' + count + '.Value'] = value;
                                //      this.awsSDB['Attribute.' + count + '.Replace'] = 'true';
                                //console.log(this.awsSDB);
                                cb(null);
                            });
                        },
                        end: () => __awaiter(this, void 0, void 0, function* () {
                            return new Promise((cb, rerr) => __awaiter(this, void 0, void 0, function* () {
                                console.log('done');
                                cb(yield this.sendSDB());
                                //  cb("done");
                            }));
                        })
                    };
                    this.awsSDB = {
                        'Action': 'DeleteAttributes',
                        'DomainName': this.dbname,
                        'Version': '2009-04-15',
                        'ItemName': item
                    };
                    //  console.log(this.awsSDB);
                    cb(internal);
                }
                catch (err) {
                    rerr(err);
                }
            });
        };
        this.put = (item) => {
            return new Promise((cb, rerr) => {
                try {
                    let count = 0;
                    let internal = {
                        add: (name, value) => {
                            return new Promise((cb, rerr) => {
                                count = count + 1;
                                this.awsSDB['Attribute.' + count + '.Name'] = name;
                                this.awsSDB['Attribute.' + count + '.Value'] = value;
                                this.awsSDB['Attribute.' + count + '.Replace'] = 'true';
                                //console.log(this.awsSDB);
                                cb(null);
                            });
                        },
                        end: () => __awaiter(this, void 0, void 0, function* () {
                            return new Promise((cb, rerr) => __awaiter(this, void 0, void 0, function* () {
                                console.log('done');
                                cb(yield this.sendSDB());
                                //  cb("done");
                            }));
                        })
                    };
                    this.awsSDB = {
                        'Action': 'PutAttributes',
                        'DomainName': this.dbname,
                        'Version': '2009-04-15',
                        'ItemName': item
                    };
                    //  console.log(this.awsSDB);
                    cb(internal);
                }
                catch (err) {
                    rerr(err);
                }
            });
        };
        this.sendSDB = () => {
            return new Promise((ret, err) => __awaiter(this, void 0, void 0, function* () {
                let params = yield this.createOpts();
                let jsonRet;
                jsonRet = {};
                var sign = aws2.sign({
                    'service': 'sdb',
                    'port': 443,
                    'path': '/',
                    'body': params
                });
                //  console.log(sign);
                console.log(sign);
                const req = https.request(sign, (res) => {
                    //    console.log('statusCode:', res.statusCode);
                    jsonRet.statusCode = res.statusCode;
                    jsonRet.headers = res.headers;
                    let data = '';
                    //  console.log('headers:', res.headers);
                    //  console.log(res);
                    res.on('data', (d) => {
                        data += d;
                    });
                    res.on('end', () => {
                        xmltojson.parseString(data.toString(), { explicitArray: false, ignoreAttrs: true }, (err, result) => {
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
                    jsonRet.error = e;
                    err(jsonRet);
                });
                req.end();
            }));
        };
        this.createOpts = () => {
            return new Promise((ret) => {
                ret(Object.keys(this.awsSDB).sort().map((key) => {
                    return key + '=' + this.awsSDB[key];
                }).join('&'));
            });
        };
        this.dbname = '';
        this.awsCreds = options;
        this.awsSDB = {};
    }
}
exports.SBD = SBD;
//# sourceMappingURL=sdb.js.map