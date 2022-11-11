const express = require('express');
const router = express.Router();
const { authentication, authorization } = require('../middlewares/auth')
const { userSignIn, userLogin } = require('../controllers/userController');
const { createStudent, getStudent, deleteStudent, updateStudent } = require('../controllers/studentController');



router.post('/register', userSignIn)
router.post('/login', userLogin)
router.post('/user/:userId/student', authentication, authorization, createStudent)
router.get('/user/:userId/student', authentication, authorization, getStudent)
router.put('/user/:userId/student/:studentId', authentication, authorization, updateStudent)
router.delete('/user/:userId/student/:studentId', authentication, authorization, deleteStudent)




router.all('/**', function (req, res) {
    return res.status(400).send({ status: false, message: "Invalid http request" })
})


module.exports = router; 