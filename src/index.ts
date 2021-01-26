import "./style.css";

const appElement = document.getElementById("app");
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("game-status");
const ROW_COUNT = 3;
const COL_COUNT = 3;

type Players = "X" | "O";
type Cell = Players | "";
type Winner = Cell | undefined;

type TicTacToeBoard = [
  [Cell, Cell, Cell],
  [Cell, Cell, Cell],
  [Cell, Cell, Cell]
];
let boardState: TicTacToeBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
let currentMove: Players = "X";
let winner: Winner;
let draw: boolean = false;

function createCell(
  row: number,
  col: number,
  content: Cell = ""
): HTMLButtonElement {
  const cell = document.createElement("button");
  cell.setAttribute("data-row", row.toString());
  cell.setAttribute("data-col", col.toString());
  cell.setAttribute("data-content", content);
  cell.classList.add("cell");
  cell.addEventListener("click", () => {
    if (boardState[row][col] === "" && !winner && !draw) {
      boardState[row][col] = currentMove;
      currentMove = currentMove === "X" ? "O" : "X";
      renderBoard();
    }
  });
  return cell;
}

function checkRowWinner(rowNumber: number): boolean {
  return (
    boardState[rowNumber][0] !== "" &&
    boardState[rowNumber][0] === boardState[rowNumber][1] &&
    boardState[rowNumber][1] === boardState[rowNumber][2]
  );
}

function checkColumnWinner(colNumber: number): boolean {
  return (
    boardState[0][colNumber] !== "" &&
    boardState[0][colNumber] === boardState[1][colNumber] &&
    boardState[1][colNumber] === boardState[2][colNumber]
  );
}

function checkDiagonalWinner(): Winner {
  if (
    boardState[0][0] !== "" &&
    boardState[0][0] === boardState[1][1] &&
    boardState[1][1] === boardState[2][2]
  ) {
    return boardState[0][0];
  }
  if (
    boardState[0][2] !== "" &&
    boardState[0][2] === boardState[1][1] &&
    boardState[1][1] === boardState[2][0]
  ) {
    return boardState[0][2];
  }
}

function getGameStatus(): string {
  if (winner) {
    return `${winner} wins!` as const;
  } else if (draw) {
    return "Draw";
  }
  let potentialDraw: boolean = true;
  for (let i = 0; i < ROW_COUNT; i++) {
    if (
      boardState[i][0] === "" ||
      boardState[i][1] === "" ||
      boardState[i][2] === ""
    ) {
      potentialDraw = false;
    }
    if (checkRowWinner(i)) {
      winner = boardState[i][0];
      return `${winner} wins!`;
    }
    if (checkColumnWinner(i)) {
      winner = boardState[0][i];
      return `${winner} wins!`;
    }
  }
  const diagonalWinner: Winner = checkDiagonalWinner();
  if (diagonalWinner) {
    console.log(107);
    winner = diagonalWinner;
    return `${diagonalWinner} wins!` as const;
  }

  if (potentialDraw) {
    draw = true;
    return "Draw";
  }
  return "";
}

function renderBoard(): void {
  if (!appElement) throw new Error("Cannot find app");
  if (!boardElement) throw new Error("Cannot find board");
  if (!statusElement) throw new Error("Cannot find status");
  boardElement.innerHTML = "";
  statusElement.innerText = getGameStatus();
  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COL_COUNT; j++) {
      boardElement.appendChild(createCell(i, j, boardState[i][j]));
    }
  }
  const oldMoveElement = document.getElementById("move-element");
  if (oldMoveElement) {
    oldMoveElement.remove();
  }
  const moveElement = document.createElement("p");
  moveElement.id = "move-element";
  moveElement.innerText = `Next Move: ${currentMove}`;
  moveElement.classList.add("current-move");
  appElement.insertBefore(moveElement, document.getElementById("reset"));
}

function init(): void {
  const resetButton = document.getElementById("reset");
  if (!resetButton) throw new Error("No Reset button");
  // if (!statusElement) throw new Error("No status element");
  resetButton.addEventListener("click", () => {
    boardState = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    currentMove = "X";
    winner = undefined;
    draw = false;
    renderBoard();
  });
  renderBoard();
}

init();
