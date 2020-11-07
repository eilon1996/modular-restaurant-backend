const express = require('express');
const router = express.Router();

const axios = require('axios');

router.post('/update', (req, res) => {
  console.log("entered backend");

  var details = req.body;
  const id = details.id;
  const type = details.type;
  const content = details.content;

  var config = {
    method: 'PATCH',
    url: process.env.DATABASE_URL + "content/"+id+"/"+type +".json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    crossorigin: true,        
    data: content,
  };

  // check if user exist
      console.log("\n\\\\\\\\\\\\\\\\\\\\\n url: "+config.url);
  axios(config)
    .then(response => {
      console.log("\n\n\n\\\\\\\\\\\\\\\\\\\\\n update content");
      console.log("\n\\\\\\\\\\\\\\\\\\\\\n response: ",response);
      res.send(true);
    })
    .catch(err => {
      console.log("err: ", err);
      res.send(err);
    });
});

module.exports = router;
