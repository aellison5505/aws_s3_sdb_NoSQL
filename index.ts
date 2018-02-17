import { SBD } from './sdb';

const main = async () => {

  try {

    let db = new SBD();
//  let opn = await db.open('myDomain')
//  console.log(JSON.stringify(opn.body));
  let ret = await db.ListDomains();
  //  console.log(ret.body.DomainMetadata[0].Timestamp[0]);
  //    await ret.add('testAt');
  //    await ret.add('test2', 'myhat');
  //    let end = await ret.end();
     console.log(JSON.stringify(ret));

  //    let sel = await db.select('select * from *');
      //console.log(ret.body.GetAttributesResponse.GetAttributesResult);
  //    console.log(JSON.stringify(sel.body));
  } catch (err) {

    console.log("error: " + err);

  }

};main();
