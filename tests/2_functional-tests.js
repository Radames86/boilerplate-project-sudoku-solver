const chai = require("chai");
const chaiHttp = require('chai-http');

const server = require('../server');

const assert = chai.assert;
chai.use(chaiHttp);

suite('Functional Tests', function () {
    const validPuzzle =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const validSolution =
        "769235418851496372432178956174569283395842761628713549283657194516924837947381625";

    suite("POST /api/solve", function () {
        test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
            chai
                .request(server)
                .post("/api/solve")
                .send({ puzzle: validPuzzle })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, "solution");
                    assert.equal(res.body.solution, validSolution);
                    done();
                });
        });

        test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
            chai
                .request(server)
                .post("/api/solve")
                .send({})
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: "Required field missing" });
                    done();
                });
        });

        test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
            chai
                .request(server)
                .post("/api/solve")
                .send({ puzzle: validPuzzle.slice(0, 80) + "X" })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
                    done();
                });
        });

        test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
            chai
                .request(server)
                .post("/api/solve")
                .send({ puzzle: validPuzzle.slice(0, 80) })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: "Expected puzzle to be 81 characters long" });
                    done();
                });
        });

        test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
            const unsolvable =
                "9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

            chai
                .request(server)
                .post("/api/solve")
                .send({ puzzle: unsolvable })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: "Puzzle cannot be solved" });
                    done();
                });
        });
    });

    suite("POST /api/check", function () {
        test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({ puzzle: validPuzzle, coordinate: "A2", value: "6" })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { valid: true });
                done();
              });
        });

        test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({ puzzle: validPuzzle, coordinate: "A2", value: "1" })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isFalse(res.body.valid);
                assert.deepEqual(res.body.conflict, ["row"]);
                done();
              });
        });

        test("Check a puzzle with multiple placement conflicts: POST request to /api/check", function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({ puzzle: validPuzzle, coordinate: "B2", value: "9" })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isFalse(res.body.valid);
                assert.include(res.body.conflict, "column");
                assert.include(res.body.conflict, "region");
                done();
              });
        });

        test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({ puzzle: validPuzzle, coordinate: "A2", value: "5" })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isFalse(res.body.valid);
                assert.include(res.body.conflict, "row");
                assert.include(res.body.conflict, "column");
                assert.include(res.body.conflict, "region");
                done();
              });
        });

        test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({ puzzle: validPuzzle, coordinate: "A2" })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: "Required field(s) missing" });
                done();
              });
        });

        test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({ puzzle: validPuzzle.slice(0, 80) + "X", coordinate: "A2", value: "3" })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
                done();
              });
        });

        test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
            chai
                .request(server)
                .post("/api/check")
                .send({ puzzle: validPuzzle.slice(0, 80), coordinate: "A2", value: "3" })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: "Expected puzzle to be 81 characters long" });
                    done();
                });
        });

        test("Check a puzzle with invalid placement coordinate: POST request to /api/check", function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({ puzzle: validPuzzle, coordinate: "Z9", value: "3" })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: "Invalid coordinate" });
                done();
              });
        });

        test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({ puzzle: validPuzzle, coordinate: "A2", value: "0" })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: "Invalid value" });
                done();
              });
        });
    });


});

