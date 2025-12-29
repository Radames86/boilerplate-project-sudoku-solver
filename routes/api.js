'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();
    
  app.route('/api/solve').post((req, res) => {
    const puzzle = req.body.puzzle;

    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    const validation = solver.validate(puzzle);
    if (validation.error) {
      return res.json({ error: validation.error });
    }

    const solved = solver.solve(puzzle);
    return res.json(solved);
  });

    app.route('/api/check').post((req, res) => {
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: "Required field(s) missing" });
      }

      const validation = solver.validate(puzzle);
      if (validation.error) {
        return res.json({ error: validation.error })
      }

      if (!/^[A-Ia-i][1-9]$/.test(coordinate)) {
        return res.json({ error: "Invalid coordinate" });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: "Invalid value" });
      }

      const row = coordinate[0].toUpperCase();
      const column = parseInt(coordinate[1], 10);

      const rowIndex = row.charCodeAt(0) - 65;
      const colIndex = column - 1;
      const index = rowIndex * 9 + colIndex;

      const puzzleArr = puzzle.split("");
      puzzleArr[index] = value;
      const newPuzzle = puzzleArr.join("");

      const conflicts = [];

      if (!solver.checkRowPlacement(newPuzzle, row, column, value)) {
        conflicts.push("row");
      }

      if (!solver.checkColPlacement(newPuzzle, row, column, value)) {
        conflicts.push("column");
      }

      if (!solver.checkRegionPlacement(newPuzzle, row, column, value)) {
        conflicts.push("region");
      }

      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }

      return res.json({ valid: true });
    });
};
