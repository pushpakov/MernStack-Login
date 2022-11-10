const express = require('express');
const router = express.Router();
const { authentication, authorization } = require('../middlewares/auth')
const { userRegistration, userLogin } = require('../controllers/userController')


//----------------------------- User's API -----------------------------//

router.post('/register', userRegistration)
router.post('/login', userLogin)

//----------------------------- For invalid end URL -----------------------------//

router.all('/**', function (req, res) {
    return res.status(400).send({ status: false, message: "Invalid http request" })
})


module.exports = router; 