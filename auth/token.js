const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

const generateAccessToken = async (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
};

module.exports = { generateAccessToken };
