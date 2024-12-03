import fs from "fs";

// const FILE_PATH = "./src/resources/03_example.txt";
const FILE_PATH = "./src/resources/03.txt";

export default async function (): Promise<void> {
    const input = fs.readFileSync(FILE_PATH, "utf-8");

    // Define the regex pattern for mul(x, y)
    const regex = /mul\((\d+),\s*(\d+)\)/g;

    const matches = [...input.matchAll(regex)];

    // Extract the full matches
    const results = matches.map((match) => match[0]);

    let sum = 0;
    results.forEach((res) => {
        const split1 = res.split("mul(")[1];
        const split2 = split1.split(")")[0];

        const [val1, val2] = split2.split(",");

        sum += parseInt(val1) * parseInt(val2);
    });

    console.log("Sum: ", sum);
}
