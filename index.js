const express = require("express");
const { authenticateToken } = require("./middleware/middleware");
const { generateAccessToken } = require("./auth/token");
const jwt = require("jsonwebtoken");
const app = express();
const port = 8080;

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

app.get("/users/:feature/:id", (req, res) => {
  const feature = String(req.params.feature);
  const userid = parseInt(req.params.id);
  console.log(userid);
  console.log(feature);
  res.status(200).send({
    userid: `the id of the user is ${userid}`,
    feature: `the feature of the user is ${feature}`,
  });
});

app.get("/users", (req, res) => {
  const token = req.query.token;
  console.log(token);
  res.status(200).send({ token: token });
});

app.get("/api/validateToken", (req, res) => {
  const token = req.headers.authorization;
  try {
    const validate = authenticateToken();
  } catch (err) {
    res.status(402).send({ error: err });
  }
});

app.post("/api/createUser", async (req, res) => {
  const { username, email, password } = req.body;
  const token = await generateAccessToken(username);
  return res
    .cookie({ token: token })
    .status(200)
    .send({ success: true, status: "User Registered" });
});

app.post("/api/login", async (req, res) => {
  const user = req.body;

  const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
  res.status(200).send({ token: token });
});

app.get("/api/users", authenticateToken, (req, res) => {
  res.status(200).send(true);
});
