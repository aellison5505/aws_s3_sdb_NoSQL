import * as https from 'https'
import * as aws2 from 'aws-sign-v2'
import * as xmltojson from 'xml2js'
import * as prom from './promisify'
import {httpPromise} from './httpsPromise'

export class SBD {

  dbname: string;
  awsCreds: object;
  awsSDB: any;

  constructor(private options?: any) {
    this.dbname = '';
    this.awsCreds = options;
    this.awsSDB = {};

  }

  public create = (db: string) => {
    return new Promise<any>(async (cb, rerr) => {
      this.dbname = db;
      this.awsSDB = {
        'Action': 'CreateDomain',
        'DomainName': this.dbname,
        'Version': '2009-04-15'
      };

      try {

        cb(await this.sendSDB());

      } catch (err) {
        rerr(err);
      }
    }
    )
  };

  public ListDomains = () => {
    return new Promise<any>(async (cb, rerr) => {
      this.awsSDB = {
        'Action': 'ListDomains',
    //    'DomainName': this.dbname,
        'Version': '2009-04-15'
      };

      try {
        let params = await this.createParams()
      //  cb(params);
      //  cb(await this.sendSDB());
        let https = new httpPromise()
        let body = params.body;
        delete params.body;
        cb(await https.send(params, body));

      } catch (err) {
        rerr(err);
      }
    }
    )
  };

  public destroy = (NameDB:string) => {
    return new Promise<any>(async (cb, rerr) => {
      if (this.awsSDB !== NameDB){
        rerr('DB Names Don\'t Match');
      }
      this.awsSDB = {
        'Action': 'DeleteDomain',
        'DomainName': this.dbname,
        'Version': '2009-04-15'
      };

      try {

        cb(await this.sendSDB());

      } catch (err) {
        rerr(err);
      }
    }
    )
  };


  public open = (db: string) => {
    return new Promise<any>(async (cb, rerr) => {
      this.dbname = db;
      this.awsSDB = {
        'Action': 'DomainMetadata',
        'DomainName': this.dbname,
        'Version': '2009-04-15'
      };

      try {

        cb(await this.sendSDB());

      } catch (err) {
        rerr(err);
      }
    }
    )
  };

  public get = (item:string) => {
    return new Promise<any>(async (cb, rerr) => {
      this.awsSDB = {
        'Action': 'GetAttributes',
        'DomainName': this.dbname,
        'Version': '2009-04-15',
        'ItemName':item
      };

      try {

        cb(await this.sendSDB());

      } catch (err) {
        rerr(err);
      }
    }
    )
  };

  public select = (expression:string) => {
    return new Promise<any>(async (cb, rerr) => {
      this.awsSDB = {
        'Action': 'Select',
        'Version': '2009-04-15',
        'SelectExpression':expression
      };

      try {

        cb(await this.sendSDB());

      } catch (err) {
        rerr(err);
      }
    }
    )
  };

  public delete = (item: string) => {
    return new Promise<any>((cb, rerr) => {
      try {
        let count = 0;
        let internal = {
          add: (name: string) => {
            return new Promise<any>((cb, rerr) => {
              count = count + 1;
              this.awsSDB['Attribute.' + count + '.Name'] = name;
          //    this.awsSDB['Attribute.' + count + '.Value'] = value;
        //      this.awsSDB['Attribute.' + count + '.Replace'] = 'true';
              //console.log(this.awsSDB);
              cb(null);
            }
            )
          },

          end: async () => {
            return new Promise<any>(async (cb, rerr) => {
              console.log('done');
              cb(await this.sendSDB());

              //  cb("done");
            });
          }
        }
        this.awsSDB = {
          'Action': 'DeleteAttributes',
          'DomainName': this.dbname,
          'Version': '2009-04-15',
          'ItemName': item
        };
      //  console.log(this.awsSDB);
        cb(internal);

      } catch (err) {
        rerr(err);
      }
    }
    )
  };


  public put = (item: string) => {
    return new Promise<any>((cb, rerr) => {
      try {
        let count = 0;
        let internal = {
          add: (name: string, value: string) => {
            return new Promise<any>((cb, rerr) => {
              count = count + 1;
              this.awsSDB['Attribute.' + count + '.Name'] = name;
              this.awsSDB['Attribute.' + count + '.Value'] = value;
              this.awsSDB['Attribute.' + count + '.Replace'] = 'true';
              //console.log(this.awsSDB);
              cb(null);
            }
            )
          },

          end: async () => {
            return new Promise<any>(async (cb, rerr) => {
              console.log('done');
              cb(await this.sendSDB());

              //  cb("done");
            });
          }
        }
        this.awsSDB = {
          'Action': 'PutAttributes',
          'DomainName': this.dbname,
          'Version': '2009-04-15',
          'ItemName': item
        };
      //  console.log(this.awsSDB);
        cb(internal);

      } catch (err) {
        rerr(err);
      }
    }
    )
  };


  private sendSDB  = () => {
    return new Promise<any>(async (ret, err) => {
      let params = await this.createOpts()
      let jsonRet: any;
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
    });
  }

  private createParams (){
    return new Promise<any>(async (cb, rerr) => {
    try{
    let params = await this.createOpts();
    var sign = aws2.sign ({
      'service': 'sdb',
      'port': 443,
      'path': '/',
      'body': params
    });
    cb(sign);
  }catch(err){
    rerr(err);
  }

  });
  }

  private createOpts = () => {
    return new Promise<string>((ret) => {
    ret(Object.keys(this.awsSDB).sort().map((key) => {
        return key + '=' +this.awsSDB[key];
      }).join('&'));
  });
  }

}
