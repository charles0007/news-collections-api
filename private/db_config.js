require("dotenv").config();
const fs = require('fs');
const sql = require('mssql');
const { Pool, Client } = require('pg');

let user = process.env.db_user;//fs.readFileSync('./private/db_user.pem', 'utf8');
let password = process.env.db_pass;//= fs.readFileSync('./private/db_pass.pem', 'utf8');
let server = process.env.db_server;//= fs.readFileSync('./private/db_server.pem', 'utf8');
let database = process.env.db_name;//= fs.readFileSync('./private/db_name.pem', 'utf8');
var config = {
  user: user,
  password: password,
  server: server,
  database: database
};

var con = process.env.con;
var configProgres = {
  user: user,
  password: password,
  host: server,
  database: database,
  // ssl:true,
  max:20, //max connection
  // connectionTimeoutMillis:0,
  // idleTimeoutMillis:0 //destroy query after being idle
};

const msqlPoolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))


const poolPromise = new Pool(configProgres);
  // .connect()
  // .then(pool => {
  //   console.log('Connected to PostGress')
  //   return pool;
  //   // Database Port: 5432
  // })
  // .catch(err => { console.log('Database Connection Failed! Bad Config: ', err); return err.message; })

// const pool = new Pool({
//   host: 'localhost',
//   user: 'database-user',
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// })

// async/await - check out a client
// (async () => {
//   const postgresClient = await pool.connect()
//   return client;
//   try {
//     const res = await client.query('SELECT * FROM users WHERE id = $1', [1])
//     console.log(res.rows[0])
//   } finally {
//     // Make sure to release the client before any error handling,
//     // just in case the error handling itself throws an error.
//     client.release()
//   }
// })().catch(err => console.log(err.stack))


module.exports = {
  sql, poolPromise, msqlPoolPromise
}