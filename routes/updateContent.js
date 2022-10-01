const express = require('express');
const router = express.Router();

const axios = require('axios');

router.post('/update', (req, res) => {
  // get the user details
  //console.log("entered update req.body: ", req.body);
  
  var { path, content } = req.body;
  var index = path.indexOf(process.env.ADMIN_USERNAME)
  if(index === -1){
    var url = process.env.DATABASE_URL+"content/" + path+".json"
  }else{
    var url = process.env.DATABASE_URL+"content/" + path.slice(0,index) +"0"+path.slice(index+process.env.ADMIN_USERNAME.length) +".json"
  }
  path.replace(process.env.ADMIN_USERNAME, "0");
  path.replace("admin", "0");
  console.log("content: ", content);
  console.log("path: ", path);
  console.log("url: ",url);

  config = {
    method: 'PATCH',
    url: url,
    data: content,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    crossorigin: true
  };
  // upload user to the database
  axios(config)
    .then(response => {
      console.log("\n\n\n\\\\\\\\\\\\\\\\\\\\\nres:");
      console.log(res.data);
      res.send(true);
    })
    .catch(err => {
      console.log("error from inner catch", err);
      res.send(err);
    });

});

router.post('/delete', (req, res) => {
  // get the user details
  console.log("entered delete req.body: ", req.body);
  
  var { path } = req.body;
  console.log("url: ",process.env.DATABASE_URL+"content/" + path+".json");

  config = {
    method: 'DELETE',
    url: process.env.DATABASE_URL+"content/" + path + ".json",
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
