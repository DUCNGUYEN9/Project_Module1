// check login
function checkLogin() {
  let email = localStorage.getItem("userLogin");
  if (email == null) {
    window.location.href = "../Login.html";
  }

  // Lấy số lượng khóa học
  let arrCourse = localStorage.getItem("arrCourse")
    ? JSON.parse(localStorage.getItem("arrCourse"))
    : [];
  let numberCourse = 0;
  let numberClass = 0;
  let numberClassWait = 0;
  let numberClassEnd = 0;
  let numberClassActive = 0;
  let totalStudent = 0;
  let studentWait = 0;
  let studentReserve = 0;
  let studentSuspended = 0;
  let studentActive = 0;
  let studentGraduate = 0;
  arrCourse.forEach((course) => {
    numberCourse++;
    course.arrClass.forEach((classOfStudent) => {
      numberClass++;
      // lop hoc
      if (classOfStudent.status == "Chờ lớp") {
        numberClassWait++;
      }
      if (classOfStudent.status == "Hoạt động") {
        numberClassActive++;
      }
      if (classOfStudent.status == "kết thúc") {
        numberClassEnd++;
      }
      // sinh vien
      classOfStudent.arrStudent.forEach((student) => {
        totalStudent++;
        if (student.status === "Chờ lớp") {
          studentWait++;
        }
        if (student.status === "Đang học") {
          studentActive++;
        }
        if (student.status === "Bảo lưu") {
          studentSuspended++;
        }
        if (student.status === "Tốt nghiệp") {
          studentGraduate++;
        }
        if (student.status === "Đình chỉ") {
          studentReserve++;
        }
      });
    });
  });
  document.getElementById("numberCourse").innerHTML =
    "Số lượng khóa học: <b>" + numberCourse + "</b>";
  // lop hoc
  document.getElementById("numberClass").innerHTML =
    "Số lượng lớp học: <b>" + numberClass + "</b>";
  document.getElementById("numberClassWait").innerHTML =
    "Số lượng lớp học đang chờ: <b>" + numberClassWait + "</b>";
  document.getElementById("numberClassActive").innerHTML =
    "Số lượng lớp học đang hoạt động: <b>" + numberClassActive + "</b>";
  document.getElementById("numberClassEnd").innerHTML =
    "Số lượng lớp học đã kết thúc: <b>" + numberClassEnd + "</b>";
  // sinh vien
  document.getElementById("totalStudent").innerHTML =
    "Tổng sinh viên: <b>" + totalStudent + "</b>";

  document.getElementById("studentWait").innerHTML =
    "Số lượng sinh viên chờ lớp: <b>" + studentWait + "</b>";

  document.getElementById("studentActive").innerHTML =
    "Số lượng sinh viên đang học: <b>" + studentActive + "</b>";

  document.getElementById("studentReserve").innerHTML =
    "Số lượng sinh viên đình chỉ: <b>" + studentReserve + "</b>";

  document.getElementById("studentGraduate").innerHTML =
    " Số lượng sinh viên tốt nghiệp: <b>" + studentGraduate + "</b>";
  document.getElementById("studentSuspended").innerHTML =
    "Số lượng sinh viên bảo lưu: <b>" + studentSuspended + "</b>";
}

//log out
let logOut = document.getElementById("logOut");
logOut.addEventListener("click", function () {
  localStorage.removeItem("userLogin");
  window.location.href = "../Login.html";
});

document.onload = checkLogin();
