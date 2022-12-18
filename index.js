const express = require("express");
const {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
} = require("./auth/token");
const bcrypt = require("bcrypt");
const app = express();
const port = 8080;
const db = require("./getMethods/queries");
const dbPost = require("./postMethods/postQueries");
const pgsql = require("./config/config");

const users = [];

const refreshTokens = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});

app.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});

// app.get("/users:id", (req, res) => {
//   const userid = parseInt(req.params.id);
//   console.log(userid);
//   res.status(200).send({ userid: `the id of the user is: ${userid}` });
// });

// app.get("/users/:feature/:id", (req, res) => {
//   const feature = String(req.params.feature);
//   const userid = parseInt(req.params.id);
//   console.log(userid);
//   console.log(feature);
//   res.status(200).send({
//     userid: `the id of the user is ${userid}`,
//     feature: `the feature of the user is ${feature}`,
//   });
// });

app.post("/api/refreshToken", async (req, res) => {
  const token = req.body.token;
  if (!refreshTokens.includes(token)) {
    res.status(404).send("invalid token");
  }

  refreshTokens = refreshTokens.filter((rfDel) => rfDel != token);

  const newAccessToken = await generateAccessToken(req.body.name);
  const newRefreshToken = await generateRefreshToken(req.body.name);
  res
    .status(200)
    .send({ NewAccessToken: newAccessToken, NewRefreshToken: newRefreshToken });
});

app.post("/api/createUser", dbPost.addUserToDB);

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const currUser = users.find((user) => user.username === username);
  // if (!username) {
  //   res.status(404).send({ error: "Invalid username or username not found" });
  // }
  const hasedPassCompare = await bcrypt.hash(password, 10);
  console.log(password);
  console.log(currUser.password);
  const compare = await bcrypt.compare(password, currUser.password);
  if (compare) {
    const token = await generateAccessToken(username);
    const refreshToken = await generateRefreshToken(username);
    refreshTokens.push(refreshToken);
    res.status(200).send({ token: token, refreshToken: refreshToken });
  }
  res.status(401).send({ error: "invalid credentials" });
});

app.get("/api/users", authenticateToken, (req, res) => {
  console.log("valid token");
  res.status(200).send(users);
});

app.delete("/api/logout", (req, res) => {
  refreshTokens = refreshTokens.filter(
    (refreshTokenDel) => refreshTokenDel != req.body.token
  );
  res.status(200).send({ status: "ok", valid: "logged out" });
});

app.get("/users", db.getUsers);

app.get("/findUser", db.getUsersByUsername);
