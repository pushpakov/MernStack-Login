const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


/*############################################ VALIDATIONS ##########################################################*/

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

/*############################################ REGISTER USER ##########################################################*/

const userRegistration = async (req, res) => {
    try {
        let userData = req.body

        const salt = await bcrypt.genSalt(10)
        userData.password = await bcrypt.hash(userData.password, salt)

     
        ///<-----------------------------created part ---------------------------------->
        const userCreated = await userModel.create(userData);
        return res.status(201).send({ status: true, message: 'Success', data: userCreated });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


/*############################################ LOGIN USER ##########################################################*/

const userLogin = async function (req, res) {
    try {
        const data = req.body

        const email = data.email
        const password = data.password

        //----------------------------- Validating Email -----------------------------//
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Please enter Email Id" })
        }
        if (!emailRegex.test(email.trim())) {
            return res.status(400).send({ status: false, message: "Email is not valid" })
        }

        //----------------------------- Validating Password -----------------------------//
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Please enter Password" })
        }
        if (!/^[A-Za-z\W0-9]{8,15}$/.test(password.trim())) {
            return res.status(400).send({ status: false, message: "password should be between 8 to 15" })
        }

        //----------------------------- Checking Credential -----------------------------//
        const user = await userModel.findOne({ email: email.trim() })

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
            project: "assignment_mern",
        }, "doneBy50")

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
}

module.exports.userRegistration = userRegistration;
module.exports.userLogin = userLogin;