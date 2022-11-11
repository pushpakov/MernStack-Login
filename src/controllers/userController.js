const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');



const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
let passwordRegex = /^[A-Za-z\W0-9]{8,15}$/




//############################################ Create User ###################################################//

const userSignIn = async (req, res) => {
    try {
        let userData = req.body
        let { email, password } = userData

        //----------------------------- Validating body -----------------------------//
        if (Object.keys(userData).length === 0) {
            return res.status(400).send({ status: false, msg: "Request Cannot Be Empty" })
        }

        //----------------------------- Validating Email -----------------------------//
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email is required" });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: false, message: "email is invalid" })
        }

        //----------------------------- Validating Password -----------------------------//
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).send({ status: false, message: "password should be 8 to 15 character long" })
        }

        //-----------Bcrypting Password -----------//
        const salt = await bcrypt.genSalt(10)
        userData.password = await bcrypt.hash(userData.password, salt)

        //----------------------------- Checking Duplicate Email -----------------------------//
        let userEmail = await userModel.findOne({ email })
        if (userEmail) {
            return res.status(409).send({ status: false, message: "This e-mail address is already exist, Please enter another E-mail address" })
        }

        const userCreated = await userModel.create(userData);
        return res.status(201).send({ status: true, message: 'User Created Successfully', data: userCreated });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};





//############################################ User Login ###################################################//

const userLogin = async function (req, res) {
    try {
        const data = req.body

        //----------------------------- Validating body -----------------------------//
        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "Please Enter Login Credentials..." })
        }

        const { email, password } = data

        //----------------------------- Validating Email -----------------------------//
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Please enter Email Id" })
        }
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: false, message: "Email is not valid" })
        }

        //----------------------------- Validating Password -----------------------------//
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Please enter Password" })
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).send({ status: false, message: "password should be between 8 to 15" })
        }

        //----------------------------- Checking Credential -----------------------------//
        const user = await userModel.findOne({ email })

        if (user) {
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).send({ status: false, message: "Invalid Password Credential" });
            }
        }
        else {
            return res.status(401).send({ status: false, message: "Invalid email Credential" });
        }

        //----------------------------- Token Generation -----------------------------//
        const token = jwt.sign({
            userId: user._id.toString(),
            project: "login_task",
        }, "done login")

        res.setHeader("Authorization", token)
        const output = {
            userId: user._id,
            token: token
        }
        return res.status(200).send({ status: true, message: "User login successfull", data: output })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};


module.exports = { userSignIn, userLogin }