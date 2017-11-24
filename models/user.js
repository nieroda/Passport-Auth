var mongoose              = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    passportLocalMongooseEmail = require('passport-local-mongoose-email');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
});

//UserSchema.plugin(passportLocalMongooseEmail)
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
