import fs from "fs";

// const FILE_PATH = './src/resources/04_example.txt'
const FILE_PATH = "./src/resources/04.txt";

export default async function (): Promise<void> {
    const lines = fs.readFileSync(FILE_PATH, "utf-8").trim().split("\n");
}
