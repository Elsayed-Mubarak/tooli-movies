var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});




UserSchema.pre('save', function (next) {

    var user = this;  // this .. the value come from user input
    console.log(".................im on user db model..................", user)
    if (this.isModified('password') || this.isNew) {
        console.log(".................im on user db model.is modified.................", this.isModified('password'))
        bcrypt.genSalt(10, function (err, salt) {
            console.log(".................im on user db model.is salt.................", salt)

            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                console.log(".................im on user db model.is hash.................", hash)
                if (err) {
                    return next(err);
                }
                user.password = hash;    // user on db directly 
                next();
            });
        });
    } else {
        return next(); // go to the next middelware
    }
});


UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


/*



  UserSchema.methods.comparePassword = async function(password){
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
  }

*/
module.exports = mongoose.model('User', UserSchema);
