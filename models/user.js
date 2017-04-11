var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema(
	{
		username:
		{
			type: String,
			index: true
		},
		password:
		{
			type: String
		},
		Muted: { type: Boolean, default: false },
		Mod: { type: Boolean, default: false },
		email: String,
		ResetPassword: { Type: String, default: '' },
		resetPasswordToken: String,
		resetPasswordExpires: Date,
		modExpireDate: { type: Number, default: 0 },
		BehaviorRating: { type: Number, default: 0 },
		MuteExpireTime: { type: Number, default: 0 }
	});
/*
These are various functions for creating our users
*/
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
	console.log(newUser);
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(newUser.password, salt, function (err, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

module.exports.getUserByUsername = function (username, callback) {
	var query = { username: username };
	User.findOne(query, callback);
}

module.exports.getUserById = function (id, callback) {
	User.findById(id, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
		if (err) throw err;
		callback(null, isMatch);
	});
}