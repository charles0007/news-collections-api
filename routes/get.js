
const express = require('express');
const router = express.Router();
const { poolPromise } = require('../private/db_config');
require("dotenv").config();
var xssFilters = require('xss-filters');

var fs = require('fs');

router.post('/', async function (req, res) {
    let date = new Date().toLocaleDateString("en-US");
    try {


        res.send({ status: true, val: "welcom" });

        return "welcome";


    } catch (er) {

        fs.appendFile('error/get_news_' + date.replace(/\//g, "-") + '.txt',
            '--------------------' + JSON.stringify(er)
            + '--------------------', function (err) {
            });
        console.log(er)
    }

});



module.exports = router;
