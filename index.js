const e = require("express");
const express = require("express");
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'iot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0

});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/location', express.static(path.join(__dirname, 'location')));

app.get('/locations', (req, res) => {
    pool.query('SELECT * FROM location', (error, results) => {
        if (error) {
            console.error(error);
            res.send(500).send('Error retrieving data from database');
        } else {
            res.json(results);
        }
    });
});

app.get('/location/json/:id', (req, res) => {
    var sql = 'SELECT * FROM location WHERE location_id = ' + req.params['id']
    pool.query(sql, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error retrieving data from database');
        } else {
            res.json(results);
        }
    });
});

app.post('/locations', (req, res) => {
    const { location_name } = req.body;
    const sql = 'INSERT INTO location (location_name) VALUES (?)';
    pool.query(sql, [location_name], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ id: results.insertId });
    });
});

app.post('/locations', (req, res) => {
    const {location_id} = req.body;
    let sql = 'DELETE FROM location WHERE location_id = '+location_id;
    pool.query(sql, [location_name], (error, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: results.insertId });
    });
});







app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
