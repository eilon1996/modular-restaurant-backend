
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
  // set path
  var tmp = false;
  let originalname = req.file.originalname;
  if(originalname.indexOf("_0_") != -1)
    tmp = true;
  
  pathArry = originalname.split("_");
  var d = new Date();
  var time = d.getTime();
  if(tmp)
    pathArry[pathArry.length - 1] = "tmp/"+time + "."+pathArry[pathArry.length - 1];
  
  var pathName = pathArry.join("/");
  console.log("pathName: ",pathName);
  
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: pathName,   //path in bucket+ the img name in the bucket
    Body: req.file.buffer,
    ACL: "public-read"
  }

  s3.upload(params, (err) => {
    if(err){
      console.log("S3 err", err);
      res.status(500).send(err);
    }
    else {//upload:file
      console.log("S3 ok");
    }

    
    if(tmp){   // make photo exapiare after a day
      const params2 = {
        Bucket: process.env.AWS_BUCKET_NAME,
        LifecycleConfiguration: {
            Rules: [
                {
                    Expiration: {
                        Days: 1,
                    },
                    Filter: {
                        Prefix: pathName,
                    },
                    Status: 'Enabled',
                }
            ]
        }
      }
      
      s3.putBucketLifecycleConfiguration(params2, (err) => {
        if(err){
          console.log("S3 err tmp", err);
          res.status(500).send(err);
        }
        else {//upload:file
          console.log("S3 ok tmp");
        }
      });
    }
    
    res.send(pathArry[pathArry.length - 1]);
  });
});


router.use('/copy_photos',upload, (req, res) => {
  // set path
  pathArry = req.file.originalname.split("_");
  var d = new Date();
  var time = d.getTime();
  pathArry[pathArry.length - 1] = time + "."+pathArry[pathArry.length - 1];
  var pathName = pathArry.join("/");

  

  console.log("change buckett")
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,      // new bucket
    Key: "users/dishes/4/cake.jpg",      // new dir/filename
    CopySource: process.env.AWS_BUCKET_NAME+"/users/dishes/0/cake.jpg", // old bucket/dir/filename

   };

   s3.copyObject(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
   });

   
});



module.exports = router;
