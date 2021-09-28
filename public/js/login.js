$(".submit-btn").click(function (e) {
  e.preventDefault();
  const email = $("#email").val();
  const password = $("#password").val();
  localStorage.setItem("email", email);
  localStorage.setItem("password", password);

  var isLoggedIn = "false";

  $.get("http://localhost:3000/login.html/authorize", function (data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].email == email && data[i].password == password) {
        console.log("admin logged in successfully");
        isLoggedIn = "true";
        break;
      } else {
        console.log("credential incorrect");
      }
    }
    if (isLoggedIn === "true") {
      $(".isLoggedIn").text("true");
      window.location.href = "/admin.html";
    }
  });
});
