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
const sdb_1 = require("./sdb");
const main = () => __awaiter(this, void 0, void 0, function* () {
    try {
        let db = new sdb_1.SBD('new_db', {});
        /*
            let ret = await db.put('test1');
          //  console.log(ret.body.DomainMetadata[0].Timestamp[0]);
              await ret.add('testAt', 123);
              await ret.add('test2', 'myhat');
              let end = await ret.end();
              console.log(end.body);
        */
        let ret = yield db.select('select * from new_db');
        //console.log(ret.body.GetAttributesResponse.GetAttributesResult);
        console.log(JSON.stringify(ret.body));
    }
    catch (err) {
        console.log("error: " + err.error);
    }
});
main();
//# sourceMappingURL=index.js.map