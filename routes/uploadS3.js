require('dotenv/config');
const express = require('express');
const router = express.Router();
const multer = require("multer");
const aws = require("aws-sdk");


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
  console.log("upload:file: ", req.file);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: 'users/'+req.file.originalname,   //path in bucket+ the img name in the bucket
    Body: req.file.buffer
  }
  
  s3.upload(params, (err) => {
    if(err){
      console.log(err);
      res.status(500).send(err);
    }
    else res.send("https://modular-restrunt-images.s3.us-east-2.amazonaws.com/"+req.file.originalname);
  })
});

module.exports = router;
