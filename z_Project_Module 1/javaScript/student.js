let arrCourse = localStorage.getItem("arrCourse")
  ? JSON.parse(localStorage.getItem("arrCourse"))
  : [];
let addIdClass = document.getElementById("addClassId");
let arrStudentCourse = [];
for (let j = 0; j < arrCourse.length; j++) {
  for (let i = 0; i < arrCourse[j].arrClass.length; i++) {
    for (const item of arrCourse[j].arrClass[i].arrStudent) {
      arrStudentCourse.push(item);
    }
    addIdClass.innerHTML += `<option value="${arrCourse[j].arrClass[i].className}">${arrCourse[j].arrClass[i].className}</option>`;
  }
}
localStorage.setItem("arrStudent", JSON.stringify(arrStudentCourse));

let arrStudent = JSON.parse(localStorage.getItem("arrStudent")) || [];

let action = "create";
let currentPage = 1;
let numberPerPage = 10;
function renderData() {
  const startIndex = (currentPage - 1) * numberPerPage;
  const endIndex = currentPage * numberPerPage;
  const totalPage = Math.ceil(arrStudent.length / numberPerPage);
  let tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  for (let i = startIndex; i < endIndex && i < arrStudent.length; i++) {
    tbody.innerHTML += `
    <tr>
      <th scope="row">${i + 1}</th>
      <td>${arrStudent[i].studentId}</td>
      <td>${arrStudent[i].studentName}</td>
      <td>${arrStudent[i].birthDay}</td>
      <td>${arrStudent[i].sex}</td>
      <td>${arrStudent[i].phone}</td>
      <td>${arrStudent[i].email}</td>
      <td>${arrStudent[i].address}</td>
      <td>${arrStudent[i].status}</td>
      <td>${arrStudent[i].addClassId}</td>
      <td>${arrStudent[i].commentText}</td>
      <td
        class="d-flex align-content-center justify-content-around"
      >
        <button class="btn btn-warning" data-bs-toggle="modal"
        data-bs-target="#myModal" onclick="updateForm('${
          arrStudent[i].studentId
        }')">
          <i class="fa-regular fa-pen-to-square"></i>
        </button>
        <button class="btn btn-danger" data-bs-toggle="modal"
        data-bs-target="#deleteModal" onclick="deleteForm('${
          arrStudent[i].studentId
        }')">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </td>
    </tr>
    `;
  }
  // phân trang
  let previous = document.getElementById("previous");
  let next = document.getElementById("next");
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  if (currentPage > 1) {
    previous.classList.remove("disabled");
  } else {
    previous.classList.add("disabled");
  }
  for (let i = 1; i <= totalPage; i++) {
    let itemPagination = `
    <li class="page-item w-auto p-0 ${
      currentPage === i ? "active" : ""
    }" onclick="changePage('${i}')">
      <a class="page-link rounded-0" href="#">${i}</a>
    </li>
    `;
    pagination.innerHTML += itemPagination;
  }
  if (currentPage >= totalPage) {
    next.classList.add("disabled");
  } else {
    next.classList.remove("disabled");
  }
  // Kiểm tra và hiển thị phần tử HTML tương ứng
  let noStudentContent = document.getElementById("noStudentContent");
  let yesStudentContent = document.getElementById("yesStudentContent");
  let yesNavigation = document.getElementById("yesNavigation");
  if (arrStudent.length == 0) {
    yesStudentContent.style.display = "none";
    yesNavigation.style.display = "none";
    noStudentContent.style.display = "block";
  } else {
    noStudentContent.style.display = "none";
    yesStudentContent.style.display = "block";
    yesNavigation.style.display = "block";
  }
}
function validateForm() {
  let studentId = document.getElementById("studentId").value;
  let studentName = document.getElementById("studentName").value;
  let address = document.getElementById("address").value;
  let birthDay = document.getElementById("birthDay").value;
  let status = document.getElementById("status").value;
  let addClassId = document.getElementById("addClassId").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  resetFeedBack();
  if (studentId === "") {
    document.getElementById("studentIdFeedBack").innerHTML =
      "Vui lòng nhập mã sinh viên.";
    return false;
  }

  if (studentName === "") {
    document.getElementById("studentNameFeedBack").innerHTML =
      "Vui lòng nhập tên sinh viên.";
    return false;
  } else if (studentName.length <= 5) {
    document.getElementById("studentNameFeedBack").innerHTML =
      "Vui lòng nhập tên sinh viên đầy đủ.";
    return false;
  }
  if (address === "") {
    document.getElementById("studentAddressFeedBack").innerHTML =
      "Vui lòng nhập địa chỉ.";
    return false;
  }
  if (addClassId === "Chọn trạng khóa học") {
    document.getElementById("classIdFeedBack").innerHTML =
      "Vui lòng chọn trạng thái.";
    return false;
  }
  if (birthDay === "") {
    document.getElementById("studentBirthdayFeedBack").innerHTML =
      "Vui lòng nhập năm sinh.";
    return false;
  } else if (birthDay.length != 4 || birthDay <= 1956 || birthDay >= 2006) {
    document.getElementById("studentBirthdayFeedBack").innerHTML =
      "Vui lòng nhập đúng năm sinh.";
    return false;
  }
  if (status === "Chọn trạng thái lớp học") {
    document.getElementById("studentStatusFeedBack").innerHTML =
      "Vui lòng chọn trạng thái.";
    return false;
  }
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email === "") {
    document.getElementById("studentEmailFeedBack").innerHTML =
      "Vui lòng nhập email";
    return false;
  } else if (!emailRegex.test(email)) {
    document.getElementById("studentEmailFeedBack").innerHTML =
      "Vui lòng nhập đúng định dạng email";
    return false;
  }
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
  if (phone === "") {
    document.getElementById("studentPhoneFeedBack").innerHTML =
      "Vui lòng nhập số điện thoại";
    return false;
  } else if (!phoneRegex.test(phone)) {
    document.getElementById("studentPhoneFeedBack").innerHTML =
      "Vui lòng nhập đúng định dạng sdt vn";
    return false;
  }

  return true;
}
// chance page
function changePage(page) {
  if (page === "previous") {
    currentPage--;
  } else if (page === "next") {
    currentPage++;
  } else {
    currentPage = parseInt(page);
  }
  renderData();
}
let modalTitle = document.getElementById("modalTitle");
let newModal = new bootstrap.Modal(document.getElementById("myModal"), {
  keyboard: false,
});

// add SV
let addStudentBtn = document.getElementById("addStudentBtn");
addStudentBtn.addEventListener("click", function () {
  let toastContainer = document.getElementById("toastContainer");
  if (!validateForm()) {
    toastContainer.classList.add("d-none");
  } else if (validateForm()) {
    toastContainer.classList.remove("d-none");
    //
    let studentId = document.getElementById("studentId").value;
    let studentName = document.getElementById("studentName").value;
    let address = document.getElementById("address").value;
    let commentText = document.getElementById("commentText").value;
    let birthDay = document.getElementById("birthDay").value;
    let status = document.getElementById("status").value;
    let addClassId = document.getElementById("addClassId").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let sex = document.querySelector('input[name="sex"]:checked').value;

    if (action == "create") {
      const existingStudent = arrStudent.find(
        (item) => item.studentId === studentId
      );
      if (existingStudent) {
        toastContainer.classList.add("d-none");

        document.getElementById("studentIdFeedBack").innerHTML =
          "Mã sinh viên đã tồn tại.";
        return;
      }
      let newStudent = {
        studentId: studentId,
        studentName: studentName,
        address: address,
        commentText: commentText,
        birthDay: birthDay,
        status: status,
        addClassId: addClassId,
        email: email,
        phone: phone,
        sex: sex,
      };
      arrStudent.push(newStudent);
      localStorage.setItem("arrStudent", JSON.stringify(arrStudent));

      for (let i = 0; i < arrCourse.length; i++) {
        const classIndex = arrCourse[i].arrClass.findIndex(
          (item) => item.classId === addClassId
        );
        if (classIndex !== -1) {
          arrCourse[i].arrClass[classIndex].arrStudent.push(newStudent);
          localStorage.setItem("arrCourse", JSON.stringify(arrCourse));
        }
      }
      // thông báo
      document.getElementById("addTextAlert").innerHTML = "Thêm thành công ";
    } else {
      let index = getIndexForm(studentId);
      if (index !== -1) {
        arrStudent[index].studentName = studentName;
        arrStudent[index].address = address;
        arrStudent[index].commentText = commentText;
        arrStudent[index].birthDay = birthDay;
        arrStudent[index].status = status;
        arrStudent[index].email = email;
        arrStudent[index].phone = phone;
        arrStudent[index].sex = sex;

        const previousClassId = arrStudent[index].addClassId;

        // Update addClassId in arrStudent
        arrStudent[index].addClassId = addClassId;
        const newClassId = addClassId;

        // Update addClassId in arrCourse
        for (let i = 0; i < arrCourse.length; i++) {
          const classIndex = arrCourse[i].arrClass.findIndex(
            (item) => item.classId === previousClassId
          );
          if (classIndex !== -1) {
            const studentIndex = arrCourse[i].arrClass[
              classIndex
            ].arrStudent.findIndex((item) => item.studentId === studentId);
            if (studentIndex !== -1) {
              // Update addClassId in arrCourse
              arrCourse[i].arrClass[classIndex].arrStudent[
                studentIndex
              ].addClassId = addClassId;
              localStorage.setItem("arrCourse", JSON.stringify(arrCourse));
            }
          }
        }
        // Xóa sinh viên khỏi lớp cũ
        for (let i = 0; i < arrCourse.length; i++) {
          const classIndex = arrCourse[i].arrClass.findIndex(
            (item) => item.classId === previousClassId
          );
          if (classIndex !== -1) {
            const studentIndex = arrCourse[i].arrClass[
              classIndex
            ].arrStudent.findIndex((item) => item.studentId === studentId);
            if (studentIndex !== -1) {
              // Xóa sinh viên khỏi lớp cũ
              arrCourse[i].arrClass[classIndex].arrStudent.splice(
                studentIndex,
                1
              );
              localStorage.setItem("arrCourse", JSON.stringify(arrCourse));
            }
          }
        }
        // Thêm sinh viên vào lớp mới
        for (let i = 0; i < arrCourse.length; i++) {
          const classIndex = arrCourse[i].arrClass.findIndex(
            (item) => item.classId === newClassId
          );
          if (classIndex !== -1) {
            arrCourse[i].arrClass[classIndex].arrStudent.push(
              arrStudent[index]
            );
            localStorage.setItem("arrCourse", JSON.stringify(arrCourse));
          }
        }

        action = "create";
        modalTitle.innerHTML = "Thêm mới sinh viên";
        addStudentBtn.innerHTML = "Thêm mới";
        // thông báo
        document.getElementById("addTextAlert").innerHTML =
          "cập nhật thành công ";
      }
    }
    newModal.hide();
    localStorage.setItem("arrStudent", JSON.stringify(arrStudent));
    resetFeedBack();
    resetForm();
    renderData();
  }
});
// toast create & edit
const toastTriggerAdd = document.getElementById("addStudentBtn");
const toastLiveExampleAdd = document.getElementById("liveToastAdd");

if (toastTriggerAdd && toastLiveExampleAdd) {
  const toastBootstrap =
    bootstrap.Toast.getOrCreateInstance(toastLiveExampleAdd);
  toastTriggerAdd.addEventListener("click", () => {
    toastBootstrap.show();
    // chỉnh thời gian
    const autoCloseTimeout = 1000;
    setTimeout(() => {
      toastBootstrap.hide();
    }, autoCloseTimeout);
  });
}
// reset
function resetForm() {
  document.getElementById("studentId").value = "";
  document.getElementById("studentId").readOnly = false;
  // document.getElementById("addClassId").disabled = false;
  document.getElementById("addClassId").selectedIndex = 0;

  document.getElementById("studentName").value = "";
  document.getElementById("address").value = "";
  document.getElementById("commentText").value = "";
  document.getElementById("birthDay").value = "";
  document.getElementById("status").selectedIndex = 0;
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.querySelector('input[value="Nam"]').checked = true;
}
//  update
function updateForm(element) {
  resetFeedBack();
  let index = getIndexForm(element);
  if (index != -1) {
    document.getElementById("studentId").value = arrStudent[index].studentId;
    document.getElementById("studentId").readOnly = true;
    document.getElementById("addClassId").value = arrStudent[index].addClassId;
    document.getElementById("status").value = arrStudent[index].status;
    document.getElementById("studentName").value =
      arrStudent[index].studentName;
    document.getElementById("address").value = arrStudent[index].address;
    document.getElementById("commentText").value =
      arrStudent[index].commentText;
    document.getElementById("birthDay").value = arrStudent[index].birthDay;
    document.getElementById("email").value = arrStudent[index].email;
    document.getElementById("phone").value = arrStudent[index].phone;
    document.querySelector('input[value="Nam"]').checked = true;
    modalTitle.innerHTML = "Cập nhật sinh viên";
    addStudentBtn.innerHTML = "Cập nhật";
    action = "update";
  }
}
//  get index form
function getIndexForm(code) {
  for (let i = 0; i < arrStudent.length; i++) {
    if (arrStudent[i].studentId == code) {
      return i;
    }
  }
  return -1;
}
// delete
let deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"), {
  keyboard: false,
});

function deleteForm(code) {
  let deleteContentModal = document.getElementById("deleteContentModal");
  deleteContentModal.innerHTML = `Bạn muốn xóa sinh viên có mã <b>${code}</b> này không ?`;
  let deleteBtn = document.getElementById("deleteBtn");
  deleteBtn.onclick = function () {
    let index = getIndexForm(code);
    let addClassIdStudent = arrStudent[index].addClassId;
    console.log("deleteForm - Index:", index);
    console.log("deleteForm - addClassIdStudent:", addClassIdStudent);

    if (index !== -1) {
      const addClassId = arrStudent[index].addClassId;
      arrStudent.splice(index, 1);
      localStorage.setItem("arrStudent", JSON.stringify(arrStudent));

      for (let i = 0; i < arrCourse.length; i++) {
        const course = arrCourse[i];
        const classIndex = course.arrClass.findIndex(
          (cls) => cls.classId === addClassId
        );
        if (classIndex !== -1) {
          const studentIndex = course.arrClass[classIndex].arrStudent.findIndex(
            (student) => student.studentId === code
          );
          if (studentIndex !== -1) {
            course.arrClass[classIndex].arrStudent.splice(studentIndex, 1);
          }
        }
      }

      localStorage.setItem("arrCourse", JSON.stringify(arrCourse));
      renderData();
    }

    deleteModal.hide();
  };
}
// toast delete
const toastTrigger = document.getElementById("deleteBtn");
const toastLiveExample = document.getElementById("liveToast");

if (toastTrigger && toastLiveExample) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastTrigger.addEventListener("click", () => {
    toastBootstrap.show();
    // chỉnh thời gian
    const autoCloseTimeout = 1000;
    setTimeout(() => {
      toastBootstrap.hide();
    }, autoCloseTimeout);
  });
}
// search sv
let searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function () {
  let searchName = document.getElementById("searchNameStudent");
  let searchArrStudent = JSON.parse(localStorage.getItem("arrStudent"));
  let filteredData = searchArrStudent.filter((item) =>
    item.studentName.includes(searchName.value)
  );

  if (filteredData.length < 1) {
    let tbody = document.getElementById("tbody");
    tbody.innerHTML =
      "<tr><td colspan='12' class='text-center'>Không tìm thấy kết quả.</td></tr>";
  } else if (filteredData.length > 0) {
    currentPage = 1;
    arrStudent = filteredData;
    renderData();
  }
});
// sort
let sortStudent = document.getElementById("sortStudent");
sortStudent.addEventListener("change", function () {
  const target = sortStudent.value;
  const sortArrStudent = JSON.parse(localStorage.getItem("arrStudent"));
  switch (target) {
    case "namePlus":
      sortArrStudent.sort((a, b) => a.studentName.localeCompare(b.studentName));
      break;
    case "nameMinus":
      sortArrStudent.sort((a, b) => b.studentName.localeCompare(a.studentName));
      break;
    case "addressPlus":
      sortArrStudent.sort((a, b) => a.address.localeCompare(b.address));
      break;
    case "addressMinus":
      sortArrStudent.sort((a, b) => b.address.localeCompare(a.address));
      break;
    case "statusPlus":
      sortArrStudent.sort((a, b) => a.status.localeCompare(b.status));
      break;
    case "statusMinus":
      sortArrStudent.sort((a, b) => b.status.localeCompare(a.status));
      break;
  }
  arrStudent = sortArrStudent;
  renderData();
});
function resetFeedBack() {
  document.getElementById("studentIdFeedBack").innerHTML = "";
  document.getElementById("studentNameFeedBack").innerHTML = "";
  document.getElementById("studentAddressFeedBack").innerHTML = "";
  document.getElementById("studentBirthdayFeedBack").innerHTML = "";
  document.getElementById("studentStatusFeedBack").innerHTML = "";
  document.getElementById("studentEmailFeedBack").innerHTML = "";
  document.getElementById("studentPhoneFeedBack").innerHTML = "";
  document.getElementById("classIdFeedBack").innerHTML = "";
}
function addForm() {
  modalTitle.innerHTML = "Thêm mới sinh viên";
  addStudentBtn.innerHTML = "Thêm mới";
  action = "create";
  resetForm();
  resetFeedBack();
}
document.onload = renderData();
