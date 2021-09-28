const ham = document
  .querySelector(".hamburger")
  .addEventListener("click", (e) => {
    document.querySelector(".navigation").classList.toggle("colapsable");
    document.querySelector(".navigation").classList.toggle("uncolapse");
  });

// Login Functionality
const email = localStorage.getItem("email");
const password = localStorage.getItem("password");
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
  if (isLoggedIn !== "true") {
    window.location.href = "/login.html";
  } else {
    $("body").css("display", "block");
  }
});
// Login Functionality ---end
function makecardTemplate(id, model, charges, image) {
  return `
  <li class="splide__slide d-flex justify-content-center align-items-center">
                        <div class="d-none id">${id}</div>
                        <div class="card" style="width: 18rem;">
                            <img class="img-fluid card-img-top" loading="lazy" src="${image}" alt="Card image cap">
                            <div class="card-body">
                                <h5 class="card-title text-center">${model}</h5>
                                <p class="card-text d-flex justify-content-between">
                                    <span>Charges per Day</span>
                                    <span>${charges} Rs</span>
                                </p>
                                <button class="toDelete btn btn-primary">Delete</button>
                            </div>
                        </div>
                    </li>
  `;
}

$(function () {
  $(".logout").click(function () {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    window.location.href = "/login.html";
  });
  $(".add-item").click(function () {
    $(".item-form").toggleClass("d-none");
  });

  // Add item to the database
  $("#formdata").submit(function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    $.ajax({
      url: "http://localhost:3000/admin.html/insert",
      type: "POST",
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function () {
        location.reload();
      },
    });
  });
  // retrieve all data from the database
  function getAllData() {
    $.get("http://localhost:3000/admin.html/getitems", function (data) {
      var finalOutput = "";
      for (let index = 0; index < data.length; index++) {
        let temp = makecardTemplate(
          data[index].id,
          data[index].name,
          data[index].charges,
          data[index].image
        );
        finalOutput = finalOutput.concat(temp);
      }
      $("#inputTarget").append(finalOutput);
      turnOnslider();
      $("button.toDelete").click((e) => {
        const id = parseInt(
          e.currentTarget.parentElement.parentElement.previousElementSibling
            .innerHTML
        );
        deleteItem(id);
      });
    });
  }
  getAllData();

  // Delete the specific item
  function deleteItem(itemId) {
    $.ajax({
      type: "DELETE",
      url: "http://localhost:3000/admin.html/delete",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        id: itemId,
      }),
      success: function () {
        location.reload();
      },
    });
  }

  // deleteItem(24);
});

function turnOnslider() {
  new Splide("#card-slider", {
    type: "loop",
    autoplay: true,
    pauseOnHover: false,
    perPage: 3,
    breakpoints: {
      991: {
        perPage: 2,
      },
      750: {
        perPage: 1,
      },
    },
  }).mount();
}
