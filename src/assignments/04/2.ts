import fs from "fs";

// const FILE_PATH = "./src/resources/04_example.txt";
const FILE_PATH = "./src/resources/04.txt";

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
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;

    for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
            if (grid[y][x] === "A" && findWord(y, x, rows, cols, grid)) {
                count++;
            }
        }
    }

    return count;
}

function findWord(
    y: number,
    x: number,
    rows: number,
    cols: number,
    grid: Grid
): boolean {
    if (!isValidPosition(y, x, rows, cols)) return false;

    const word1: string = grid[y - 1][x - 1] + grid[y][x] + grid[y + 1][x + 1];
    const word2: string = grid[y - 1][x + 1] + grid[y][x] + grid[y + 1][x - 1];

    return (
        (word1 === "SAM" || word1 === "MAS") &&
        (word2 === "SAM" || word2 === "MAS")
    );
}

function isValidPosition(
    y: number,
    x: number,
    rows: number,
    cols: number
): boolean {
    const directions = [
        [1, 1], // Down-right diagonal
        [1, -1], // Down-left diagonal
        [-1, 1], // Up-right diagonal
        [-1, -1], // Up-left diagonal
    ];

    for (const [dy, dx] of directions) {
        const ny = y + dy;
        const nx = x + dx;

        if (ny < 0 || ny >= rows || nx < 0 || nx >= cols) {
            return false;
        }
    }
    return true;
}
