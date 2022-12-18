const pg = require("../config/config");

const getUsers = (req, res) => {
  pg.pool.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    }
    res.status(200).json(result.rows);
  });
};

const getUsersByUsername = (req, res) => {
  const searchName = req.query.name;
  pg.pool.query(
    "SELECT * FROM users WHERE username = $1",
    [searchName],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(200).json(results.rows);
    }
  );
};

var count = 0;
const existingUser = (username, email) => {
  pg.pool.query(
    "SELECT * from users WHERE username = $1 or email = $2",
    [username, email],
    (err, res) => {
      if (err) throw err;
      return res.rows;
    }
  );
};

module.exports = { getUsers, getUsersByUsername, existingUser };
