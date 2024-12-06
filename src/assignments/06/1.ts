import fs from "fs";

// const FILE_PATH = "./src/resources/06_example.txt";
const FILE_PATH = "./src/resources/06.txt";

// prettier-ignore
const DIRECTIONS: { [key: string]: number[] } = {
    "^": [-1, 0], // UP
    ">": [0, 1],  // RIGHT
    "V": [1, 0],  // DOWN
    "<": [0, -1], // LEFT
};

const OBSTACLE_SYMBOL = "#";
const VISITED_SYMBOL = "X";

type Map = Array<Array<string>>;

type Coord = { x: number; y: number };

export default async function (): Promise<void> {
    const map: Map = fs
        .readFileSync(FILE_PATH, "utf-8")
        .trim()
        .split("\n")
        .map((row) => row.split(""));

    // Locate the starting position
    let startPosition: Coord = { x: NaN, y: NaN };
    let direction = "^";
    map.forEach((row, y) => {
        row.forEach((char, x) => {
            if (DIRECTIONS[char]) {
                startPosition = { x, y };
                direction = char; // Capture the initial direction
            }
        });
    });

    // Predict guard's path
    const visitedPositions = predictPath(map, startPosition, direction);

    // Count distinct positions visited
    console.log(visitedPositions.size);
}

function predictPath(
    map: Map,
    start: Coord,
    startDirection: string
): Set<string> {
    const visited = new Set<string>();
    let current = { ...start };
    let direction = startDirection;

    while (true) {
        const posKey = `${current.x},${current.y}`;
        visited.add(posKey);

        // Calculate the next position
        const [dy, dx] = DIRECTIONS[direction];
        const next = { x: current.x + dx, y: current.y + dy };

        // Check if the guard is leaving the map
        if (
            next.y < 0 ||
            next.y >= map.length ||
            next.x < 0 ||
            next.x >= map[next.y].length
        ) {
            break;
        }

        // Check if the next position is an obstacle
        if (map[next.y][next.x] === OBSTACLE_SYMBOL) {
            // Turn 90 degrees: cycle to the next direction
            const directions = Object.keys(DIRECTIONS);
            const currentIndex = directions.indexOf(direction);
            direction = directions[(currentIndex + 1) % directions.length];
        } else {
            // Mark the current position as visited and move forward
            map[current.y][current.x] = VISITED_SYMBOL;
            current = next;
        }
    }

    return visited;
}
