var mongoose = require('mongoose');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var Schema = mongoose.Schema;

var faqSchema = new Schema(
    {
        Q: String,
        A: String,
        Order: Number
    }
);


var FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;