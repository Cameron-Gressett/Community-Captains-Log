var mongoose = require('mongoose');

var Schema = mongoose.Schema;
/*
This allows us to edit our MOTD without changing the html at all.
*/
var MOTDSchema = new Schema(
    {
        Content: String
    }
);

var MOTD = mongoose.model('MOTD', MOTDSchema);

module.exports = MOTD;