const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const database = [];
const secret = "secret"

router.post('/signup', (req, res) => {
  var details = req.body;

  const user = database.filter(({ email }) => email === details.email);
  if (user.length > 0) res.send(null);
  else {
    const token = jwt.sign(details, secret)
    details.token = token;
    database.push(details);
    res.send({user:details});
  }
});

router.post('/login-name', (req, res) => { // getting user name and password
  var details = req.body;
  const user = database.filter(({ email }) => email === details.email);
  console.log("connected with username user: ", user, "database", database);
  if (user.length > 0 && details.password === user[0].password){
    const token = jwt.sign(user[0], secret)
    res.send({"user":user[0], "token":token});
  } 
  else res.send(null);
});

router.post('/login-token', (req, res) => { // getting the user cookie
  console.log("req.body", req.body);
  var details = req.body;
  const user = database.filter(({ token }) => token === details.token);
  console.log("connected with token  user: ", user, "database", database);
  if (user.length > 0){
    res.send({"user":user[0]});
  } 
  else res.send(null);
});
module.exports = router;
