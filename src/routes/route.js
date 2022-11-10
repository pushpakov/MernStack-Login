const express = require('express');
const router = express.Router();
const { authentication, authorization } = require('../middlewares/auth')
const { userRegistration, userLogin } = require('../controllers/userController')
const { createStudent, editStudent, getStudent, deleteStudent } = require('../controllers/studentController')

//----------------------------- User's API -----------------------------//

router.post('/register', userRegistration)
router.post('/login', userLogin)

router.post('/student/add', createStudent)    
router.put('/student/:studentId', editStudent) 
router.get('/student', getStudent) 
router.delete('/student/:studentId', deleteStudent)  

//----------------------------- For invalid end URL -----------------------------//

router.all('/**', function (req, res) {
    return res.status(400).send({ status: false, message: "Invalid http request" })
})


module.exports = router; 