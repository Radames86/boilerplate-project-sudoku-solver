const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');

suite("Unit Tests", function () {
    suite("Validate puzzle string", function () {
        test("Logic handles a valid puzzle string of 81 character", function () {
            const solver = new SudokuSolver();
            const puzzle =
                "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

            const result = solver.validate(puzzle);

            assert.isTrue(result.valid);
        });

        test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {
            const solver = new SudokuSolver();
            const puzzle =
                "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X";

            const result = solver.validate(puzzle);

            assert.equal(result.error, "Invalid characters in puzzle");
        });

        test("Logic handles a puzzle string that is not 81 characters in length", function () {
            const solver = new SudokuSolver();
            const puzzle =
                "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37";

            const result = solver.validate(puzzle);

            assert.equal(result.error, "Expected puzzle to be 81 characters long");

        })
    })

    suite("check row placement", function () {
        test("Logic handles a valid row placement", function () {
            const solver = new SudokuSolver();
            const puzzle =
                "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            const row = "A";
            const column = 2;
            const value = "3";

            const result = solver.checkRowPlacement(puzzle, row, column, value);

            assert.isTrue(result);

        });

        test("Logic handles an invalid row placement", function () {
            const solver = new SudokuSolver();
            const puzzle =
                "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            const row = "A";
            const column = 2;
            const value = "1";

            const result = solver.checkRowPlacement(puzzle, row, column, value);

            assert.isFalse(result);
        });

    });

    suite("Check column placement", function () {
        test("Logic handles a valid column placement", function () {
            const solver = new SudokuSolver();
            const puzzle =
                "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            const row = "A";
            const column = 2;
            const value = "3";

            const result = solver.checkColPlacement(puzzle, row, column, value);

            assert.isTrue(result);
        });

        test("Logic handles an invalid column placement", function () {
            const solver = new SudokuSolver();
            const puzzle =
                "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            const row = "A";
            const column = 2;
            const value = "6";

            const result = solver.checkColPlacement(puzzle, row, column, value);

            assert.isFalse(result);
        });
    });


    suite("Check region placement", function () {
        test("Logic handles a valid region (3x3 grid) placement", function () {
            const solver = new SudokuSolver();
            const puzzle =
                "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            const row = "8";
            const column = 2;
            const value = "9";

            const result = solver.checkRegionPlacement(puzzle, row, column, value);

            assert.isTrue(result);
        });

        test("Logic handles an invalid region (3x3 grid) placement", function () {
            const solver = new SudokuSolver();
            const puzzle =
                "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            const row = "B";
            const column = 2;
            const value = "1";

            const result = solver.checkRegionPlacement(puzzle, row, column, value);

            assert.isFalse(result);
        });
    });

    suite("Solve puzzle", function () {
        test("Valid puzzle strings pass the solver", function () {
            const solver = new SudokuSolver();
            const puzzle =
                "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

            const result = solver.solve(puzzle);

            assert.isObject(result);
            assert.property(result, "solution");
        });

        test("Invalid puzzle strings fail the solver", function () {
            const solver = new SudokuSolver();
            const puzzle =
                "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X";

            const result = solver.solve(puzzle);

            assert.isObject(result);
            assert.property(result, "error");
        });

        test("Solver returns the expected solution for an incomplete puzzle", function () {
            const solver = new SudokuSolver();

            const puzzle =
                "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
            const expected =
                "769235418851496372432178956174569283395842761628713549283657194516924837947381625";

            const result = solver.solve(puzzle);

            assert.equal(result.solution, expected);
        });
    });





});
