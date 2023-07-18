let user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : [];
let currentPage = 1;
let itemPerPage = 10;
function renderData() {
  let startIndex = (currentPage - 1) * itemPerPage;
  let endIndex = currentPage * itemPerPage;
  let totalPage = Math.ceil(user.length / itemPerPage);
  let tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  for (let i = startIndex; i < endIndex && i < user.length; i++) {
    tbody.innerHTML += `
    <tr>
      <th scope="row">${i + 1}</th>
      <td>${user[i].email}</td>
      <td>${user[i].password}</td>
      <td>${user[i].userName}</td>
      <td>${user[i].status}</td>
      <td
      class="d-flex justify-content-around"
      >
        <button class="btn btn-success" data-bs-toggle="modal"
        data-bs-target="#openModal" onclick="openAccount(${i})">
          <i class="fa-solid fa-lock-open" style="color: #fcfbfb;"></i>
        </button>
        <button class="btn btn-danger" data-bs-toggle="modal"
        data-bs-target="#lockModal" onclick="lockAccount(${i})">
          <i class="fa-solid fa-lock" style="color: #010813;"></i>
        </button>
      </td>
    </tr>
    `;
  }
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
    let item = `
    <li class="page-item w-auto p-0 ${
      currentPage == i ? "active" : ""
    }" onclick="changePage('${i}')">
      <a class="page-link rounded-0" href="#">${i}</a>
    </li>
    `;
    pagination.innerHTML += item;
  }
  if (currentPage >= totalPage) {
    next.classList.add("disabled");
  } else {
    next.classList.remove("disabled");
  }
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
// search sv
let searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function () {
  let searchAccount = document.getElementById("searchAccount");
  let searchArrUser = JSON.parse(localStorage.getItem("user"));
  let filteredData = searchArrUser.filter((item) =>
    item.email.includes(searchAccount.value)
  );

  if (filteredData.length < 1) {
    let tbody = document.getElementById("tbody");
    tbody.innerHTML =
      "<tr><td colspan='6' class='text-center'>Không tìm thấy kết quả.</td></tr>";
  } else if (filteredData.length > 0) {
    currentPage = 1;
    user = filteredData;
    renderData();
  }
});
// sort
let sortAccount = document.getElementById("sortAccount");
sortAccount.addEventListener("change", function () {
  const target = sortAccount.value;
  const sortArrUser = JSON.parse(localStorage.getItem("user"));
  switch (target) {
    case "emailPlus":
      sortArrUser.sort((a, b) => a.email.localeCompare(b.email));
      break;
    case "emailMinus":
      sortArrUser.sort((a, b) => b.email.localeCompare(a.email));
      break;
    case "statusPlus":
      sortArrUser.sort((a, b) => a.status.localeCompare(b.status));
      break;
    case "statusMinus":
      sortArrUser.sort((a, b) => b.status.localeCompare(a.status));
      break;
  }
  user = sortArrUser;
  renderData();
});
// unlock
let openModal = new bootstrap.Modal(document.getElementById("openModal"), {
  keyboard: false,
});
function openAccount(code) {
  let openContentModal = document.getElementById("openContentModal");
  openContentModal.innerHTML = `Bạn muốn mở tài khoản <b>${user[code].email}</b> không ?`;
  let openBtn = document.getElementById("openBtn");
  openBtn.onclick = function () {
    user[code].status = "Đang hoạt động";
    localStorage.setItem("user", JSON.stringify(user));
    renderData();
    openModal.hide();
  };
}
// lock
let lockModal = new bootstrap.Modal(document.getElementById("lockModal"), {
  keyboard: false,
});
function lockAccount(code) {
  let lockContentModal = document.getElementById("lockContentModal");
  lockContentModal.innerHTML = `Bạn muốn khóa tài khoản <b>${user[code].email}</b> không ?`;
  let lockBtn = document.getElementById("lockBtn");
  lockBtn.onclick = function () {
    user[code].status = "Đang bị khóa";
    localStorage.setItem("user", JSON.stringify(user));
    renderData();
    lockModal.hide();
  };
}
// toast
const toastTrigger = document.getElementById("openBtn");
const toastLiveExample = document.getElementById("liveToastOpen");

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastTrigger.addEventListener("click", () => {
    toastBootstrap.show();
  });
}
const toastTriggerLock = document.getElementById("lockBtn");
const toastLiveExampleLock = document.getElementById("liveToastLock");

if (toastTriggerLock) {
  const toastBootstrap =
    bootstrap.Toast.getOrCreateInstance(toastLiveExampleLock);
  toastTriggerLock.addEventListener("click", () => {
    toastBootstrap.show();
  });
}
document.onload = renderData();
