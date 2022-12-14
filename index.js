const express = require("express");
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

app.post("/api/verify", (req, res) => {
  const auth = req.headers.authorization;
  const userSearch = req.query.user;
  if (auth === "lol" && userSearch === "admin") {
    res.status(200).send({ status: "ok" });
  } else {
    res.status(400).send({ error: "invalid credentials" });
  }
});
