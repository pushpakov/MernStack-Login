const studentModel = require('../models/studentModel')
const ObjectId = require('mongoose').Types.ObjectId

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

/*############################################ Post Student ##########################################################*/

let createStudent = async (req, res) => {
    try{
        let data = req.body;
        let { name, subject, marks } = data;
        if (Object.keys(data).length == 0) {return res.status(400).send({ status: false, message: "Please Provide Student Details" });}
          if (!isValid(name)) {return res.status(400).send({ status: false, message: "Name is required" });}
          if (!isValid(subject)) {return res.status(400).send({ status: false, message: "Subject is required" });}
          if (!isValid(marks)) {return res.status(400).send({ status: false, message: "Marks is required" });}

          let student = await studentModel.findOne({ name: name.trim() , subject:subject.trim()});
          if(student){
            let updatedDetail = await studentModel.findOneAndUpdate({ isDeleted: false, name: name.trim() , subject:subject.trim() },{marks: student.marks+marks},{ returnDocument:"after" });
              return res.status(200).send({ status: true, message: "Success", data: updatedDetail });
          }
          let savedData = await studentModel.create(data);
          return res.status(201).send({ status: true, message: 'Success', data: savedData });
    }
    catch (error) {return res.status(500).send({ status: false, message: error.message })}
};







let editStudent = async (req, res) => {
    try{
        let data = req.body;
        let studentId = req.params.studentId
        if(!ObjectId.isValid(studentId)){return res.status(400).send({ status: false, message: "Please Provide valid student id" });}
        let { name, subject, marks } = data;
        if (Object.keys(data).length == 0) {return res.status(400).send({ status: false, message: "Please Provide Student Detail to update" });}
          if(name){
            if (!isValid(name)) {return res.status(400).send({ status: false, message: "Name is required" })}
          }
          if(subject){
            if (!isValid(subject)) {return res.status(400).send({ status: false, message: "Subject is required" })}
        }
          if(marks){
            if (!isValid(marks)) {return res.status(400).send({ status: false, message: "Marks is required" })}
        }
        let updatedDetail = await studentModel.findOneAndUpdate({ isDeleted: false,_id: studentId},data,{returnDocument: "after"});
          return res.status(200).send({ status: true, message: "Success", data: updatedDetail });}
    catch (error) {return res.status(500).send({ status: false, message: error.message })}
};




let getStudent = async (req, res) => {
    try{
        let name = req.query.name
        let subject = req.query.subject

        let filter = {isDeleted:false}

        if(name){
            filter.name = name
        }

        if(subject){
            filter.subject = subject
        }
console.log(filter)
        const student = await studentModel.find(filter)
    if (student.length === 0) {
      res.status(404).send({ status: false, msg: "No student Data Found" });
      return;
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: student });

    }
    catch (error) {return res.status(500).send({ status: false, message: error.message })}
}




let deleteStudent = async (req, res) => {
    try{
        let Id = req.params.studentId
    let deletedData = await studentModel.findOneAndUpdate({ _id: Id, isDeleted:false }, { $set: { isDeleted: true} })
    return res.status(200).send({ status: true, message: `${deletedData.name}'s data Successfully Deleted.` })

    }
    catch(error) {return res.status(500).send({ status: false, message: error.message })}
};


module.exports.createStudent = createStudent;
module.exports.editStudent = editStudent;
module.exports.getStudent = getStudent;
module.exports.deleteStudent = deleteStudent;

