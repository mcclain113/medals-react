window.addEventListener("load", (event) => {
  getData("/api/word");
});

// get initial data from db using AJAX
function getData(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      showData(data);
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error,
      );
    });
}

function showData(data) {
  const container = document.getElementById("container");
  container.innerText = "";
  for (let i = 0; i < data.length; i++) {
    console.log(data[i]);
    let el = document.createElement("div");
    el.innerText = data[i].text;
    el.style.color = `rgb(${data[i].r}, ${data[i].g}, ${data[i].b})`;
    container.appendChild(el);
  }
}
