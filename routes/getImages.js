
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
        // res.send(result);
        // const result = await pool.request();
        console.log("getimages");

        const techcrunch_records = await result.query(`select * from news where website='techcrunch' and image is not null  order by NativeId desc limit 1`);
        const washingtonpost_records = await result.query(`select * from news where website='washingtonpost' and image is not null order by NativeId desc limit 1`);
        const cnn_records = await result.query(`select * from news where website='cnn' and image is not null order by NativeId desc limit 1`);
        // await result.release();
        let data = [];
        let techcrunch = {};
        let washingtonpost = {};
        let cnn = {};
        if(techcrunch_records.rows.length>0){
        techcrunch = await techcrunch_records.rows[0];
        await data.push(techcrunch);
        }
        if(washingtonpost_records.rows.length>0){
        washingtonpost = await washingtonpost_records.rows[0];
        await data.push(washingtonpost);
        }
        if(cnn_records.rows.length>0){
        cnn = await cnn_records.rows[0];
        await data.push(cnn);
        }
        
        
        
        
        return res.send({ status: true, data });












    } catch (er) {

        fs.appendFile('error/getimages_' + date.replace(/\//g, "-") + '.txt',
            '--------------------' + JSON.stringify(er)
            + '--------------------', function (err) {
            });
        console.log(er);
        res.status(400);
        return res.send({error:er.message,body:req.body});
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
