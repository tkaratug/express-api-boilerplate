const express   = require('express');
const router    = express.Router();

// Middleware
const auth = require('../middlewares/auth');

// Controller
const UsersController = require('../controllers/users');

/**
 * Get All Users
 * METHOD: GET
 */
router.get('/', auth, UsersController.getAll);

/**
 * Login
 * METHOD: POST
 */
router.post('/login', UsersController.login);

/**
 * SignUp
 * METHOD: POST
 */
router.post('/signup', UsersController.signup);

/**
 * Delete User
 * Method: DELETE
 */
router.delete('/:userId', auth, UsersController.delete);

module.exports = router;