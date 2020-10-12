var express = require('express');
var app = express();
const registrateRouter = require('./routes/registrate');
const uploadS3Router = require('./routes/uploadS3');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
console.log("check0");
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

console.log("check1");
app.use(registrateRouter);
app.use(uploadS3Router);

console.log("check2");
// error handler
app.use('/', (req, res) => {
  console.log("entered 404");
  res.send('something went wrong');

});

console.log("check3");
const PORT = process.env.PORT;
//const PORT = 5001;
app.listen(PORT);

module.exports = app;