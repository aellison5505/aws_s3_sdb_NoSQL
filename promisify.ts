


export class promisify {

    constructor(func:Function){
    return (...args:any[]) =>
      new Promise((resolve, reject) => {
        const callback = (err:any, data:any) => err ? reject(err) : resolve(data)

        func.apply(this, [...args, callback])
      })
  }
}
