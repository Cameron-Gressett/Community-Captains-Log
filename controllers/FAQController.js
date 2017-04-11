var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var FAQ = require('../models/FAQModel');
var async = require('async');

module.exports = function (app) {
    var time = new Date();
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));


    app.get('/FAQ/', function (req, res) {
        FAQ.find({}, function (err, faq) {
            res.send(faq);
        }).sort({ Order: +1 });
    });

    app.post('/FAQ/Post', function (req, res) {
        if (req.body._id) {
            FAQ.findByIdAndUpdate(req.body._id,
                {
                    Q: req.body.Q,
                    A: req.body.A,
                    Order: req.body.Order
                }, function (err, caplog) {
                    if (err) throw err;
                    res.send(caplog);
                });
        }
        else {
            var faq = FAQ(
                {
                    Q: req.body.Q,
                    A: req.body.A,
                    Order: req.body.Order
                }
            );

            faq.save(function (err) {
                res.send(true);
            });
        }
    });

    app.delete('/FAQ/Del/:_id', function (req, res) {
        FAQ.findByIdAndRemove(req.params._id, function (err) {
            if (err) throw err;
            res.send(true);
        });
    })


}