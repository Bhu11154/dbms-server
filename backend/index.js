import express from "express";
import mysql from 'mysql'
import cors from 'cors'

const app = express()

// const db = mysql.createConnection({
//     host: "localhost",
//     user:"root",
//     password: "password",
//     database: "mydb"
// })

const db = new mysql.createConnection({
    host: "az-dbms.mysql.database.azure.com",
    user:"dbmsadmin",
    port:3306,
    password: "erp@123q",
    database: "mydb"
    //ssl:{ca:fs.readFileSync("/Users/bhu1r/Desktop/pro1/DigiCertGlobalRootCA.crt.pem")}
})

// var config =
// {
//     host: 'az-dbms.mysql.database.azure.com',
//     user: 'dbmsadmin',
//     password: 'erp@123q',
//     database: 'mydb',
//     port: 3306
//     // ssl: {ca: fs.readFileSync("your_path_to_ca_cert_file_BaltimoreCyberTrustRoot.crt.pem")}
// };

//db = new mysql.createConnection(config);

db.connect(
    function (err) { 
        if (err) { 
            console.log("!!! Cannot connect !!! Error:");
            throw err;
        }
        else {
            console.log("Connection established.");
            //updateData();
        }
});

var q = 'SELECT * FROM Department;'
db.query(q, function (err, result, fields) {
    if(err) console.log(err);
    else console.log('Nice!!');
});


app.use(express.json())
app.use(cors())

// Drop Tables
app.get('/Drop/:name', (req,res)=>{
    const name = req.params.name;
    var sql = `DROP TABLE ${name}`;
    db.query(sql, function (err, result) {
        if(err) return res.json(err);
        else return res.json(`Dropped Table ${name}`);
    });
})

// Creating Tables
app.get('/createStudentTable', (req,res) => {
    var sql = "CREATE TABLE Student (id VARCHAR(255), name VARCHAR(255), rollno VARCHAR(255), dob VARCHAR(255), department VARCHAR(255), password VARCHAR(255), Cgpa VARCHAR(255), PRIMARY KEY (id));";
    db.query(sql, function (err, result) {
        if(err) return res.json(err);
        else return res.json("Student table created");
    });
})

app.get('/createDepartmentTable', (req,res) => {
    var sql = "CREATE TABLE Department (id VARCHAR(255), name VARCHAR(255), hod VARCHAR(255), PRIMARY KEY (id), UNIQUE(name));";
    db.query(sql, function (err, result) {
        if(err) return res.json(err);
        else return res.json("Student table created");
    });
})

app.get('/createCourseTable', (req,res) => {
    var sql = "CREATE TABLE Course (id VARCHAR(255), name VARCHAR(255), dept VARCHAR(255), PRIMARY KEY (id));";
    db.query(sql, function (err, result) {
        if(err) return res.json(err);
        else return res.json("Course table created");
    });
})

app.get('/createEnrollmentTable', (req,res)=>{
    var sql = "CREATE TABLE Enrollment (id VARCHAR(255), studId VARCHAR(255), courseId VARCHAR(255), grade VARCHAR(255), PRIMARY KEY (id), UNIQUE(studId, courseId));";
    db.query(sql, function (err, result) {
        if(err) return res.json(err);
        else return res.json("Department table created");
    });
})


// Displaying Tables
app.get('/showStudents', (req,res)=>{
    var q = 'SELECT * FROM Student;'
    db.query(q, function (err, result, fields) {
        if(err) return res.json(err);
        else return res.json(result);
    });
})

app.get('/showCourses', (req,res)=>{
    var q = 'SELECT Course.id as CourseId, Department.name as DepartName, Course.name as CourseName FROM Course, Department WHERE Course.dept = Department.id;'
    db.query(q, function (err, result, fields) {
        if(err) return res.json(err);
        else return res.json(result);
    });
})

app.get('/showDepts', (req,res)=>{
    var q = 'SELECT * FROM Department;'
    db.query(q, function (err, result, fields) {
        if(err) return res.json(err);
        else return res.json(result);
    });
})

app.get('/showEnrollments', (req,res)=>{
    var q = 'SELECT * FROM Enrollment;'
    db.query(q, function (err, result, fields) {
        if(err) return res.json(err);
        else return res.json(result);
    });
})

// Editing
app.put('/editGrade/:id/:grade', (req,res)=>{
    const id = req.params.id;
    const g = req.params.grade;
    var q = `UPDATE Enrollment SET grade='${g}' WHERE id = '${id}';`;
    db.query(q, function (err, result) {
        if (err) return res.json(err); 
        else return res.json("Grade Changed");
    });
})

app.put('/editStudent', (req,res) =>{
    var sql = `UPDATE Student SET Cgpa = '${req.body.Cgpa}' WHERE id = '${req.body.id}';`;
    db.query(sql, function (err, result) {
        if (err) return res.json(err); 
        else return res.json("Student Edited");
    });
})

app.get('/coursesTaken/:id', (req,res) => {
    const id= req.params.id;
    var q = `SELECT * FROM Course NATURAL JOIN Enrollment WHERE Enrollment.studId = '${id}';`
    db.query(q, function (err, result, fields) {
        if(err) return res.json(err);
        else return res.json(result);
    });
})

app.get('/getEnrollmentDetails', (req,res) => {
    var q = 'SELECT Enrollment.id AS EnrollId, Student.name AS StudentName, Course.name AS CourseName, Enrollment.grade AS Grade FROM Enrollment,Student,Course WHERE Enrollment.studId = Student.id AND Course.id = Enrollment.courseId;'
    db.query(q, function (err, result, fields) {
        if(err) return res.json(err);
        else return res.json(result);
    });
})

app.get('/student/:id', (req,res) =>{
    const id = req.params.id;
    var sql = `SELECT * FROM Student WHERE id = '${id}'`;
    db.query(sql, function (err, result) {
        if(err) return res.json(err);
        else return res.json(result);
    });
})

// Inserting into Tables
app.post('/insertStudent', (req,res) =>{
    var sql = `INSERT INTO Student (id, name, rollno, dob, department, password, Cgpa) VALUES ('${req.body.id}', '${req.body.name}', '${req.body.rollno}', '${req.body.dob}', '${req.body.department}',  '${req.body.password}', '${req.body.Cgpa}');`;
    db.query(sql, function (err, result) {
        if(err) return res.json(err);
        else return res.json('Student inserted');
    });
})

app.post('/insertCourse', (req,res) =>{
    var sql = `INSERT INTO Course (id, name, dept) VALUES ('${req.body.id}', '${req.body.name}', '${req.body.dept}');`;
    db.query(sql, function (err, result) {
        if(err) return res.json(err);
        else return res.json('Course Inserted');
    });
})

app.post('/insertDept', (req,res) =>{
    var sql = `INSERT INTO Department (id, name, hod) VALUES ('${req.body.id}', '${req.body.name}', '${req.body.hod}');`;
    db.query(sql, function (err, result) {
        if(err) return res.json(err);
        else return res.json('Dept Inserted');
    });
})

app.post('/insertEnrollment', (req,res) =>{
    var sql = `INSERT INTO Enrollment (id, studId, courseId, grade) VALUES ('${req.body.id}', '${req.body.studId}', '${req.body.courseId}', '${req.body.grade}');`;
    db.query(sql, function (err, result) {
        if(err) return res.json(err);
        else return res.json('Enrollment inserted.');
    });
})

app.listen(8888, ()=>{
    console.log('Connected to Server with port:', 8888);
})