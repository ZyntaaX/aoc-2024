import fs from "fs";

// const FILE_PATH = "./src/resources/01_example.txt";
const FILE_PATH = "./src/resources/01.txt";

export default async function (): Promise<void> {
    const lines = fs.readFileSync(FILE_PATH, "utf-8").trim().split("\n");

    let listLeft: number[] = [];
    let listRight: number[] = [];

    lines.forEach((line) => {
        const [left, right] = line.split(/\s+/);
        listLeft.push(parseInt(left));
        listRight.push(parseInt(right));
    });

    listLeft = listLeft.sort((a, b) => a - b);
    listRight = listRight.sort((a, b) => a - b);

    let total = 0;
    for (let i = 0; i < listLeft.length; i++) {
        total += Math.abs(listRight[i] - listLeft[i]);
    }

    console.log("Total is: ", total);
}
