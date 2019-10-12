const passport      = require('passport');
const JwtStrategy   = require('passport-jwt').Strategy;
const ExtractJwt    = require('passport-jwt').ExtractJwt;
const User          = require('../models/user');
const config        = require('../config/passport');

const options   = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey
};

passport.use(new JwtStrategy(options, (payload, done) => {
    User.getUserById(payload.userId, (err, user) => {
        if (err) {
            return done(err, false, { message: 'Faulty token' });
        }

        if (user) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Faulty token' });
        }
    });
}));