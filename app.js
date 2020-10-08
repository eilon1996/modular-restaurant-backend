var express = require('express');
var app = express();
const registrateRouter = require('./routes/registrate');
const uploadS3Router = require('./routes/uploadS3');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(registrateRouter);
app.use(uploadS3Router);

// error handler
app.use('/', (req, res) => {
  console.log("entered 404");
  res.send('something went wrong');

});

app.listen(5000);

module.exports = app;
