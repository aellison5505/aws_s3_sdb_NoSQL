import { AWS_S3_SBD } from './awss3sbd';

const main = async () => {

  try {

    let db = new AWS_S3_SBD('new_db', {});

    let ret = await db.put('test1');
  //  console.log(ret.body.DomainMetadata[0].Timestamp[0]);
      await ret.add('testAt', 123);
      await ret.add('test2', 'myhat');
      let end = await ret.end();
      console.log(end.body);
  } catch (err) {

    console.log("error: " + err);

  }

};main();
