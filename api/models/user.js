const mongoose      = require('mongoose');
const bcrypt        = require('bcryptjs');

const userSchema    = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    usermail: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    userpass: {
        type: String,
        required: true,
        minLength: 8
    },
    externalId: {
        type: String,
        default: null
    },
    interests: {
        type: Array,
        default: []
    },
    status: {
        type: Number,
        default: 1
    },
    roles: {
        type: Array,
        default: [1]
    },
    deleted_at: {
        type: Date,
        default: null
    }
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.getUserByMail = function(email, callback) {
    User.findOne({ usermail: email }, callback);
}

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        
        bcrypt.hash(newUser.userpass, salt, (err, hash) => {
            if (err) throw err;
            newUser.userpass = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(password, hash, callback) {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}