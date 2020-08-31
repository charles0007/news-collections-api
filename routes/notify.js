
const express = require('express');
const router = express.Router();
const { poolPromise } = require('../private/db_config');
require("dotenv").config();
var xssFilters = require('xss-filters');

var fs = require('fs');

router.post('/', async function (req, res) {
    let date = new Date().toLocaleDateString("en-US");
    try {
        const params = req.query;
        const body = req.body;
        const NativeId = xssFilters.inHTMLData(body.NativeId);


        const response = {};

        const result = await poolPromise;
        // const result = await pool.request();
        const records = await result.query(`select count(*) from news where NativeId>${NativeId}`);
        const notificationValue = await records.rows[0].count;
        // await result.release();
        error = false;
        return res.send({notificationValue, error,rec:records.rows,NativeId});









    } catch (er) {

        fs.appendFile('error/notify_news_' + date.replace(/\//g, "-") + '.txt',
            '--------------------' + JSON.stringify(er)
            + '--------------------', function (err) {
            });
        console.log(er);
        return res.send({ notificationValue: 0, error: true ,error:er.message,body:req.body});
    }

});


module.exports = router;
