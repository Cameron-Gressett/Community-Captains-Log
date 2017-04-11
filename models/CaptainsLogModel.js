var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var CurrentLog = require('./CurrentLogModel');
var CurrentSubLog = require('./CurrentSubmissionModel');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var Schema = mongoose.Schema;

var time = new Date();
/*
We built this model using all of the building blocks to our Captains log.
*/
var utilSchema = new Schema(
    {
        Name: String,
        Content: String,
        User: String,
        Captain: String,
        Ship: String,
        CharLimit: Number,
        SubTime: Number,
        VoteTime: Number,
        DateCreated: { type: Number, default: time.getTime() },
        SubtimeCounter: { type: Number },
        Likes: { type: Number, default: 0 },
        Stage: { type: Boolean, default: false },//true sub, false vote
        Dislikes: { type: Number, default: 0 },
        Rating: { type: Number, default: 0 },
        Flag: { type: Boolean, default: false },
        UserRatings: { type: Array, default: [] },
        InUse: { type: Boolean }
    }
);

utilSchema.plugin(mongoosePaginate);


var Util = mongoose.model('Util', utilSchema);

module.exports = Util;
/*these are the function that run the main functionality of our site, and posts our Captain's logs after they've been voted for*/
module.exports.SubVoteEndTimer = function (_id) {
    var retval = false;
    var Timer = new Date();
    var Timerdone = false;
    var test = Util.findById(_id, function (err, util) {
        if (util.SubtimeCounter - Timer.getTime() <= 0) {
            Timerdone = true;
        }

        else {
            return false;
        }

        if (util.Stage && Timerdone) {
            util.Stage = false;
            util.SubtimeCounter = Timer.getTime() + util.VoteTime;
        }
        else if (!util.Stage && Timerdone) {
            util.Stage = true;
            util.SubtimeCounter = Timer.getTime() + util.SubTime;
            retval = postTopVoted(_id);
        }
        Util.findByIdAndUpdate(_id, { Stage: util.Stage, SubtimeCounter: util.SubtimeCounter }, function (err, log) {
            retval = true;

        });
        return retval;
    });
    return test;
}

function postTopVoted(id) {
    var time = new Date();
    CurrentSubLog.find({ PostID: id }, function (err, submission) {
        if (err) throw err;
        if (submission.length >= 1) {
            var newCapLog = CurrentLog(
                {
                    Name: submission[0].Name,
                    User: submission[0].User,
                    Content: submission[0].Content,
                    dateposted: time.getTime(),
                    PostID: submission[0].PostID,
                    Likes: 0,
                    Dislikes: 0,
                    InUse: false
                });
            newCapLog.save(function (err) {
                if (err) throw err;
            });

            deleteOtherSubs(id);
        }
        else {
            return false;
        }
    }).sort({ Votes: -1 }).limit(1);
    return true;
}

function deleteOtherSubs(id) {
    CurrentSubLog.find({ PostID: id }, function (err, logs) {
        if (err) throw err;

        logs.forEach(function (element) {
            CurrentSubLog.findByIdAndRemove(element._id, function (err) {

            });
        }, this);
        return true;
    });
}