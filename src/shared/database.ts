import { MongoClient, Db } from 'mongodb';
import logger from './Logger';

const DB_USER = process.env.RESUMATOR_WEB_DB_USER;
const DB_PASS = process.env.RESUMATOR_WEB_DB_PASS;

const url = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.3d31r.mongodb.net/resumator?retryWrites=true&w=majority`;
export let database: Db;

MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
    if (err) {
        logger.error(err);
        logger.error(`Could not connect to the database ${url}`);
        throw err;
    } else {
        logger.info(
            'Connected to database @cluster0.3d31r.mongodb.net/resumator'
        );
        database = db.db('resumator');
    }
});
