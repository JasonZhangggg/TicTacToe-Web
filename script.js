const boardButtons = document.querySelectorAll(".board > button");

function player() {
  let score = 0;
}

boardButtons.forEach((elem) => {
  elem.addEventListener("click", (e) => {
    e.target.textContent = "✖";
  });
});

function checkWin() {}
