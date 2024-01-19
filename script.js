function player() {
  let score = 0;
}

/**
 * Board
 */
const board = (function gameBoard() {
  let board = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
  ];

  function placePiece(row, col, piece) {
    if (board[row][col] === ".") {
      board[row][col] = piece;
      return true;
    }
    return false;
  }

  function checkWin(player) {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] === player &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      ) {
        return true; // Winner found
      }
    }

    // Check columns
    for (let j = 0; j < 3; j++) {
      if (
        board[0][j] === player &&
        board[0][j] === board[1][j] &&
        board[1][j] === board[2][j]
      ) {
        return true; // Winner found
      }
    }
    // Check diagonals
    if (
      board[0][0] === player &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return true; // Winner found (top-left to bottom-right)
    }

    if (
      board[0][2] === player &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return true; // Winner found (top-right to bottom-left)
    }

    return false; // No winner
  }

  function checkDraw() {
    return board.every((row) => row.every((cell) => cell !== "."));
  }

  function clear() {
    board = [
      [".", ".", "."],
      [".", ".", "."],
      [".", ".", "."],
    ];
  }

  return { placePiece, checkWin, checkDraw, clear };
})();

/**
 * Game Controller
 *
 *
 */
const controller = (function gameController() {
  let xTurn = true;
  const xSymbol = "✖";
  const oSymbol = "Ｏ";

  function playMove(target) {
    const symbol = xTurn ? xSymbol : oSymbol;
    if (board.placePiece(target.id[0], target.id[1], symbol)) {
      target.textContent = symbol;
      xTurn = !xTurn;
      if (board.checkWin(xSymbol)) {
        xTurn = true;
        return 1;
      } else if (board.checkWin(oSymbol)) {
        xTurn = true;
        return 2;
      } else if (board.checkDraw()) {
        xTurn = true;
        return 3;
      }
      return 0;
    }
    return -1;
  }

  return { playMove };
})();

(function displayController() {
  let numPlayers = 1;

  const boardButtons = document.querySelectorAll(".board > button");
  const playerButton = document.querySelector(".playerButton");

  const winBox = document.querySelector("dialog");
  const winText = document.querySelector(".winner");

  const xScore = document.querySelector("#x-score");
  const oScore = document.querySelector("#o-score");
  const tieScore = document.querySelector("#tie-score");

  function clearBoard() {
    boardButtons.forEach((elem) => {
      elem.textContent = "";
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target.contains(winBox)) {
      winBox.close();
      board.clear();
      clearBoard();
    }
  });

  boardButtons.forEach((elem) => {
    elem.addEventListener("click", (e) => {
      let target = e.target;
      let result = controller.playMove(target);
      if (result !== -1) {
        if (result === 1) {
          winText.textContent = "X WINS";
          +xScore.textContent++;
          winBox.showModal();
        } else if (result === 2) {
          winText.textContent = "O WINS";
          +oScore.textContent++;
          winBox.showModal();
        } else if (result === 3) {
          winText.textContent = "DRAW";
          +tieScore.textContent++;
          winBox.showModal();
        }
      }
    });
  });

  playerButton.addEventListener("click", (e) => {
    if (numPlayers == 1) {
      e.target.parentElement.children[0].src = "images/2player.svg";
      e.target.parentElement.children[1].textContent = "2P";
      numPlayers = 2;
    } else {
      e.target.parentElement.children[0].src = "images/1player.svg";
      e.target.parentElement.children[1].textContent = "1P";
      numPlayers = 1;
    }
  });
})();
