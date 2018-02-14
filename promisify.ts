
export  function promisify(func:any){
    return (...args:any[]) =>
      new Promise<any>((resolve, reject) => {
        try{
        const callback = (err:any, data:any) => err ? reject(err) : resolve(data)

        func.apply(this, [...args, callback])
      }catch(e){
         reject(e)
       }
      })
  }
export  function http_promisify(func:any){
      return (...args:any[]) =>
        new Promise<any>((resolve, reject) => {
          try{
          const callback = (data:any) => resolve(data)
            func.apply(this, [...args, callback])
          }catch(e){
             reject(e)
           }
        })
    }
