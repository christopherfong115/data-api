const Pool = require("pg").Pool;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
//process.env.TOKEN_SECRET

const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "api",
  password: "password",
  port: 8080,
});
