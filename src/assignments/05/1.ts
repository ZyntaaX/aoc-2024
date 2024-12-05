import fs from "fs";

// const FILE_PATH = "./src/resources/05_example.txt";
const FILE_PATH = "./src/resources/05.txt";

type Page = {
    x: number;
    y: number;
};

type Update = number[];

export default async function (): Promise<void> {
    const lines = fs.readFileSync(FILE_PATH, "utf-8").trim().split("\n");

    const pages: Page[] = [];
    const updates: Update[] = [];

    lines.forEach((line) => {
        if (line.includes("|")) {
            const [x, y] = line.split("|");
            pages.push({ x: parseInt(x), y: parseInt(y) });
        } else {
            const update: Update = [];
            line.split(",").forEach((n) => {
                const num = parseInt(n);
                if (!isNaN(num)) update.push(num);
            });
            if (update.length) updates.push(update);
        }
    });

    const correctUpdates = findCorrectUpdates(updates, pages);

    let total = 0;
    correctUpdates.forEach((update) => {
        const midIx = Math.floor(update.length / 2);
        total += update[midIx];
    });

    console.log(total);
}

function findCorrectUpdates(updates: Update[], pages: Page[]): Update[] {
    const correctUpdates: Update[] = [];

    updates.forEach((update) => {
        let isCorrect = true;
        update.forEach((instruction, index) => {
            for (let i = index + 1; i < update.length; i++) {
                if (
                    !pages.find((p) => p.x === instruction && p.y === update[i])
                ) {
                    isCorrect = false;
                }
            }

            for (let i = index - 1; i >= update.length; i--) {
                if (
                    !pages.find((p) => p.x === update[i] && p.y === instruction)
                ) {
                    isCorrect = false;
                }
            }
        });
        if (isCorrect) {
            correctUpdates.push(update);
        }
    });

    return correctUpdates;
}
