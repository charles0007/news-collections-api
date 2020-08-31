const express = require("express");
require("dotenv").config();
var cors = require('cors');

// const hsts = require('hsts');
var helmet = require('helmet');

const app = express();

// const sixtyDaysInSeconds = 5184000


const get_news = require('./routes/get_news');
const get = require('./routes/get');
const refresh_news = require('./routes/refresh_news');
const notify = require('./routes/notify');
const getImages = require('./routes/getImages');




// app.disable('x-powered-by');

// app.use(helmet());
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});


const logger=(req,res,next)=>{
  // console.log(JSON.stringify(req))
  //  console.log(`${req.protocol}://${req.get['host']}${req.originlUrl}`);
   next();
}

app.use(logger);


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/',get);//
app.use('/get_news',get_news);//
app.use('/refresh_news',refresh_news);//
app.use('/notify',notify);//
app.use('/getImages',getImages);//








app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function errorHandler(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).json({ error: res.locals.message });
});

const port = process.env.PORT || 91;

app.listen(port, () => console.log(`Server running on port ${port}`));
