const ham = document
  .querySelector(".hamburger")
  .addEventListener("click", (e) => {
    document.querySelector(".navigation").classList.toggle("colapsable");
    document.querySelector(".navigation").classList.toggle("uncolapse");
  });

function makecardTemplate(id, model, charges, image) {
  console.log(image);
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
                                  <a href="about.html" class="toDelete btn btn-primary">Details</a>
                              </div>
                          </div>
                      </li>
    `;
}
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

$(function () {
  async function getAllData() {
    console.log("helo");
    await $.ajax({
      url: "http://localhost:3000/admin.html/getitems",
      type: "GET",
    }).done(async function (data) {
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
      await $("#inputTarget").append(finalOutput);
      await turnOnslider();
      console.log("hello");
    });
  }
  getAllData();
});
