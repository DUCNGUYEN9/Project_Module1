let user = [
  {
    userName: "Nguyen Ngoc Admin",
    email: "admin@gmail.com",
    password: "admin",
    status: "Đang hoạt động",
  },
  {
    userName: "Nguyen Van A",
    email: "user1@gmail.com",
    password: "user1",
    status: "Đang hoạt động",
  },
  {
    userName: "Le Van B",
    email: "user2@gmail.com",
    password: "user2",
    status: "Đang bị khóa",
  },
  {
    userName: "Pham Van C",
    email: "user3@gmail.com",
    password: "user3",
    status: "Đang hoạt động",
  },
  {
    userName: "Ho Thi D",
    email: "user4@gmail.com",
    password: "user4",
    status: "Đang hoạt động",
  },
  {
    userName: "Chau Thi F",
    email: "user5@gmail.com",
    password: "user5",
    status: "Đang bị khóa",
  },
  {
    userName: "Le Thi G",
    email: "user7@gmail.com",
    password: "user7",
    status: "Đang bị khóa",
  },
  {
    userName: "Chau Van H",
    email: "user9@gmail.com",
    password: "user9",
    status: "Đang bị khóa",
  },
  {
    userName: "Ho Thi I",
    email: "user10@gmail.com",
    password: "user10",
    status: "Đang bị khóa",
  },
  {
    userName: "Nguyen Thi W",
    email: "user11@gmail.com",
    password: "user11",
    status: "Đang bị khóa",
  },
  {
    userName: "Pham Thi K",
    email: "user12@gmail.com",
    password: "user12",
    status: "Đang bị khóa",
  },
];
localStorage.setItem("user", JSON.stringify(user));

let loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", function (event) {
  event.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  const checkUser = JSON.parse(localStorage.getItem("user"));
  let validateEmail = document.querySelector(".validate-email");
  let validatePassword = document.querySelector(".validate-password");
  let userFound = false;

  for (let i = 0; i < checkUser.length; i++) {
    if (checkUser[i].email === email) {
      if (checkUser[i].status == "Đang bị khóa") {
        alert("Tài Khoản Này Của Bạn Đang bị khóa");
        break;
      }
      if (checkUser[i].password === password) {
        userFound = true;
        localStorage.setItem("userLogin", email);
        window.location.href = "./page/home.html";
        break;
      } else {
        validatePassword.style.visibility = "visible";
      }
    }
  }

  if (!userFound) {
    validateEmail.style.visibility = "visible";
  }
});
