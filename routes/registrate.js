const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const axios = require('axios');

const database = [];
const secret = "secret";

router.post('/signup', (req, res) => {
  // get the user details
  console.log("entered signup req.body: ", req.body);

  var details = req.body;
  const id = details.credentials.id;

  var config = {
    method: 'GET',
    url: process.env.DATABASE_URL + "content.json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    crossorigin: true,
  };

  // check if user exist
  axios(config)
    .then(response => {
      console.log("\n\n\n\\\\\\\\\\\\\\\\\\\\\ncheck if user exist res:");
      if (Object.keys(response.data).filter(k => k === id).length > 0)
          throw {err: "user already exist"};

      return true;
    })
    .then(response => {
      console.log("response", response);
      const token = jwt.sign(id, process.env.JWT_SECRET);
      details.credentials["token"] = token;

      config = {
        method: 'PATCH',
        url: process.env.DATABASE_URL + "content/" + id + ".json",
        data: details,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        crossorigin: true
      };
        // upload user to the database
        axios(config)
          .then(response => {
            console.log("\n\n\n\\\\\\\\\\\\\\\\\\\\\nres:");
            //console.log(res.data);
            res.send({ token });
          })
          .catch(err => {
            console.log("error from inner catch");
            throw err;
          });
    })
    .catch(err => {
      console.log("\n\n\n\\\\\\\\\\\\\\\\\\\\\ncheck if user exist catch err:");
      console.log(err);
      res.send(err);
    });
});

router.post('/login-token', (req, res) => {
  console.log("entered login-token"/* , req.body */);

  var token = req.body.token;

  console.log("token", token);

  var config = {
    method: 'GET',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    crossorigin: true,
    url: process.env.DATABASE_URL + "content.json"
  };

  // check if user exist
  axios(config)
    .then(response => {
      console.log("\n\n\n\\\\\\\\\\\\\\\\\\\\\ncheck if user exist res:");
      let users = Object.values(response.data).filter(user =>user.credentials.token === token);
      console.log("users length ", users.length);
      let user;
      if (users.length == 0) {
        users = Object.values(response.data).filter(user =>user.credentials.id === "0");
        user = users[0];
        console.log("\n\nuser 0", user);
      }
      else {
        user = users[0];
        console.log("\n\nuser not 0 ", user);
      }
      res.send({user});
    })
    .catch(err => {
      console.log("\n\n\n\\\\\\\\\\\\\\\\\\\\\ncheck if user exist catch err:");
      console.log(err.message);
      res.send(err.message);
    });
});

router.post('/login', (req, res) => {
  console.log("entered backend");

  var details = req.body;
  const {id, password} = details;

  console.log("details, id", details, id);

  var config = {
    method: 'GET',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    crossorigin: true,
    url: process.env.DATABASE_URL + "content.json"
  };

  // check if user exist
  console.log("login");
  axios(config)
    .then(response => {
      console.log("\n\n\n\\\\\\\\\\\\\\\\\\\\\ncheck if user exist res:");
      const users = Object.values(response.data).filter(user =>user.credentials.id === id);
      console.log("users ", users);
      if (users.length == 0) throw {err: "user not exist"} ;
      const user = users[0];
      if (user.credentials.password !== password)  throw {err: "username or password are not correct"} ;
      res.send({user});
    })
    .catch(err => {
      console.log("\n\n\n\\\\\\\\\\\\\\\\\\\\\ncheck if user exist catch err:");
      console.log(err);
      res.send(err);
    });
});


module.exports = router;
