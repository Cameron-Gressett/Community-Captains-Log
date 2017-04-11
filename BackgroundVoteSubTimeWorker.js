var mongoose = require('mongoose');
var CaptainsLog = require('./models/CaptainsLogModel');
var User = require('./models/user');

/*
This is our core functionallity running on one script, this entirely runs our ability to post captain's logs from voted for
submissions, and runs our Moderation, and Mute expire times
*/
module.exports = function () {

    CaptainsLog.find({}, function (err, log) {
        log.forEach(function (element) {
            var time = new Date();
            if (element.SubtimeCounter - time.getTime() <= 0) {
                CaptainsLog.SubVoteEndTimer(element._id);
            }
        }, this);

    });

    User.find({}, function (err, user) {
        user.forEach(function (element) {
            var time = new Date();
            if (element.modExpireDate - time.getTime() <= 0) {
                User.findByIdAndUpdate(element._id, { Mod: false }, function (err, Upuser) {
                });
            }
        });
    });

    User.find({}, function (err, user) {
        user.forEach(function (element) {
            var time = new Date();
            if (element.MuteExpireTime - time.getTime() <= 0) {
                User.findByIdAndUpdate(element._id, { Muted: false }, function (err, Upuser) {
                });
            }
        });
    });
}