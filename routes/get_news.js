
const express = require('express');
const router = express.Router();
const { poolPromise } = require('../private/db_config');
require("dotenv").config();
var xssFilters = require('xss-filters');

var fs = require('fs');

router.post('/', async function (req, res) {
    let date = new Date().toLocaleDateString("en-US");
    try {
        console.log("getnew here");
        let lastUpdate = new Date().toLocaleDateString("en-US");
        const params = req.query;
        const body = req.body;
        const NativeId = xssFilters.inHTMLData(body.NativeId);
        const new_data = body.new_data;

        const response = {};

        const result = await poolPromise;
        // const result = await pool.request();
        console.log("getnewssss");
        if (new_data) {
            const records = await result.query(`select * from news order by NativeId desc limit 1`);
            const data = await records.rows;
            console.log({ status: true, more: data.length > 0 ? true : false });
            // await result.release();
            return res.send({ status: true, more: data.length > 0 ? true : false, data });
        } else {
            const records = await result.query(`select * from news where NativeId<${NativeId} order by NativeId desc limit 1`);
            const data = await records.rows;
            console.log({ status: true, more: data.length > 0 ? true : false });
            // await result.release();
            return res.send({ status: true, more: data.length > 0 ? true : false, data,NativeId });
        }

    } catch (er) {

        fs.appendFile('error/get_news_' + date.replace(/\//g, "-") + '.txt',
            '--------------------' + JSON.stringify(er)
            + '--------------------', function (err) {
            });

        return res.send({ status: false, more: false, data:[], error: er.message,body:req.body });
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
