const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(405).send("Unauthorized Request");
  }
  const token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ error: "token does not exist or no token provided" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ error: err });
    }

    req.user = user;

    next();
  });
};

module.exports = { authenticateToken };
