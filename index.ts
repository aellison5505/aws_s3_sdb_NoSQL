import { AWS_S3_SBD } from './awss3sbd';

const main = async () => {

  try {

    let db = new AWS_S3_SBD('new_db', {});

    let ret = await db.openDB();
    console.log(JSON.stringify(ret));

  } catch (err) {

    console.log("error: " + err);

  }

};main();
