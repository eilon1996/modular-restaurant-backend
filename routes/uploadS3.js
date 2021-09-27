require('dotenv/config');
const express = require('express');
const router = express.Router();
const multer = require("multer");
const aws = require("aws-sdk");
const { path } = require('../app');


const storage = multer.memoryStorage({
  destination: (req, file, callback) => {
    callback(null, ""); // the "" is a path for temp file, "" will find a defualt path
  }
});

const upload = multer({storage: storage}).single('image');


const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
})

router.use('/upload',upload, (req, res) => {
  console.log("upload:body: ", req.body,"file: ", req.file);
  // set path
  pathArry = req.file.originalname.split("_");
  var d = new Date();
  var time = d.getTime();
  pathArry[pathArry.length - 1] = time + "."+pathArry[pathArry.length - 1];
  var pathName = pathArry.join("/");
  console.log("req.img name", pathName);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: pathName,   //path in bucket+ the img name in the bucket
    Body: req.file.buffer,
    ACL: "public-read"
  }
  
  console.log("params: ",params);
  s3.upload(params, (err) => {
    if(err){
      console.log("S3 err");
      console.log(err);
      res.status(500).send(err);
    }
    else {//upload:file
      console.log("S3 res");
      res.send("https://modular-restrunt-images.s3.us-east-2.amazonaws.com/"+pathName);
    }
  })
});

module.exports = router;
