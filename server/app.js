/**
 * The Server Can be configured and created here...
 *
 * You can find the JSON Data file here in the Data module. Feel free to implement a framework if needed.
 */

const express = require('express');

// setup the express app
const app = express();
const PORT = 8888;

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
    const sql = 'SELECT * FROM message';
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
    const sql = "SELECT * FROM source WHERE deleted_at ISNULL OR deleted_at =''";
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

// get source details
app.get('/source/:id/details', (req, res) => {
    const sql = 'SELECT * FROM message WHERE source_id = ?';
    const params = [req.params.id];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({'error': err.message});
            return;
        }

        const messageStatusCount = {
            error: rows.reduce((acc, cur) => cur.status === 'error' ? ++acc : acc, 0),
            enqueued: rows.reduce((acc, cur) => cur.status === 'enqueued' ? ++acc : acc, 0),
            finished: rows.reduce((acc, cur) => cur.status === 'finished' ? ++acc : acc, 0),
            processing: rows.reduce((acc, cur) => cur.status === 'processing' ? ++acc : acc, 0)
        };

        res.json({
            'message': 'success',
            'data': messageStatusCount
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
});

// get messages from a single source
app.get('/source/:id/message', (req, res) => {
    const pageSize = parseInt(req.query.per_page);
    const pageNo = parseInt(req.query.page);

    if (pageNo <= 0) {
        const response = {
            success: false,
            message: 'Invalid Page Number'
        };
        return res.status(200).json(response);
    } else {
        const sql = 'SELECT * FROM message WHERE source_id = ? LIMIT ? OFFSET ?';
        const params = [req.params.id, pageSize, pageNo];

        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({'error': err.message});
                return;
            }

            const response = {
                success: true,
                data: rows
            };

            return res.status(200).json(response);
        });
    }
});

// default response for any other request
app.use(function (req, res) {
    res.status(404);
});


app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});

