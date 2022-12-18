const pg = require("../config/config");
const { generateAccessToken } = require("../auth/token");
const bcrypt = require("bcrypt");
const dbQuery = require("../getMethods/queries");

const addUserToDB = async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;
  const token = await generateAccessToken(username);
  const hashedPass = await bcrypt.hash(password, 10);
  console.log(token);

  if (!username || !email || !password || !firstname || !lastname) {
    res.status(402).send("missing fields");
  }
  // console.log(db.existingUser(username, email));
  // if (!db.existingUser(username, email)) {
  //   res.status(408).status({ error: "user already exists!" });
  // }
  // dbPost.addUserToDB(username, email, hashedPass, firstname, lastname, token);
  const users = [];
  users.push({
    username: username,
    email: email,
    password: hashedPass,
    firstname: firstname,
    lastname: lastname,
    token: token,
  });
  const find = dbQuery.existingUser(username, email);
  console.log(find);
  pg.pool.query(
    `INSERT INTO users (username, firstname, lastname, hashpassword, status, accesslevel, statusid, accessid, email, prevtoken) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      username,
      firstname,
      lastname,
      hashedPass,
      "active",
      "basic",
      61,
      31,
      email,
      token,
    ],
    (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send({
          success: true,
          status: "User Registered",
          usersInSession: users,
        });
      }
    }
  );
};

module.exports = { addUserToDB };
