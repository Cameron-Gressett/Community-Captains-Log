
var CurrentLog = require('../models/CurrentLogModel');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var User = require('../models/user');
var async = require('async');

module.exports = function(app)
{
    var time = new Date();
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended: true}));

    app.get('/CaptainsLog/Log/', function(req,res)
    {
        CurrentLog.find({}, function(err, log)
        {
            if(err) throw err;
            res.send(log);
        });
    });

    app.get('/CaptainsLog/Log/ID/:_id', function(req,res)
    {
        CurrentLog.findById(req.params._id, function(err, log)
        {
            if(err) throw err;
            res.send(log);
        });
    });

    app.get('/CaptainsLog/Log/Post/:PostID/:Page', function(req,res)
    {
        CurrentLog.paginate({PostID: req.params.PostID},{page: req.params.Page, limit: 5, sort:{dateposted: +1}}, function(err, log)
        {
            if(err) throw err;
            res.send(log);
        });
    });

    app.get('/CaptainsLog/Log/Flagged/', function(req,res)
    {
        var username = "";
        async.waterfall([
            function(done)
            {
                User.find({}, function(err, users)
                {
                    done(err, users);
                });
            },
            function(usersarray, done)
            {
                var dataarray = [];
                CurrentLog.find({Flag: true}, function(err, logs)
                {
                    logs.forEach(function(element) 
                    {
                        usersarray.forEach(function(user) 
                        {
                            if(user.username == element.User)
                                nameduser = user;  
                        }, this);

                        dataarray.push({Name: element.Name, User: nameduser, Content: element.Content,method:"Log",id:element._id});

                    }, this);
                    done(err, dataarray);
                });
            },
            function(dataarray, done)
            {
                res.send(dataarray);
            }
        ])
    });

    app.put('/CaptainsLog/Log/Rate/', function(req, res)
    {
        if(req.user)
        {
            CurrentLog.findByIdAndUpdate(req.body._id, 
            {
                Likes: req.body.Rating,
                Dislikes: req.body.RatingNum
            }, 
            function(err, log)
            {
                if(err) throw err;
                res.send('Rated Log');
            });
        }
        else res.send('Must be logged in to Rate!');
    });


    app.put('/CaptainsLog/Log/Flag/:_id', function(req,res)
    {
        if(!req.user.Mod )
        {
            if(req.user && !req.user.Muted)
            {
                CurrentLog.findByIdAndUpdate(req.params._id,{
                Flag: true,
                InUse:false
            }, function(err)
                {
                    if(err) throw err;
                    res.send(true);
                });
            }
        else res.send('Must be logged into an unmuted account!');
    }
    else res.send("Can't Flag a post while being a Moderator!");
    });

    app.put('/CaptainsLog/Log/unFlag/:_id', function(req,res)
    {
        CurrentLog.findById(req.params._id, function(err,log)
        {
            if(req.user && req.user.Mod && !log.InUse)
            {
                CurrentLog.findByIdAndUpdate(req.params._id,
                {
                    Flag: false
                },
                function(err)
                {
                    if(err) throw err;
                    res.send(true)
                });
            }
            else res.send(false);
        });
    });

    app.put('/CaptainsLog/Log/ReplaceBadContent/:_id/:msg/:userId', function(req,res)
    {
        if(req.user)
        {
            if(req.user.Mod)
            {
                CurrentLog.findById(req.params._id, function(err,log)
                {
                    if(log.InUse) res.send(false);

                    else
                    { 
                        User.findById(req.params.userId, function(err, userstuff)
                        {
                            var userRating = userstuff.BehaviorRating;
                            User.findByIdAndUpdate(req.params.userId, 
                            {
                                BehaviorRating: userRating + 1
                            },
                            function(err, user)
                            {

                            });
                        });
                        CurrentLog.findByIdAndUpdate(req.params._id,{Content: "Post had bad content. Moderated by: "+ req.user.username +". " +req.params.msg,InUse:true,Flag:false}, function(err,log)
                        {
                            console.log(req.params.msg);
                            if(err) throw err;
                            res.send(true);
                        });
                    }
                });
            }
            else res.send('Must be a moderator to Replace Bad Content');
        }
        else res.send('Must be logged into a moderator account to replace bad content');
    });

    app.delete('/CaptainsLog/Log/:_id', function(req,res)
    {
        if(req.user.Mod)
        {
            CurrentLog.findByIdAndRemove({_id:req.params._id}, function(err)
            {
                if(err) throw err;
                res.send('Log Deleted');
            });
        }
        else res.send('Invalid Permissions');
    });
}