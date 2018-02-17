import * as https from 'https'

export class httpPromise {

private params: object
private body: any;

constructor(parmas?: object,body?:any) {
  this.params = parmas;
  this.body = body;

}

set setParams(params: object){
  this.params = params;
}

get getParams(){
  return this.params;
}

set setBody(body: any){
  this.body = body;
}

get getBody(){
  return this.body;
}

public send  = (params?: object, body?:any) => {
  return new Promise<any>(async (ret, err) => {
    if(params !== undefined){
      this.params = params;
    }
    if(body !== undefined){
      this.body = body;
    }

    let jsonRet: any;
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

    if(this.body !== undefined){
      req.write(this.body);
    }

    req.on('error', (e) => {
      jsonRet.error = e;
      err(jsonRet);
    });
    req.end();
  });
}

}
