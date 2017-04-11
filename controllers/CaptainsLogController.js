var CaptainsLog = require('../models/CaptainsLogModel');
var User = require('../models/user');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var CurrentLog = require('../models/CurrentLogModel');
var CurrentSubLog = require('../models/CurrentSubmissionModel');
var async = require('async');

module.exports = function (app) {
    var time = new Date();
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));


    app.get('/CaptainsLog/Name/:Name/:Page', function (req, res) {
        CaptainsLog.paginate({ Name: req.params.Name }, { page: req.params.Page, limit: 5 }, function (err, caplog) {
            if (err) throw err;
            res.send(caplog);
        });
    });

    app.get('/CaptainsLog/Oldest/:Page', function (req, res) {
        CaptainsLog.paginate({}, { page: req.params.Page, limit: 5, sort: { DateCreated: +1 } }, function (err, caplogs) {
            if (err) throw err;
            res.send(caplogs);
        });
    });

    app.get('/CaptainsLog/User/:User/:Page', function (req, res) {
        CaptainsLog.paginate({ User: req.params.User }, { Page: req.params.Page, limit: 5 }, function (err, caplog) {
            if (err) throw err;
            res.send(caplog);
        });
    });

    app.get('/CaptainsLog/User/:Page', function (req, res) {
        if (req.user) {
            CaptainsLog.paginate({ User: req.user.username }, { page: req.params.Page, limit: 5 }, function (err, caplog) {
                if (err) throw err;
                res.send(caplog);
            });
        }
        else res.send('Log in before viewing your own logs!');
    });

    app.get('/CaptainsLog/ID/:_id', function (req, res) {
        CaptainsLog.findById(req.params._id, function (err, caplog) {
            if (err) throw err;
            res.send(caplog);
        });
    });

    app.get('/CaptainsLog/Recent/:Page', function (req, res) {
        CaptainsLog.paginate({}, { page: req.params.Page, limit: 20, sort: { DateCreated: -1 } }, function (err, caplogs) {
            if (err) throw err;
            res.send(caplogs);
        });
    });

    app.get('/CaptainsLog/TopRated/:Page', function (req, res) {
        CaptainsLog.paginate({}, { page: req.params.Page, limit: 5, sort: { Rating: -1 } }, function (err, caplog) {
            if (err) throw err;
            res.send(caplog);
        });
    });

    app.get('/CaptainsLog/RecentlyUpdated/:Page', function (req, res) {
        CaptainsLog.paginate({}, { page: req.params.Page, limit: 20, sort: { SubtimeCounter: -1 } }, function (err, caplogs) {
            if (err) throw err;
            res.send(caplogs);
        });
    });

    /*
    The whole section above this comment is used to sort the Captain's Logs on the home page of the site
    */

    app.get('/CaptainsLog/Flagged/', function (req, res) {
        var username = "";
        async.waterfall([
            function (done) {
                User.find({}, function (err, users) {
                    done(err, users);
                });
            },
            function (usersarray, done) {
                var dataarray = [];
                CaptainsLog.find({ Flag: true }, function (err, logs) {
                    logs.forEach(function (element) {
                        usersarray.forEach(function (user) {
                            if (user.username == element.User)
                                nameduser = user;
                        }, this);
                        dataarray.push({ Name: element.Name, User: nameduser, Content: element.Content, method: "Parent", id: element._id });
                    }, this);
                    done(err, dataarray);
                });
            },
            function (dataarray, done) {
                res.send(dataarray);
            }
        ])
    });

    app.get('/CaptainsLog/Time/:_id', function (req, res) {
        CaptainsLog.findById(req.params._id, function (err, post) {
            res.send((time.getTime() - post.SubtimeCounter).toString());
        });
    });

    app.get('/CaptainsLog/ID/Timer/:_id', function (req, res) {
        CaptainsLog.findById(req.params._id, function (err, caplog) {
            if (err) throw err;
            var Timer = new Date();

            res.send((caplog.SubtimeCounter - Timer.getTime()).toString());
        });
    });

    app.get('/CaptainsLog/Timer/:_id', function (req, res) {
        CaptainsLog.findById(req.params._id, function (err, post) {
            res.send(post.SubtimeCounter.toString());
        });
    });

    /*
    Just like some of our other methods for checking to see if a user has voted for
    a submission this one checks to see if you've rated this Captain's Log yet
    */
    app.get('/CaptainsLog/CheckRated/:_id', function (req, res) {
        if (req.user) {

            var userid = '';
            if (req.user) userid = req.user._id;

            var inarray = false;
            var rating = false;
            CaptainsLog.findById(req.params._id, function (err, caplog) {
                if (err) throw err;
                var userarray = caplog.UserRatings;
                var inarray = userarray.find(function (curval, index, arr) {
                    if (curval.user.toString() == req.user._id.toString()) {
                        rating = curval.rate;
                        return true;
                    }
                });

                if (inarray) res.send({ notRated: inarray, rate: rating });
                else res.send(false);
            });
        }
        else {
            res.send(false);
        }
    });

    app.get('/CaptainsLog/GetLogRating/:_id', function (req, res) {
        CaptainsLog.findById(req.params._id, function (err, caplog) {
            res.send(rating.toString());
        });
    });


    app.get('/CaptainsLog/GetRatingVars/:_id', function (req, res) {
        CaptainsLog.findById(req.params._id, function (err, caplog) {
            var r = caplog.Rating;
            res.send({ R: r, L: caplog.Likes, D: caplog.Dislikes });
        });
    });

    app.get('/CaptainsLog/Stage/:_id', function (req, res) {
        CaptainsLog.findById(req.params._id, function (err, caplog) {
            if (err) throw err;
            res.send(caplog.Stage);
        });
    });



    app.put('/CaptainsLog/Flag/:_id', function (req, res) {
        if (req.user && !req.user.Muted && !req.user.Mod) {
            CaptainsLog.findByIdAndUpdate(req.params._id,
                {
                    Flag: true,
                    InUse: false
                }, function (err) {
                    if (err) throw err;
                    res.send(true);
                });
        }

        else res.send('Must be logged in to a non-Mod, non-Muted account to report anything!');

    });

    app.put('/CaptainsLog/unFlag/:_id', function (req, res) {

        if (req.user || req.user.Mod) {
            CaptainsLog.findById(req.params._id, function (err, caplog) {
                if (!caplog.InUse) {
                    CaptainsLog.findByIdAndUpdate(req.params._id,
                        {
                            Flag: false,
                            InUse: true
                        }, function (err) {
                            if (err) throw err;
                            res.send(true)
                        });
                }
                else res.send(false);
            });
        }
    });

    app.put('/CaptainsLog/Dated/:_id', function (req, res) {
        CaptainsLog.findByIdAndUpdate(req.params._id,
            {
                QueryDate: time.getTime()
            }, function (err, caplog) {
                res.send('Done');
            });
    });
    /*
    This method takes our current rating, and adds on a like to it, then calculates the rating, then posts
    */
    app.put('/CaptainsLog/Rate/Like', function (req, res) {
        if (req.user) {

            CaptainsLog.findById(req.body._id, function (err, caplog) {
                var userarray = caplog.UserRatings;
                var rating = userarray.length + 1;
                var likes = caplog.Likes;
                var inarray = userarray.find(function (curval, index, arr) {
                    if (curval.user.toString() == req.user._id.toString()) return true;
                    else return false;
                });
                var r = ((likes + 1) / rating) * 100;
                r = Math.round(r);
                if (!inarray) {
                    userarray.push({ user: req.user._id, rate: true });
                    rating = r;
                    likes += 1;
                }
                if (rating == "NaN" || rating == null || rating == 0) {
                    rating = 0;
                }
                if (rating) { }
                else {
                    rating = 0;
                }

                CaptainsLog.findByIdAndUpdate(req.body._id,
                    {
                        Likes: likes,
                        Rating: rating,
                        UserRatings: userarray
                    },
                    function (err, caplog) {
                        if (err) throw err;
                        if (!inarray) {
                            res.send(true);
                        }
                        else res.send("Can't like a post more than once");
                    });
            });
        }
        else res.send('Must be logged in to like a post');
    });

    /*
    This method takes our current rating, and adds on a dislike to it, then calculates the rating, then posts
    */
    app.put('/CaptainsLog/Rate/Dislike', function (req, res) {
        if (req.user) {
            CaptainsLog.findById(req.body._id, function (err, caplog) {
                var userarray = caplog.UserRatings;
                var rating = userarray.length + 1;
                var likes = caplog.Likes;
                var dislikes = caplog.Dislikes;

                var inarray = userarray.find(function (curval, index, arr) {
                    if (curval.user.toString() == req.user._id.toString()) return true;
                    else return false;
                });
                var r = (likes / rating) * 100;
                r = Math.round(r);
                if (!inarray) {
                    userarray.push({ user: req.user._id, rate: false });
                    rating = r;
                    dislikes += 1;
                }

                CaptainsLog.findByIdAndUpdate(req.body._id,
                    {
                        Dislikes: dislikes,
                        Rating: rating,
                        UserRatings: userarray
                    },
                    function (err, caplog) {
                        if (err) throw err;
                        if (!inarray) {
                            res.send(true);
                        }
                        else res.send("Can't dislike a post more than once");
                    });
            });
        }
        else res.send('Must be logged in to dislike a post');
    });


    app.post('/CaptainsLog/', function (req, res) {
        var Timer = new Date();

        if (req.user && !req.user.Muted) {
            if (req.body._id) {
                CaptainsLog.findByIdAndUpdate(req.body._id,
                    {
                        Name: req.body.Name,
                        Content: req.body.Content,
                        User: req.body.User,
                        Captain: req.body.Captain,
                        Ship: req.body.Ship,
                        CharLimit: req.body.CharLimit,
                        SubTime: req.body.SubTime,
                        VoteTime: req.body.VoteTime,
                        Likes: req.body.Likes,
                        Dislikes: req.body.Dislikes,
                        Stage: req.body.Stage,//True being the Voting time.
                        Rating: req.body.Rating,
                        QueryDate: Timer.getTime()
                    }, function (err, caplog) {
                        if (err) throw err;
                        res.send(caplog);
                    });
            }
            else {
                var newlog = CaptainsLog(
                    {
                        Name: req.body.Name,
                        Content: req.body.Content,
                        User: req.user.username,
                        Captain: req.body.Captain,
                        Ship: req.body.Ship,
                        CharLimit: req.body.CharLimit,
                        SubTime: req.body.SubTime,
                        VoteTime: req.body.VoteTime,
                        Likes: 0,
                        Dislikes: 0,
                        Rating: 0,
                        DateCreated: Timer.getTime(),
                        QueryDate: Timer.getTime(),
                        Stage: req.body.Stage,
                        InUse: false
                    }
                );
                newlog.save(function (err) {
                    Timer = new Date();

                    CaptainsLog.findByIdAndUpdate(newlog._id,
                        {
                            SubtimeCounter: Timer.getTime() + newlog.SubTime
                        },
                        function (err, caplog) {
                            if (err) throw err;
                            res.send(caplog);
                        });

                });
            }
        }
        else res.send(false);
    });






    app.delete('/CaptainsLog/:_id/:userId', function (req, res) {
        if (req.user.Mod) {
            CaptainsLog.findById(req.params._id, function (err, caplog) {
                if (!caplog.InUse) {
                    User.findById(req.params.userId, function (err, userstuff) {
                        var userRating = userstuff.BehaviorRating;
                        User.findByIdAndUpdate(req.params.userId, {
                            BehaviorRating: userRating + 1
                        }, function (err, user) {
                        });
                    });

                    CurrentLog.find({ PostID: req.params._id }, function (err, Log) {
                        Log.forEach(function (element) {
                            CurrentLog.findByIdAndRemove(element._id, function (err) { if (err) throw err; });
                        }, this);
                    });
                    CurrentSubLog.find({ PostID: req.params._id }, function (err, subLog) {
                        subLog.forEach(function (element) {
                            CurrentLog.findByIdAndRemove(element._id, function (err) { if (err) throw err; });
                        }, this);
                    });
                    CaptainsLog.findByIdAndRemove(req.params._id, function (err) {
                        if (err) throw err;
                        res.send(true);
                    });
                }
            });
        }
        else res.send(false);
    });

}