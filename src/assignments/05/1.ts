import fs from "fs";

// const FILE_PATH = './src/resources/05_example.txt'
const FILE_PATH = "./src/resources/05.txt";

export default async function (): Promise<void> {
    const lines = fs.readFileSync(FILE_PATH, "utf-8").trim().split("\n");
}
