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
    const possibleLoopObstructions = findObstructionPositions(
        map,
        startPosition,
        direction
    );

    // Count distinct positions visited
    console.log(possibleLoopObstructions.size);
}

function findObstructionPositions(
    map: Map,
    start: Coord,
    startDirection: string
): Set<string> {
    const validPositions = new Set<string>();

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            // Skip if it's an obstacle or the starting position
            if (
                map[y][x] === OBSTACLE_SYMBOL ||
                (x === start.x && y === start.y)
            ) {
                continue;
            }

            // Clone the map and add an obstruction
            const clonedMap = map.map((row) => [...row]);
            clonedMap[y][x] = OBSTACLE_SYMBOL;

            // Check if adding the obstruction causes a loop
            if (doesObstructionCauseLoop(clonedMap, start, startDirection)) {
                validPositions.add(`${x},${y}`);
            }
        }
    }

    return validPositions;
}

function doesObstructionCauseLoop(
    map: Map,
    start: Coord,
    startDirection: string
): boolean {
    const visitedStates = new Set<string>();
    let current = { ...start };
    let direction = startDirection;

    while (true) {
        const stateKey = `${current.x},${current.y},${direction}`;
        if (visitedStates.has(stateKey)) {
            return true; // Loop detected
        }

        visitedStates.add(stateKey);

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
            return false; // Guard leaves the map, no loop
        }

        // Check if the next position is an obstacle
        if (map[next.y][next.x] === OBSTACLE_SYMBOL) {
            // Turn right: cycle to the next direction
            const directions = Object.keys(DIRECTIONS);
            const currentIndex = directions.indexOf(direction);
            direction = directions[(currentIndex + 1) % directions.length];
        } else {
            // Move forward
            current = next;
        }
    }
}
