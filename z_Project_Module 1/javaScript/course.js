let arrCourse = localStorage.getItem("arrCourse")
  ? JSON.parse(localStorage.getItem("arrCourse"))
  : [];

let action = "create";
let currentPage = 1;
let numberPerPage = 10;
function renderData() {
  const startIndex = (currentPage - 1) * numberPerPage;
  const endIndex = currentPage * numberPerPage;
  const totalPage = Math.ceil(arrCourse.length / numberPerPage);
  let tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  for (let i = startIndex; i < endIndex && i < arrCourse.length; i++) {
    tbody.innerHTML += `
    <tr>
      <th scope="row">${i + 1}</th>
      <td>${arrCourse[i].courseId}</td>
      <td>${arrCourse[i].courseName}</td>
      <td>${arrCourse[i].courseHour}</td>
      <td>${arrCourse[i].status}</td>
      <td
        class="d-flex align-content-center justify-content-around"
      >
        <button class="btn btn-warning" data-bs-toggle="modal"
        data-bs-target="#myModal" onclick="updateForm('${
          arrCourse[i].courseId
        }')">
          <i class="fa-regular fa-pen-to-square"></i>
        </button>
        <button class="btn btn-danger" data-bs-toggle="modal"
        data-bs-target="#deleteModal" onclick="deleteForm('${
          arrCourse[i].courseId
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
      currentPage == i ? "active" : ""
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
  let noCourseContent = document.getElementById("noCourseContent");
  let yesCourseContent = document.getElementById("yesCourseContent");
  let yesNavigation = document.getElementById("yesNavigation");
  if (arrCourse.length == 0) {
    yesCourseContent.style.display = "none";
    yesNavigation.style.display = "none";
    noCourseContent.style.display = "block";
  } else {
    noCourseContent.style.display = "none";
    yesCourseContent.style.display = "block";
    yesNavigation.style.display = "block";
  }
}
function validateForm() {
  let courseId = document.getElementById("courseId").value;
  let courseName = document.getElementById("courseName").value;
  let courseHour = document.getElementById("courseHour").value;
  resetFeedBack();
  if (courseId === "") {
    document.getElementById("courseIdFeedBack").innerHTML =
      "Vui lòng nhập mã khóa học.";
    return false;
  }

  if (courseName === "") {
    document.getElementById("courseNameFeedBack").innerHTML =
      "Vui lòng nhập tên khóa học.";
    return false;
  }

  if (courseHour === "") {
    document.getElementById("courseHourFeedBack").innerHTML =
      "Vui lòng nhập số giờ.";
    return false;
  } else if (courseHour < 0) {
    document.getElementById("courseHourFeedBack").innerHTML =
      "Vui lòng nhập số giờ không âm.";
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

// add course
let addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", function () {
  // hien thong bao
  let toastContainer = document.getElementById("toastContainer");
  if (!validateForm()) {
    toastContainer.classList.add("d-none");
  } else if (validateForm()) {
    toastContainer.classList.remove("d-none");
    let courseId = document.getElementById("courseId").value;
    let courseName = document.getElementById("courseName").value;
    let courseHour = document.getElementById("courseHour").value;
    let status = document.querySelector('input[name="status"]:checked').value;

    if (action == "create") {
      const existingCourseId = arrCourse.find(
        (item) => item.courseId === courseId
      );
      if (existingCourseId) {
        toastContainer.classList.add("d-none");
        document.getElementById("courseIdFeedBack").innerHTML =
          "Mã khóa học đã tồn tại.";
        return;
      }
      const existingCourseName = arrCourse.find(
        (item) => item.courseName === courseName
      );
      if (existingCourseName) {
        toastContainer.classList.add("d-none");
        document.getElementById("courseNameFeedBack").innerHTML =
          "Tên khóa học đã tồn tại.";
        return;
      }
      let item = {
        courseId: courseId,
        courseName: courseName,
        courseHour: courseHour,
        status: status,
        arrClass: [],
      };

      arrCourse.push(item);
      // thông báo
      document.getElementById("addTextAlert").innerHTML = "Thêm thành công ";
    } else {
      let index = getIndexForm(courseId);
      if (index !== -1) {
        if (arrCourse[index].courseName !== courseName) {
          const existingCourseName = arrCourse.find(
            (item) => item.courseName === courseName
          );
          if (existingCourseName) {
            toastContainer.classList.add("d-none");
            document.getElementById("courseNameFeedBack").innerHTML =
              "Tên khóa học đã tồn tại.";
            return;
          }
          arrCourse[index].courseName = courseName;
        }
        arrCourse[index].courseHour = courseHour;
        arrCourse[index].status = status;
      }
      action = "create";
      modalTitle.innerHTML = "Thêm mới Lớp";
      addBtn.innerHTML = "Thêm mới";
      // thông báo
      document.getElementById("addTextAlert").innerHTML =
        "cập nhật thành công ";
    }
    newModal.hide();
    localStorage.setItem("arrCourse", JSON.stringify(arrCourse));
    resetFeedBack();
    resetForm();
    renderData();
  }
});
// toast create & edit
const toastTriggerAdd = document.getElementById("addBtn");
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
  document.getElementById("courseId").value = "";
  document.getElementById("courseId").readOnly = false;
  document.getElementById("courseName").value = "";
  // document.getElementById("courseName").readOnly = false;
  document.getElementById("courseHour").value = "";
  document.getElementById("active").checked = true;
}
//  update
function updateForm(element) {
  resetFeedBack();
  let index = getIndexForm(element);
  if (index != -1) {
    document.getElementById("courseId").value = arrCourse[index].courseId;
    document.getElementById("courseId").readOnly = true;
    document.getElementById("courseName").value = arrCourse[index].courseName;
    // document.getElementById("courseName").readOnly = true;
    document.getElementById("courseHour").value = arrCourse[index].courseHour;
    document.getElementById("active").checked = true;
    modalTitle.innerHTML = "Cập nhật khóa học";
    addBtn.innerHTML = "Cập nhật";
    action = "update";
  }
}
//  get index form
function getIndexForm(code) {
  for (let i = 0; i < arrCourse.length; i++) {
    if (arrCourse[i].courseId == code) {
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
  deleteContentModal.innerHTML = `Bạn chắc chắn muốn xóa khóa học có mã <b>${code}</b> này không ?<br>
  <div class="warning">*chú ý: Lớp học và học sinh có liên quan cũng bị xóa</div>`;
  let deleteBtn = document.getElementById("deleteBtn");
  deleteBtn.onclick = function () {
    let index = getIndexForm(code);
    if (index !== -1) {
      arrCourse.splice(index, 1);

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
// search
let searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function () {
  let searchCourse = document.getElementById("searchCourse");
  let searchArrCourse = JSON.parse(localStorage.getItem("arrCourse"));
  let filteredData = searchArrCourse.filter((item) =>
    item.courseName.includes(searchCourse.value)
  );

  if (filteredData.length < 1) {
    let tbody = document.getElementById("tbody");
    tbody.innerHTML =
      "<tr><td colspan='6' class='text-center'>Không tìm thấy kết quả.</td></tr>";
  } else if (filteredData.length > 0) {
    currentPage = 1;
    arrCourse = filteredData;
    renderData();
  }
});
// sort
let sortStudent = document.getElementById("sortStudent");
sortStudent.addEventListener("change", function () {
  const target = sortStudent.value;
  const sortArrCourse = JSON.parse(localStorage.getItem("arrCourse"));
  switch (target) {
    case "namePlus":
      sortArrCourse.sort((a, b) => a.courseName.localeCompare(b.courseName));
      break;
    case "nameMinus":
      sortArrCourse.sort((a, b) => b.courseName.localeCompare(a.courseName));
      break;
  }
  arrCourse = sortArrCourse;
  renderData();
});
function resetFeedBack() {
  document.getElementById("courseIdFeedBack").innerHTML = "";
  document.getElementById("courseNameFeedBack").innerHTML = "";
  document.getElementById("courseHourFeedBack").innerHTML = "";
}
function addForm() {
  modalTitle.innerHTML = "Thêm mới khóa học";
  addBtn.innerHTML = "Thêm mới";
  action = "create";
  resetForm();
  resetFeedBack();
}
document.onload = renderData();
