const sqlite3 = require('sqlite3').verbose();

const DB_SOURCE = './server/db.sqlite';

const db = new sqlite3.Database(DB_SOURCE, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        // cannot open database
        console.error(err.message);
        throw err
    } else {
        console.log('Connected to the SQLite database.');
    }
});

module.exports = db;
