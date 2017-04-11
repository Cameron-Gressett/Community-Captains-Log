var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');
var async = require('async');
var crypto = require('crypto');
var User = require('../models/user');
var config = require('../config');

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { msg: 'Unknown User' });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, { msg: 'Invalid password' });
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

router.get('/MuteTimeExp/:_id', function (req, res) {
    User.findById(req.params._id, function (err, user) {
        var time = new Date(user.MuteExpireTime);
        res.send(time);
    });
});

router.get('/ModCheck/:_id', function (req, res) {
    User.findById(req.params._id, function (err, user) {
        if (user.Mod) res.send(true);
        else res.send(false);
    });
});

router.get('/logout', function (req, res) {
    req.logout();

    res.send('Logged out');
});

router.get('/token/:resetPasswordToken', function (req, res) {
    User.findOne({ resetPasswordToken: req.params.resetPasswordToken }, function (err, user) {
        if (err) throw err;
        if (user) {
            res.send(user);
        }
        else res.send(false);
    });
});


router.get('/user', function (req, res) {
    if (req.user) {
        res.send(req.user);
    }
    else {
        res.send(false);
    }


});

router.get('/user/username/:username', function (req, res) {
    User.find({ username: req.params.username }, function (err, user) {
        if (err) throw err;
        if (user) res.send(user);
        else res.send(false);
    });
});

// Register User
router.post('/register', function (req, res) {

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Confirm Password is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    User.findOne({ username: username }, function (err, user) {
        if (user) {
            if (errors == false) errors = [];

            var newError = { "param": "username", "msg": "Username already exists.", "value": '' };

            var erLen = errors.length;

            errors[erLen] = newError;
        }


        if (errors) {
            res.send(errors);
        }
        else {
            var newUser = new User
                ({
                    username: username,
                    password: password,
                    email: email,
                    BehaviorRating: 0
                });

            User.createUser(newUser, function (err, user) {
                if (err) throw err;
            });

            res.send(true);
        }

    });

});
/*
This mails the users a password reset form.
*/
router.post('/forgot', function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    return res.send('Email Doesnt exist');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport(
                {
                    service: 'gmail',
                    auth: {
                        user: config.emailuser,
                        pass: config.emailpass//found in config.js
                    }
                });
            var mailOptions =
                {
                    to: user.email,
                    from: 'passwordreset@demo.com',
                    subject: "Community Captain's Log Password Reset",
                    text: 'You are receiving this because you "' + user.username + '" (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/assets/CCLResetPassword.html?resetToken=' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
            smtpTransport.sendMail(mailOptions, function (err) {
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.send(true);
    });
});

router.post('/login', function (req, res, next) {

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        res.send(errors);
    }
    else {
        passport.authenticate('local', function (err, user, info) {
            if (err || !user) {
                return res.send(info);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.send(true);
            });
        })(req, res, next);
    }
});

router.put('/ResetPass/:_id', function (req, res) {
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Confirm Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        res.send(errors);
    }
    else {
        var hash = bcrypt.hashSync(req.body.password);

        User.findByIdAndUpdate(req.params._id,
            {
                password: hash
            }, function (err) {
                if (err) throw err;
                res.send(true);
            });
    }
});

router.put('/userRating/:_id', function (req, res) {
    if (req.user.Mod) {
        User.findById(req.params._id, function (err, userstuff) {
            var userRating = userstuff.BehaviorRating;
            User.findByIdAndUpdate(req.params._id, {
                BehaviorRating: userRating + 1
            }, function (err, user) {
            });
        });
    }
    else res.send('Must be a Moderator to mute a user!');
});

router.put('/mute/:_id', function (req, res) {
    if (req.user.Mod) {
        var time = new Date();
        User.findByIdAndUpdate(req.params._id, { Muted: true, MuteExpireTime: time.getTime() + 2629746000 }, function (err, user) {
            if (err) res.send(false);
            res.send(true);
        });
    }
});


router.put('/mod/user/:_id', function (req, res) {
    if (req.user.Mod) {
        var time = new Date();
        User.findByIdAndUpdate(req.params._id, { Mod: true, modExpireDate: time.getTime() + 2629746000 }, function (err, user) {
            if (err) throw err;
            res.send(true);
        });
    }
    else res.send('Must be a Moderator to make another user a Moderator');
});

module.exports = router;