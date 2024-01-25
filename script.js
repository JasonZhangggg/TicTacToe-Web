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
    board[row][col] = piece;
  }

  function isValid(row, col) {
    return board[row][col] === ".";
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

  function getMoves() {
    let moves = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (isValid(row, col)) {
          moves.push([row, col]);
        }
      }
    }
    return moves;
  }

  function isEmpty() {
    return board.every((row) => row.every((cell) => cell === "."));
  }

  return { isValid, placePiece, checkWin, checkDraw, clear, isEmpty, getMoves };
})();

/**
 * Game Controller
 *
 *
 */
const controller = (function gameController() {
  let xTurn = true;
  let starter = "x";

  function playMove(row, col) {
    const symbol = xTurn ? "x" : "o";
    board.placePiece(row, col, symbol);
    if (board.checkWin("x")) {
      return 1;
    } else if (board.checkWin("o")) {
      return 2;
    } else if (board.checkDraw()) {
      return 3;
    }
    return 0;
  }

  function minmax(depth, isCompTurn) {
    if (board.checkWin("o")) {
      return depth + 10;
    } else if (board.checkWin("x")) {
      return depth - 10;
    } else if (board.checkDraw()) {
      return 0;
    }
    const symbol = isCompTurn ? "o" : "x";
    let bestScore = isCompTurn
      ? Number.MIN_SAFE_INTEGER
      : Number.MAX_SAFE_INTEGER;
    board.getMoves().forEach((move) => {
      const row = move[0];
      const col = move[1];
      board.placePiece(row, col, symbol);
      let score = minmax(depth + 1, !isCompTurn);
      board.placePiece(row, col, ".");

      bestScore = isCompTurn
        ? Math.max(bestScore, score)
        : Math.min(bestScore, score);
    });
    return bestScore;
  }

  function findBestMove() {
    let bestRow;
    let bestCol;
    let bestScore = Number.MIN_SAFE_INTEGER;
    board.getMoves().forEach((move) => {
      const row = move[0];
      const col = move[1];
      board.placePiece(row, col, "o");
      let newScore = minmax(0, false);
      board.placePiece(row, col, ".");
      if (newScore > bestScore) {
        bestRow = row;
        bestCol = col;
        bestScore = newScore;
      }
    });
    return [bestRow, bestCol];
  }

  function getTurn() {
    return xTurn;
  }

  function setTurn(turn) {
    xTurn = turn;
  }

  function flipStarter() {
    if (starter === "x") {
      xTurn = false;
      starter = "o";
    } else {
      xTurn = true;
      starter = "x";
    }
  }
  return { playMove, setTurn, getTurn, flipStarter, findBestMove };
})();

(function eventController() {
  const xSymbol = "✖";
  const oSymbol = "Ｏ";

  let numPlayers = 1;

  const boardButtons = document.querySelectorAll(".board > button");
  const playerButton = document.querySelector(".playerButton");

  const winBox = document.querySelector("dialog");
  const winText = document.querySelector(".winner");

  const xScore = document.querySelector("#x-score");
  const oScore = document.querySelector("#o-score");
  const tieScore = document.querySelector("#tie-score");

  const player2Name = document.querySelector("#player2Name");
  const playerIcon = document.querySelector(".players");
  const numPlayerText = document.querySelector(".numPlayers");

  function clearBoard() {
    boardButtons.forEach((elem) => {
      elem.textContent = "";
    });
  }

  function playCompMove() {
    let moves = controller.findBestMove();
    let compRow = moves[0];
    let compCol = moves[1];
    console.log(compRow, compCol);
    let result = controller.playMove(compRow, compCol);
    boardButtons[compCol + compRow * 3].textContent = oSymbol;
    controller.setTurn(!controller.getTurn());
    displayResult(result);
    return result;
  }

  function displayResult(result) {
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
  document.addEventListener("click", (e) => {
    if (e.target.contains(winBox)) {
      winBox.close();
      board.clear();
      clearBoard();
      controller.flipStarter();
      if (!controller.getTurn() && numPlayers === 1) {
        playCompMove();
      }
    }
  });

  boardButtons.forEach((elem) => {
    elem.addEventListener("click", (e) => {
      let target = e.target;
      let row = target.id[0];
      let col = target.id[1];
      if (board.isValid(row, col)) {
        let result = controller.playMove(row, col);
        target.textContent = controller.getTurn() ? xSymbol : oSymbol;
        controller.setTurn(!controller.getTurn());
        displayResult(result);
        if (result === 0 && !controller.getTurn() && numPlayers === 1) {
          result = playCompMove();
        }
      }
    });
  });

  playerButton.addEventListener("click", (e) => {
    if (!board.isEmpty()) {
      board.clear();
      clearBoard();
      controller.setTurn(true);
    }
    if (numPlayers == 1) {
      playerIcon.src = "images/2player.svg";
      numPlayerText.textContent = "2P";
      player2Name.textContent = "PLAYER(O)";
      numPlayers = 2;
    } else {
      playerIcon.src = "images/1player.svg";
      numPlayerText.textContent = "1P";
      player2Name.textContent = "COMPUTER(O)";
      numPlayers = 1;
    }
    xScore.textContent = 0;
    oScore.textContent = 0;
  });
})();
