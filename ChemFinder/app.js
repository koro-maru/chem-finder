var dotenv = require('dotenv').config();
var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var app = express();
const mongoose = require('mongoose')
const Chemical = require('./models/Chemical');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const mongoDb = process.env.CONNECTION_STRING;

console.log(mongoDb)
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongo connection error"));
app.use('/', indexRouter);

app.listen(3000);
console.log("API live on port 3000")
module.exports = app;
