const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const axios = require('axios');

const database = [];
const secret = "secret";

router.post('/signup', (req, res) => {
  console.log("JSON.stringify(req.body)");
  console.log(JSON.stringify(req.body));

  const token = jwt.sign(req.body, secret);
  req.body.token = token;

  axios.patch(process.env.DATABASE_URL + "/content", req.body)
    .then(res => {
      console.log("JSON.stringify({req, err:null})");
      console.log(JSON.stringify({req, err:null }));
      res.send({ req, err:null });
    })
    .catch(err => {
      console.log("JSON.stringify({req, err })");
      console.log(JSON.stringify({req, err }));
      res.send(req, err);
    });
});

router.post('/login-name', (req, res) => { // getting user name and password
  var details = req.body;
  const user = database.filter(({ email }) => email === details.email);
  console.log("connected with username user: ", user, "database", database);
  if (user.length > 0 && details.password === user[0].password) {
    const token = jwt.sign(user[0], secret)
    res.send({ "user": user[0], "token": token });
  }
  else res.send(null);
});

router.post('/login-token', (req, res) => { // getting the user cookie
  console.log("req.body", req.body);
  var details = req.body;
  const user = database.filter(({ token }) => token === details.token);
  console.log("connected with token  user: ", user, "database", database);
  if (user.length > 0) {
    res.send({ "user": user[0] });
  }
  else res.send(null);
});
module.exports = router;
