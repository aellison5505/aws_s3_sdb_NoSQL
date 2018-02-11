import * as https from 'https'
import * as aws2 from 'aws2'
import * as querystring from 'querystring'
import * as xmltojson from 'xml2js'

export class AWS_S3_SBD {

  dbname: string;
  awsCreds: object;
  awsSDB: any;

  constructor(private db: string, private options: any) {
    this.dbname = db;
    this.awsCreds = options;
    this.awsSDB = {};

  }

  public createDB = async () => {
    return new Promise<any>(async (cb,rerr) => {
      this.awsSDB = {
        'Action': 'CreateDomain',
        'DomainName': this.dbname,
        'Version': '2009-04-15'
      };

      try {

        cb(await this.sendSDB(await this.createOpts()));

      } catch (err) {
        rerr(err);
      }
    }
    )
  };

  public openDB = async () => {
    return new Promise<any>(async (cb,rerr) => {
      this.awsSDB = {
        'Action': 'DomainMetadata',
        'DomainName': this.dbname,
        'Version': '2009-04-15'
      };

      try {

        cb(await this.sendSDB(await this.createOpts()));

      } catch (err) {
        rerr(err);
      }
    }
    )
  };

  private sendSDB = (params: string) => {
    return new Promise<any>((ret, err) => {
      let jsonRet:any;
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
            if(err){
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
  }

  private createOpts = () => {
    return new Promise<string>((ret) => {
      ret(Object.keys(this.awsSDB).sort().map((key) => {
        return querystring.escape(key) + '=' + querystring.escape(this.awsSDB[key])
      }).join('&'));
    });
  }

}
