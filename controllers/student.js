const Student = require('../models/student');

exports.create = function(req, res) {
    let student = new Student({
        name: req.body.name,
        age: req.body.age
    });

    student.save(() => {
        res.send('Saved!');
    });
};

exports.get = (req, res) => {
    Student.find((error, students) => {
        res.send(students);
    })
};