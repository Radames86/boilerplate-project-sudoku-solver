class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) {
      return { error: "Required field missing" };
    }

    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }

    const validChars = /^[1-9.]+$/;

    if (!validChars.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }

    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    const start = rowIndex * 9;
    const rowString = puzzleString.slice(start, start + 9);

    for (let i = 0; i < 9; i++) {
      const currentCol = i + 1;
      const cell = rowString[i];

      if (currentCol === column) {
        continue;
      }

      if (cell === value) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const rowIndex = row.toUpperCase().charCodeAt(0) - 65;

    for (let r = 0; r < 9; r++) {
      const currentRow = r;
      const index = r * 9 + (column - 1);
      const cell = puzzleString[index];

      if (currentRow === rowIndex) {
        continue;
      }

      if (cell === value) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    const colIndex = column - 1;

    const regionRowStart = Math.floor(rowIndex / 3) * 3;
    const regionColStart = Math.floor(colIndex / 3) * 3;

    for (let r = regionRowStart; r < regionRowStart + 3; r++) {
      for (let c = regionColStart; c < regionColStart + 3; c++) {
        const index = r * 9 + c;
        const cell = puzzleString[index];

        if (r === rowIndex && c === colIndex) {
          continue;
        }

        if (cell === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (validation.error) {
      return { error: validation.error };
    }

    const board = puzzleString.split("");

    const getRowLetter = (rowIndex) => String.fromCharCode(65 + rowIndex);

    const isValidPlacement = (rowIndex, colIndex, val) => {
      const rowLetter = getRowLetter(rowIndex);
      const column = colIndex + 1;

      return (
        this.checkRowPlacement(board.join(""), rowLetter, column, val) &&
        this.checkColPlacement(board.join(""),rowLetter, column, val) &&
        this.checkRegionPlacement(board.join(""), rowLetter, column, val)
      );
    };

    const findEmptyIndex = () => board.indexOf(".");

    const solveBacktrack = () => {
      const emptyIndex = findEmptyIndex();
      if (emptyIndex === -1) {
        return true;
      }

      const rowIndex = Math.floor(emptyIndex / 9);
      const colIndex = emptyIndex % 9;

      for (let n = 1; n <= 9; n++) {
        const val = String(n);

        if (isValidPlacement(rowIndex, colIndex, val)) {
          board[emptyIndex] = val;

          if (solveBacktrack()) {
            return true;
          }

          board[emptyIndex] = ".";
        }
      }

      return false;
    };

    const solved = solveBacktrack();

    if (!solved) {
      return { error: "Puzzle cannot be solved" };
    }
    return { solution: board.join("") };
  }
}

module.exports = SudokuSolver;

