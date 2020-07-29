import { MongoClient, Db } from "mongodb";

const DB_USER = process.env.RESUMATOR_WEB_DB_USER;
const DB_PASS = process.env.RESUMATOR_WEB_DB_PASS;
const url = `mongodb://${DB_USER}:${DB_PASS}@ds339648.mlab.com:39648/resumator`;
export let database: Db;

MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
    if (err) throw err;
    database = db.db("resumator");
});
