var express = require('express');
var app = express();
const registrateRouter = require('./routes/registrate');
const uploadS3Router = require('./routes/uploadS3');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(registrateRouter);
app.use(uploadS3Router);

// error handler
app.use('/', (req, res) => {
  console.log("entered 404");
  res.send('something went wrong');

});

const PORT = process.env.PORT;
//const PORT = 5000;
app.listen(PORT);

module.exports = app;
