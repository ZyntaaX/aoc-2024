import fs from "fs";

// const FILE_PATH = "./src/resources/05_example.txt";
const FILE_PATH = "./src/resources/05.txt";

type RuleSet = {
    x: number;
    y: number;
};

type Update = number[];

export default async function (): Promise<void> {
    const lines = fs.readFileSync(FILE_PATH, "utf-8").trim().split("\n");

    const rules: RuleSet[] = [];
    const updates: Update[] = [];

    lines.forEach((line) => {
        if (line.includes("|")) {
            const [x, y] = line.split("|");
            rules.push({ x: parseInt(x), y: parseInt(y) });
        } else {
            const update: Update = [];
            line.split(",").forEach((n) => {
                const num = parseInt(n);
                if (!isNaN(num)) update.push(num);
            });
            if (update.length) updates.push(update);
        }
    });

    const badUpdates = findBadUpdates(updates, rules);

    const correctUpdates = topologicalSort(badUpdates, rules);

    let total = 0;
    correctUpdates.forEach((update) => {
        const midIx = Math.floor(update.length / 2);
        total += update[midIx];
    });

    console.log(total);
}

function findBadUpdates(updates: Update[], rules: RuleSet[]): Update[] {
    const badUpdates: Update[] = [];

    updates.forEach((update) => {
        if (!isUpdateCorrect(update, rules)) {
            badUpdates.push(update);
        }
    });

    return badUpdates;
}

function isUpdateCorrect(update: Update, rules: RuleSet[]): boolean {
    let isCorrect = true;
    update.forEach((instruction, index) => {
        for (let i = index + 1; i < update.length; i++) {
            if (!rules.find((p) => p.x === instruction && p.y === update[i])) {
                isCorrect = false;
            }
        }

        for (let i = index - 1; i >= update.length; i--) {
            if (!rules.find((p) => p.x === update[i] && p.y === instruction)) {
                isCorrect = false;
            }
        }
    });

    return isCorrect;
}

// Kahn's Algorithm
function topologicalSort(updates: Update[], rules: RuleSet[]): Update[] {
    const fixedUpdates: Update[] = [];

    updates.forEach((update) => {
        const graph: { [key: number]: number[] } = {};
        const inDegree: { [key: number]: number } = {};

        // Initialize graph and in-degree for the current update
        update.forEach((rule) => {
            graph[rule] = [];
            inDegree[rule] = 0;
        });

        // Build the graph for this update using the rules
        rules.forEach(({ x, y }) => {
            if (update.includes(x) && update.includes(y)) {
                graph[x].push(y);
                inDegree[y] += 1;
            }
        });

        // Topological sort using Kahn's Algorithm
        const sorted: number[] = [];
        const queue: number[] = [];

        // Add nodes with in-degree 0 to the queue
        Object.keys(inDegree).forEach((key) => {
            if (inDegree[parseInt(key)] === 0) {
                queue.push(parseInt(key));
            }
        });

        while (queue.length > 0) {
            const node = queue.shift()!;
            sorted.push(node);

            graph[node].forEach((neighbor) => {
                inDegree[neighbor] -= 1;
                if (inDegree[neighbor] === 0) {
                    queue.push(neighbor);
                }
            });
        }

        if (sorted.length !== update.length) {
            throw new Error("Cycle detected in update rules!");
        }

        fixedUpdates.push(sorted);
    });

    return fixedUpdates;
}
