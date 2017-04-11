var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var submissionSchema = new Schema(
    {
        Content: String,
        Votes: {type: Number, default: 0},
        dateposted: {type: Number, default: (new Date).getTime()},
        User: String,
        PostID: String,
        Flag: {type: Boolean, default: false},
        UserVotes: {type: Array, default: []},
        InUse: {type : Boolean, default : false}
    }
);

submissionSchema.plugin(mongoosePaginate);

var SubLog = mongoose.model('SubLog', submissionSchema);

module.exports = SubLog;