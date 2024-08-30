const express = require("express");
const ejs = require("ejs");
const db = require("./db.js");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.render("index");
});
// all students
app.get("/students", async (req, res) => {
  let sql = "SELECT * FROM students";
  const dbData = await db.query(sql);
  console.dir(dbData);
  res.render("students", { dbData });
});

// town
app.get("/students/town/:townName", async (req, res) => {
  const townName = req.params.townName;
  let sql = "SELECT * FROM students WHERE town =?";
  const dbData = await db.query(sql, [townName]);
  console.dir(dbData);
  res.render("students", { dbData });
});

// student-details
app.get("/students/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  let sql = `
	SELECT students.fName, students.lName, courses.name as courseName, courses.description 
	FROM students
	JOIN student_courses ON students.id = student_courses.student_id
	JOIN courses ON student_courses.course_id = courses.id
	WHERE students.id = ?`;

  const studentData = await db.query(sql, [studentId]);

  if (studentData.length > 0) {
    const studentDetails = {
      fName: studentData[0].fName,
      lName: studentData[0].lName,
    };
    res.render("student-details", {
      student: studentDetails,
      courses: studentData,
    });
  }
});

app.get("/courses", async (req, res) => {
  let sql = "SELECT * FROM courses";
  const dbData = await db.query(sql);
  console.dir(dbData);
  res.render("courses", { dbData });
});

app.get("/courses/:courseId", async (req, res) => {
  const courseId = req.params.courseId;
  let sql = `SELECT courses.name AS courseName, 
					  courses.description AS courseDescription, 
					  students.id AS studentId, 
					  students.fName AS studentFName, 
					  students.lName AS studentLName
			   FROM courses 
			   LEFT JOIN student_courses ON courses.id = student_courses.course_id
			   LEFT JOIN students ON student_courses.student_id = students.id 
			   WHERE courses.id = ?`;

  const dbData = await db.query(sql, [courseId]);

  const courseDetails = {
    name: dbData[0].courseName,
    description: dbData[0].courseDescription,
    students: dbData.map((student) => ({
      id: student.studentId,
      firstName: student.studentFName,
      lastName: student.studentLName,
    })),
  };
  res.render("course-details", { course: courseDetails });
});

app.get("/courses-students", async (req, res) => {
  let sql = `
	  SELECT courses.id AS courseId,
			 courses.name AS courseName,
			 students.id AS studentId,
			 students.fName AS studentFName,
			 students.lName AS studentLName
	  FROM courses
	  LEFT JOIN student_courses ON courses.id = student_courses.course_id
	  LEFT JOIN students ON student_courses.student_id = students.id
	`;

  const dbData = await db.query(sql);
  const courses = dbData.reduce((acc, row) => {
    const { courseId, courseName, studentId, studentFName, studentLName } = row;
    if (!acc[courseId]) {
      acc[courseId] = {
        courseId,
        courseName,
        students: [],
      };
    }

    if (studentId) {
      acc[courseId].students.push({
        id: studentId,
        firstName: studentFName,
        lastName: studentLName,
      });
    }

    return acc;
  }, {});

  const coursesArray = Object.values(courses);
  res.render("courses-students", { courses: coursesArray });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
