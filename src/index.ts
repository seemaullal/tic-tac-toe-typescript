import "./style.css";

const appElement = document.getElementById("app");
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("game-status");
const ROW_COUNT = 3;
const COL_COUNT = 3;

type Players = "X" | "O";
type Cell = Players | "";

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
let winner: Cell | undefined;
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

function getGameStatus(): string {
  if (winner) {
    return `${winner} wins!`;
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
    } else if (
      boardState[i][0] === boardState[i][1] &&
      boardState[i][1] === boardState[i][2]
    ) {
      winner = boardState[i][0];
      return `${winner} wins!`;
    }
    if (
      boardState[0][i] !== "" &&
      boardState[0][i] === boardState[1][i] &&
      boardState[1][i] === boardState[2][i]
    ) {
      console.log("here");
      winner = boardState[0][i];
      return `${winner} wins!`;
    }
  }

  if (
    boardState[0][0] !== "" &&
    boardState[0][0] === boardState[1][1] &&
    boardState[1][1] === boardState[2][2]
  ) {
    winner = boardState[0][0];
    return `${winner} wins!`;
  }
  if (
    boardState[0][2] !== "" &&
    boardState[0][2] === boardState[1][1] &&
    boardState[1][1] === boardState[2][0]
  ) {
    winner = boardState[0][2];
    return `${winner} wins!`;
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
