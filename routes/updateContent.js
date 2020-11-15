const express = require('express');
const router = express.Router();

const axios = require('axios');

router.post('/update', (req, res) => {
  // get the user details
  console.log("entered update req.body: ", req.body);
  console.log("url: ",process.env.DATABASE_URL + "content/" + id + "/"+type+".json");
  
  var { id, type, content } = req.body;

  console.log("url: ", id, type);
  config = {
    method: 'PATCH',
    url: process.env.DATABASE_URL + "content/" + id + "/"+type+".json",
    data: content,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    crossorigin: true
  };
  // upload user to the database
  axios(config)
    .then(response => {
      console.log("\n\n\n\\\\\\\\\\\\\\\\\\\\\nres:");
      //console.log(res.data);
      res.send(true);
    })
    .catch(err => {
      console.log("error from inner catch", err);
      res.send(err);
    });

});


module.exports = router;
