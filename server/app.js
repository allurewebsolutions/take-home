/**
 * The Server Can be configured and created here...
 *
 * You can find the JSON Data file here in the Data module. Feel free to impliment a framework if needed.
 */

const express = require('express');

// setup the express app
const app = express();
const PORT = 8888;
// const port = process.env.PORT || 8888;

// setup connection to sqlite database
const db = require('./database.js');

// enable parsing for post data
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// enable hashing
const generateID = require('uniqid');

// import moment
const moment = require('moment');

// root endpoint
app.get('/', (req, res) => {
    res.json({'message': 'Ok'});
});

// get all messages
app.get('/message', (req, res) => {
    const sql = 'SELECT * FROM message LIMIT 10';
    const params = [];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            'message': 'success',
            'data': rows
        })
    });
});

// get message by id
app.get('/message/:mid', (req, res) => {
    const sql = 'SELECT * FROM message WHERE id = ?';
    const params = [req.params.mid];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            'message': 'success',
            'data': rows
        })
    });
});

// get all sources
app.get('/source', (req, res) => {
    const sql = 'SELECT * FROM source';
    const params = [];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            'message': 'success',
            'data': rows
        })
    });
});

// get source by id
app.get('/source/:id', (req, res) => {
    const sql = 'SELECT * FROM source WHERE id = ?';
    const params = [req.params.id];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            'message': 'success',
            'data': rows
        })
    });
});

// create new source
app.post('/source/add/', (req, res) => {
    let errors = [];

    if (!req.body.name) errors.push('No name specified');
    if (!req.body.environment) errors.push('No environment specified');
    if (!req.body.encoding) errors.push('No encoding specified');
    if (errors.length) {
        res.status(400).json({'error': errors.join(', ')});
        return;
    }

    const data = {
        id: generateID(),
        name: req.body.name,
        environment: req.body.environment,
        encoding: req.body.encoding,
        created_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss').toString(),
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss').toString(),
        deleted_at: null
    };

    const sql = 'INSERT INTO source (id, name, environment, encoding, created_at, updated_at, deleted_at) VALUES (?,?,?,?,?,?,?)';
    const params = [data.id, data.name, data.environment, data.encoding, data.created_at, data.updated_at, data.deleted_at];

    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            'message': 'success',
            'data': data,
            'id': data.id
        })
    });
});

// update source information
app.patch('/source/:id/:action', (req, res) => {
    const data = {
        name: req.body.name,
        environment: req.body.environment,
        encoding: req.body.encoding,
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss').toString(),
        deleted_at: (req.params.action === 'delete')
            ? moment(new Date()).format('YYYY-MM-DD HH:mm:ss').toString()
            : ((req.params.action === 'restore') ? '' : null)
    };

    // TODO: check if source is already deleted and prevent action from happening
    if (req.params.action === 'update') {
        db.run(
                `UPDATE source
                 set name        = COALESCE(?, name),
                     environment = COALESCE(?, environment),
                     encoding    = COALESCE(?, encoding),
                     updated_at  = COALESCE(?, updated_at),
                     deleted_at  = COALESCE(?, deleted_at)
                 WHERE id = ?`,
            [data.name, data.environment, data.encoding, data.updated_at, data.deleted_at, req.params.id],
            function (err, result) {
                if (err) {
                    res.status(400).json({'error': res.message});
                    return;
                }
                res.json({
                    message: 'success',
                    data: data,
                    changes: this.changes
                })
            });
    }
});

// get messages from a single source
app.get('/source/:id/message', (req, res) => {
    const sql = 'SELECT * FROM message WHERE source_id = ? LIMIT 10';
    const params = [req.params.id];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            'message': 'success',
            'data': rows
        })
    });
});

// default response for any other request
app.use(function (req, res) {
    res.status(404);
});


app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});

