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
const awss3sbd_1 = require("./awss3sbd");
const main = () => __awaiter(this, void 0, void 0, function* () {
    try {
        let db = new awss3sbd_1.AWS_S3_SBD('new_db', {});
        let ret = yield db.put('test1');
        //  console.log(ret.body.DomainMetadata[0].Timestamp[0]);
        yield ret.add('testAt', 123);
        yield ret.add('test2', 'myhat');
        let end = yield ret.end();
        console.log(end.body);
    }
    catch (err) {
        console.log("error: " + err);
    }
});
main();
//# sourceMappingURL=index.js.map