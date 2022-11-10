const reviewModel = require('../models/studentModel')
const ObjectId = require('mongoose').Types.ObjectId

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

/*############################################ Post Student ##########################################################*/

let createStudent = async (req, res) => {
    try{
        let data = req.data;

        let { name, subject, marks } = data;

        if (Object.keys(data).length == 0) {
            return res
              .status(400)
              .send({ status: false, message: "Please Provide Student Details" });
          }

          if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Name is required" });
          }

          if (!isValid(subject)) {
            return res.status(400).send({ status: false, message: "Subject is required" });
          }

          if (!isValid(marks)) {
            return res.status(400).send({ status: false, message: "Marks is required" });
          }

          let student = await studentModel.findOne({ name: name.trim() , subject:subject.trim()});
    if (isIsbnExist) {
      return res.status(409).send({ status: false, message: "ISBN already exists" });
    }



    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};


module.exports.createStudent = createStudent;
  