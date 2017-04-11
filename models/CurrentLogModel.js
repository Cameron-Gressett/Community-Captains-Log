var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;
var time = new Date();
/*
We'd built this model using dateposted and PostID because we wanted access to the parent post this was posted in,
 and the date it was posted as to keep it in the same order as normal
*/
var logSchema = new Schema(
    {
        Name: String,
        User: String,
        Content: String,
        dateposted: { type: Number, default: (new Date).getTime() },
        PostID: String,
        Likes: { type: Number, default: 0 },
        Dislikes: { type: Number, default: 0 },
        Flag: { type: Boolean, default: false },
        InUse: { type: Boolean }
    });

logSchema.plugin(mongoosePaginate);

var CurrentLog = mongoose.model('CurrentLog', logSchema);


module.exports = CurrentLog;