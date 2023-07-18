let arrCourse = localStorage.getItem("arrCourse")
  ? JSON.parse(localStorage.getItem("arrCourse"))
  : [];
let addCourseId = document.getElementById("courseId");

let arrClassCourse = [];
for (let i = 0; i < arrCourse.length; i++) {
  for (const item of arrCourse[i].arrClass) {
    arrClassCourse.push(item);
  }
  addCourseId.innerHTML += `<option value="${arrCourse[i].courseId}">${arrCourse[i].courseName}</option>`;
}
localStorage.setItem("arrClass", JSON.stringify(arrClassCourse));

let arrClass = JSON.parse(localStorage.getItem("arrClass")) || [];

let action = "create";
let currentPage = 1;
let numberPerPage = 10;
function renderData() {
  const startIndex = (currentPage - 1) * numberPerPage;
  const endIndex = currentPage * numberPerPage;
  const totalPage = Math.ceil(arrClass.length / numberPerPage);
  let tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  for (let i = startIndex; i < endIndex && i < arrClass.length; i++) {
    tbody.innerHTML += `
    <tr>
      <th scope="row">${i + 1}</th>
      <td>${arrClass[i].classId}</td>
      <td>${arrClass[i].className}</td>
      <td>${arrClass[i].teacher}</td>
      <td>${arrClass[i].numbers}</td>
      <td>${arrClass[i].courseId}</td>
      <td>${arrClass[i].comment}</td>
      <td>${arrClass[i].status}</td>
      <td
        class="d-flex align-content-center justify-content-around"
      >
        <button class="btn btn-warning" data-bs-toggle="modal"
        data-bs-target="#myModal" onclick="updateForm('${
          arrClass[i].classId
        }')">
          <i class="fa-regular fa-pen-to-square"></i>
        </button>
        <button class="btn btn-danger" data-bs-toggle="modal"
        data-bs-target="#deleteModal" onclick="deleteForm('${
          arrClass[i].classId
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
  let noClassContent = document.getElementById("noClassContent");
  let yesClassContent = document.getElementById("yesClassContent");
  let yesNavigation = document.getElementById("yesNavigation");
  if (arrClass.length === 0) {
    yesClassContent.style.display = "none";
    yesNavigation.style.display = "none";
    noClassContent.style.display = "block";
  } else {
    noClassContent.style.display = "none";
    yesClassContent.style.display = "block";
    yesNavigation.style.display = "block";
  }
}
// validate
function validateForm() {
  let classId = document.getElementById("classId").value;
  let className = document.getElementById("className").value;
  let teacher = document.getElementById("teacher").value;
  let numbers = document.getElementById("numbers").value;
  let courseId = document.getElementById("courseId").value;
  let status = document.getElementById("status").value;
  resetFeedBack();
  if (classId === "") {
    document.getElementById("classIdFeedBack").innerHTML =
      "Vui lòng nhập mã lớp học.";
    return false;
  }

  if (className === "") {
    document.getElementById("classNameFeedBack").innerHTML =
      "Vui lòng nhập tên lớp học.";
    return false;
  }

  if (teacher === "") {
    document.getElementById("teacherFeedBack").innerHTML =
      "Vui lòng nhập tên giáo viên.";
    return false;
  }
  if (numbers === "") {
    document.getElementById("numbersFeedBack").innerHTML =
      "Vui lòng nhập sĩ số.";
    return false;
  } else if (numbers < 1) {
    document.getElementById("numbersFeedBack").innerHTML =
      "Vui lòng nhập sĩ số không âm.";
    return false;
  }
  if (courseId === "Chọn trạng khóa học") {
    document.getElementById("courseIdFeedBack").innerHTML =
      "Vui lòng chọn trạng thái.";
    return false;
  }
  if (status === "Chọn trạng thái lớp học") {
    document.getElementById("statusFeedBack").innerHTML =
      "Vui lòng chọn trạng thái.";
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
let addClassBtn = document.getElementById("addClassBtn");
addClassBtn.addEventListener("click", function () {
  let toastContainer = document.getElementById("toastContainer");
  if (!validateForm()) {
    toastContainer.classList.add("d-none");
  } else if (validateForm()) {
    toastContainer.classList.remove("d-none");
    let classId = document.getElementById("classId").value;
    let className = document.getElementById("className").value;
    let teacher = document.getElementById("teacher").value;
    let status = document.getElementById("status").value;
    let courseId = document.getElementById("courseId").value;

    let comment = document.getElementById("comment").value;
    let numbers = document.getElementById("numbers").value;

    if (action === "create") {
      const existingClassId = arrClass.find((item) => item.classId === classId);
      if (existingClassId) {
        toastContainer.classList.add("d-none");

        document.getElementById("classIdFeedBack").innerHTML =
          "Mã lớp đã tồn tại.";
        return;
      }
      const existingClassName = arrClass.find(
        (item) => item.className === className
      );
      if (existingClassName) {
        toastContainer.classList.add("d-none");

        document.getElementById("classNameFeedBack").innerHTML =
          "Tên lớp đã tồn tại.";
        return;
      }
      let newClass = {
        classId: classId,
        className: className,
        teacher: teacher,
        status: status,
        courseId: courseId,
        comment: comment,
        numbers: numbers,
        arrStudent: [],
      };
      arrClass.push(newClass);
      localStorage.setItem("arrClass", JSON.stringify(arrClass));

      const courseIndex = arrCourse.findIndex(
        (item) => item.courseId === courseId
      );
      if (courseIndex !== -1) {
        arrCourse[courseIndex].arrClass.push(newClass);
        localStorage.setItem("arrCourse", JSON.stringify(arrCourse));
      }
      // thông báo
      document.getElementById("addTextAlert").innerHTML = "Thêm thành công ";
    } else {
      let index = getIndexForm(classId);
      if (index !== -1) {
        const previousCourseId = arrClass[index].courseId;

        arrClass[index].className = className;
        arrClass[index].teacher = teacher;
        arrClass[index].status = status;
        arrClass[index].courseId = courseId;
        arrClass[index].comment = comment;
        arrClass[index].numbers = numbers;

        const courseIndex = arrCourse.findIndex(
          (item) => item.courseId === previousCourseId
        );
        if (courseIndex !== -1) {
          const classIndex = arrCourse[courseIndex].arrClass.findIndex(
            (item) => item.classId === classId
          );
          if (classIndex !== -1) {
            arrCourse[courseIndex].arrClass.splice(classIndex, 1); // Xóa lớp cũ từ arrCourse
          }
        }

        const newCourseIndex = arrCourse.findIndex(
          (item) => item.courseId === courseId
        );
        if (newCourseIndex !== -1) {
          arrCourse[newCourseIndex].arrClass.push(arrClass[index]); // Thêm lớp mới vào arrCourse
          localStorage.setItem("arrCourse", JSON.stringify(arrCourse));
        }
      }

      action = "create";
      modalTitle.innerHTML = "Thêm mới Lớp";
      addClassBtn.innerHTML = "Thêm mới";
      // thông báo
      document.getElementById("addTextAlert").innerHTML =
        "cập nhật thành công ";
    }
    newModal.hide();
    resetFeedBack();
    resetForm();
    renderData();
  }
});
// toast create & edit
const toastTriggerAdd = document.getElementById("addClassBtn");
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
  document.getElementById("classId").value = "";
  document.getElementById("classId").readOnly = false;
  document.getElementById("courseId").selectedIndex = 0;
  document.getElementById("className").value = "";
  document.getElementById("className").readOnly = false;
  document.getElementById("teacher").value = "";
  document.getElementById("numbers").value = "";
  document.getElementById("status").selectedIndex = 0;
  document.getElementById("comment").value = "";
}
//  update
function updateForm(element) {
  resetFeedBack();
  let index = getIndexForm(element);
  if (index !== -1) {
    document.getElementById("classId").value = arrClass[index].classId;
    document.getElementById("classId").readOnly = true;
    document.getElementById("courseId").value = arrClass[index].courseId;
    document.getElementById("status").value = arrClass[index].status;
    document.getElementById("className").value = arrClass[index].className;
    document.getElementById("className").readOnly = true;
    document.getElementById("teacher").value = arrClass[index].teacher;
    document.getElementById("numbers").value = arrClass[index].numbers;
    document.getElementById("comment").value = arrClass[index].comment;
    modalTitle.innerHTML = "Cập nhật Lớp";
    addClassBtn.innerHTML = "Cập nhật";
    action = "update";
  }
}
//  get index form
function getIndexForm(code) {
  for (let i = 0; i < arrClass.length; i++) {
    if (arrClass[i].classId === code) {
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
  deleteContentModal.innerHTML = `Bạn chắc chắn muốn xóa lớp học có mã <b>${code}</b> này không ?<br>
  <div class="warning">*chú ý: Học sinh có liên quan cũng bị xóa</div>`;
  let deleteBtn = document.getElementById("deleteBtn");
  deleteBtn.onclick = function () {
    let index = getIndexForm(code);
    if (index !== -1) {
      const courseId = arrClass[index].courseId;
      arrClass.splice(index, 1);
      localStorage.setItem("arrClass", JSON.stringify(arrClass));

      const courseIndex = arrCourse.findIndex(
        (item) => item.courseId === courseId
      );
      if (courseIndex !== -1) {
        const classIndex = arrCourse[courseIndex].arrClass.findIndex(
          (item) => item.classId === code
        );
        if (classIndex !== -1) {
          arrCourse[courseIndex].arrClass.splice(classIndex, 1);
          localStorage.setItem("arrCourse", JSON.stringify(arrCourse));
        }
      }
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
  let searchName = document.getElementById("searchNameClass");
  let searchArrClass = JSON.parse(localStorage.getItem("arrClass"));
  let filteredData = searchArrClass.filter((item) =>
    item.className.includes(searchName.value)
  );

  if (filteredData.length < 1) {
    let tbody = document.getElementById("tbody");
    tbody.innerHTML =
      "<tr><td colspan='11' class='text-center'>Không tìm thấy kết quả.</td></tr>";
  } else if (filteredData.length > 0) {
    currentPage = 1;
    arrClass = filteredData;
    renderData();
  }
});
// sort
let sortStudent = document.getElementById("sortStudent");
sortStudent.addEventListener("change", function () {
  const target = sortStudent.value;
  const sortArrClass = JSON.parse(localStorage.getItem("arrClass"));
  switch (target) {
    case "classPlus":
      sortArrClass.sort((a, b) => a.className.localeCompare(b.className));
      break;
    case "classMinus":
      sortArrClass.sort((a, b) => b.className.localeCompare(a.className));
      break;
    case "statusPlus":
      sortArrClass.sort((a, b) => a.status.localeCompare(b.status));
      break;
    case "statusMinus":
      sortArrClass.sort((a, b) => b.status.localeCompare(a.status));
      break;
  }
  arrClass = sortArrClass;
  renderData();
});
function resetFeedBack() {
  document.getElementById("classIdFeedBack").innerHTML = "";
  document.getElementById("classNameFeedBack").innerHTML = "";
  document.getElementById("statusFeedBack").innerHTML = "";
  document.getElementById("teacherFeedBack").innerHTML = "";
  document.getElementById("numbersFeedBack").innerHTML = "";
  document.getElementById("courseIdFeedBack").innerHTML = "";
  document.getElementById("statusFeedBack").innerHTML = "";
}
function addForm() {
  modalTitle.innerHTML = "Thêm mới sinh viên";
  addClassBtn.innerHTML = "Thêm mới";
  action = "create";
  resetFeedBack();
  resetForm();
}

document.onload = renderData();
