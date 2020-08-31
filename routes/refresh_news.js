
const express = require('express');
const router = express.Router();
const { poolPromise } = require('../private/db_config');
require("dotenv").config();
var xssFilters = require('xss-filters');

var fs = require('fs');

router.post('/', async function (req, res) {
    let date = new Date().toLocaleDateString("en-US");
    try {
        // let date = new Date().toLocaleDateString("en-US");
        console.log("refresh");
        let lastUpdate = new Date().toLocaleDateString("en-US");
        const params = req.query;
        const body = req.body;
        const NativeId = xssFilters.inHTMLData(body.NativeId);


        const response = {};

        const result = await poolPromise;
        // const result = await pool.request();
        const records = await result.query(`select * from news where NativeId>${NativeId} order by NativeId desc limit 1`);
        const data = await records.rows;
        // await result.release();
        return res.send({data,NativeId});









    } catch (er) {

        fs.appendFile('error/refresh_news_' + date.replace(/\//g, "-") + '.txt',
            '--------------------' + JSON.stringify(er)
            + '--------------------', function (err) {
            });
            return res.status(400).send({error:er.message,body:req.body});
    }

});

var validateData = (data) => {
    const JoiSchema = Joi.object({
        reference: Joi.string().required(),
        accountNumber: Joi.number().min(10).max(12).required(),
        mobileNumber: Joi.number().min(5).optional(),
        name: Joi.string().optional(),
    }).options({ abortEarly: true });

    return JoiSchema.validate(data)
}

module.exports = router;
