const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "api",
  password: "password",
  port: 5432,
});

const findUserByName = (req, res) => {
  const name = req.query.name;
  const auth = req.headers.authorization;
  // pool.query('SELECT * FROM users WHERE firstname=$1', [name], (err, result) => {
  //     if (err) {
  //         console.log(err);
  //         throw err;
  //     }
  //     res.status(200).json(result.rows);
  // }
};
