import fs from "fs";

// const FILE_PATH = "./src/resources/04_example.txt";
const FILE_PATH = "./src/resources/04.txt";

const SEARCH_PHRASE = "XMAS";

type Grid = Array<Array<string>>;

export default function () {
    const inputGrid: Grid = fs
        .readFileSync(FILE_PATH, "utf-8")
        .trim()
        .split("\n")
        .map((row) => row.split(""));

    console.log(countWords(inputGrid));
}

function countWords(grid: Grid): number {
    const directions = [
        [0, 1], // Right
        [1, 0], // Down
        [0, -1], // Left
        [-1, 0], // Up
        [1, 1], // Down-right diagonal
        [1, -1], // Down-left diagonal
        [-1, 1], // Up-right diagonal
        [-1, -1], // Up-left diagonal
    ];

    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            for (const [dy, dx] of directions) {
                if (
                    grid[y][x] === "X" &&
                    findWord(y, x, dy, dx, rows, cols, grid)
                ) {
                    count++;
                }
            }
        }
    }

    return count;
}

function findWord(
    y: number,
    x: number,
    dy: number,
    dx: number,
    rows: number,
    cols: number,
    grid: Grid
): boolean {
    for (let i = 1; i < SEARCH_PHRASE.length; i++) {
        const ny = y + i * dy;
        const nx = x + i * dx;
        if (
            !isValidPosition(ny, nx, rows, cols) ||
            grid[ny][nx] !== SEARCH_PHRASE[i]
        ) {
            return false;
        }
    }
    return true;
}

function isValidPosition(
    y: number,
    x: number,
    rows: number,
    cols: number
): boolean {
    return y >= 0 && y < rows && x >= 0 && x < cols;
}
