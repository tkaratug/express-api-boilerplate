const mongoose  = require('mongoose');
const jwt       = require('jsonwebtoken');
const passport  = require('../config/passport');

// Model
const User      = require('../models/user');

/**
 * Get All Users
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getAll = (req, res, next) => {
    res.status(200).json({
        message: 'Hello!'
    });
}

/**
 * Login
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.login = (req, res, next) => {
    const usermail = req.body.usermail;
    const userpass = req.body.userpass;

    User.getUserByMail(usermail, (err, user) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err
            });
        }  

        if (!user) {
            return res.status(401).json({
                status: false,
                error: 'Auth failed'
            });
        }

        User.comparePassword(userpass, user.userpass, (err, isMatch) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    error: err
                });
            }

            if (isMatch) {
                const token = jwt.sign(
                    {
                        usermail: user.usermail,
                        userId: user._id,
                        externalId: user.externalId
                    },
                    passport.secretKey,
                    {
                        expiresIn: '1h'
                    }
                );

                return res.status(200).json({
                    status: true,
                    message: 'Auth successful',
                    data: {
                        token: token
                    }
                });
            } else {
                return res.status(401).json({
                    status: false,
                    error: 'Auth failed'
                });
            }
        });
    });
}

/**
 * SignUp
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.signup = (req, res, next) => {

    // Request verileri alınıyor
    const { usermail, userpass } = req.body;

    // Gelen e-posta sistemde mevcut mu kontrol ediliyor
    // Eğer yoksa yeni kayıt oluşturulma aşamasına geçiliyor
    User.getUserByMail(usermail, (err, user) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err
            });
        }

        // Eğer e-posta adresi ile kullanıcı mevcut ise hata döndürülüyor
        if (user) {
            return res.status(409).json({
                status: false,
                error: 'Mail exists'
            });
        }

        // Yeni kullanıcı nesnesi oluşturuluyor
        let newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            usermail: usermail,
            userpass: userpass
        });

        // Kullanıcı kaydı tamamlanıyor
        User.addUser(newUser, (err, user) => {
            if (err) {
                res.status(500).json({
                    status: false,
                    error: err
                });
            } else {
                res.status(201).json({
                    status: true,
                    message: 'User created',
                    user: {
                        userId: user._id,
                        usermail: usermail
                    }
                });
            }
        });
    });
}

/**
 * Delete a User
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                status: true,
                message: 'User deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                error: err
            });
        });
}