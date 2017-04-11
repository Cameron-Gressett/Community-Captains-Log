var CurrentSubLog = require('../models/CurrentSubmissionModel');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var Util = require('../models/CaptainsLogModel');
var User = require('../models/user');
var async = require('async');

module.exports = function (app) {
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));

    //This is for getting all of the submissions under a CaptainsLog
    app.get('/CaptainsLog/SubmissionLog/Post/:PostID/:Page', function (req, res) {
        CurrentSubLog.paginate({ PostID: req.params.PostID }, { page: req.params.Page, limit: 5, sort: { dateposted: -1 } }, function (err, sublog) {
            if (err) throw err;
            res.send(sublog);
        });
    });

    app.get('/CaptainsLog/SubmissionLog/Post/:PostID', function (req, res) {
        CurrentSubLog.find({ PostID: req.params.PostID }, function (err, sublog) {
            if (err) throw err;
            res.send(sublog);
        });
    });

    app.get('/CaptainsLog/SubmissionLog/ID/:_id', function (req, res) {
        CurrentSubLog.findById(req.params._id, function (err, sublog) {
            if (err) throw err;
            res.send(sublog);
        });
    });

    app.get('/CaptainsLog/SubmissionLog/', function (req, res) {
        CurrentSubLog.find({}, function (err, subLogs) {
            if (err) throw err;
            res.send(subLogs);
        });
    });
    /*
    We use several of these kinds of functions to display flagged content to our moderators
    */
    app.get('/SubmissionLog/Flagged/', function (req, res) {
        var username = "";
        async.waterfall([
            function (done) {
                User.find({}, function (err, users) {
                    done(err, users);
                });
            },
            function (usersarray, done) {
                var dataarray = [];
                CurrentSubLog.find({ Flag: true }, function (err, logs) {
                    logs.forEach(function (element) {
                        usersarray.forEach(function (user) {
                            if (user.username == element.User)
                                nameduser = user;
                        }, this);
                        dataarray.push({ Name: element.Name, User: nameduser, Content: element.Content, method: "Submission", id: element._id });
                    }, this);
                    done(err, dataarray);
                });
            },
            function (dataarray, done) {
                res.send(dataarray);
            }
        ])
    });
    /*
        In this function we search for the name of the user, and the name of any user that has voted for the post,
         and then returns true or false dependent on whether or not they voted on this submission log
    */
    app.get('/CaptainsLog/SubmissionLog/VotedInPost/:_id', function (req, res) {
        if (req.user) {
            var inarray = false;
            CurrentSubLog.findById(req.params._id, function (err, log) {
                if (err) throw err;
                log.UserVotes.forEach(function (element) {
                    if (element.toString() == req.user._id.toString()) {
                        inarray = true;
                    }
                }, this);

                res.send(inarray);
            });
        }
        else res.send("Must be a user to attempt to see if you've voted for this submission");
    });

    app.post('/CaptainsLog/SubmissionLog/', function (req, res) {
        Util.findOne({ _id: req.body.PostID }, function (err, log) {

            req.checkBody('Content', 'Submission post is empty').notEmpty();
            req.checkBody('Content', 'Your submission is more than ' + log.CharLimit + ' characters long').len(0, log.CharLimit);

            var errors = req.validationErrors();

            if (errors) {
                res.send(errors);
            }
            else {
                if (log.Stage) {
                    if (req.user && !req.user.Muted) {
                        var newLog = CurrentSubLog(
                            {
                                Content: req.body.Content,
                                Votes: 0,
                                User: req.user.username,
                                PostID: req.body.PostID,
                                InUse: false
                            });
                        newLog.save(function (err) {
                            if (err) throw err;
                            res.send(true);
                        });
                    }

                    else res.send('You must be logged in to post a submission');
                }
                else res.send('Can only post submissions during submission time');
            }

        });

    });
    /*
    This checks to see if the user has already voted, and if not then votes for them
    */
    app.put('/CaptainsLog/SubmissionLog/Vote/', function (req, res) {
        if (req.user) {
            CurrentSubLog.findById(req.body._id, function (err, log) {
                async.waterfall([
                    function (done) {
                        var userarray = [];
                        userarray = log.UserVotes;
                        var votes = log.Votes;
                        if (userarray.length == 0) {
                            votes = 0;
                            done(null, false, userarray, votes);
                        }
                        else {
                            var inarray = false;
                            userarray.forEach(function (element) {
                                if (element.toString() == req.user._id.toString()) {
                                    inarray = true;
                                }
                            }, this);
                            done(null, inarray, userarray, votes);
                        }


                    },
                    function (inarray, userarray, votes, done) {
                        if (userarray == null || userarray.length == 0) {
                            userarray = [];
                        }
                        if (!inarray) {
                            userarray.push(req.user._id);
                            votes += 1;
                        }

                        CurrentSubLog.findByIdAndUpdate(req.body._id,
                            {
                                Votes: votes,
                                UserVotes: userarray
                            },
                            function (err, sublog) {
                                if (err) throw err;
                                if (!inarray) {
                                    res.send(true);
                                }
                                else res.send('Unable to vote again!');
                            });
                    }]);
            });
        }
        else res.send('Must be logged in to vote for a submission!');
    });

    app.put('/CaptainsLog/SubmissionLog/Flag/:_id', function (req, res) {

        if (req.user && !req.user.Mod && !req.user.Muted) {
            CurrentSubLog.findByIdAndUpdate(req.params._id,
                {
                    Flag: true,
                    InUse: false
                },
                function (err) {
                    if (err) throw err;
                    res.send(true);
                });
        }
        else res.send(false);
    });

    app.put('/CaptainsLog/SubmissionLog/unFlag/:_id', function (req, res) {
        CurrentSubLog.findById(req.params._id, function (err, log) {
            if (req.user && req.user.Mod && !log.InUse) {
                CurrentSubLog.findByIdAndUpdate(req.params._id,
                    {
                        Flag: false
                    },
                    function (err) {
                        if (err) throw err;
                        res.send(true)
                    });
            }
            else res.send(false);
        });
    });
    /*
    This is a function to replace the text of any flagged post for our moderators to treat bad content on the site
    */
    app.put('/CaptainsLog/SubmissionLog/ReplaceBadContent/:_id/:msg/:userId', function (req, res) {
        if (req.user.Mod) {
            CurrentSubLog.findById(req.params._id, function (err, log) {
                if (log.InUse) res.send(false);

                else {
                    User.findById(req.params.userId, function (err, userstuff) {
                        var userRating = userstuff.BehaviorRating;
                        User.findByIdAndUpdate(req.params.userId, {
                            BehaviorRating: userRating + 1
                        }, function (err, user) {
                        });
                    });
                    CurrentSubLog.findByIdAndUpdate(req.params._id, { Content: "Post had bad content. Moderated by: " + req.user.username + ". " + req.body.msg, InUse: true, Flag: false }, function (err, log) {
                        if (err) throw err;
                        res.send(true);
                    });
                }
            });
        }
        else res.send('Must be a moderator to Replace Bad Content');
    });
}