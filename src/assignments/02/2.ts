import fs from "fs";

// const FILE_PATH = "./src/resources/02_example.txt";
const FILE_PATH = "./src/resources/02.txt";

type DecOrInc = "DEC" | "INC";

export default async function (): Promise<void> {
    const reports = fs.readFileSync(FILE_PATH, "utf-8").trim().split("\n");

    let noOfSafeReports = 0;
    reports.forEach((report) => {
        if (
            isReportSafe(
                report.split(" ").map((level) => parseInt(level)),
                true
            )
        ) {
            noOfSafeReports++;
        }
    });

    console.log("Safe reports: ", noOfSafeReports);
}

function isReportSafe(report: number[], firstCheck: boolean): boolean {
    let isSafe: boolean = true;
    let incOrDec: DecOrInc = report[0] > report[1] ? "DEC" : "INC";

    report.forEach((level, index) => {
        if (!isSafe) {
            return;
        }

        if (
            (incOrDec === "INC" &&
                index < report.length - 1 &&
                level > report[index + 1]) ||
            (incOrDec === "DEC" &&
                index < report.length - 1 &&
                level < report[index + 1])
        ) {
            isSafe = false;
            return;
        }

        if (index < report.length - 1) {
            const adjacent = report[index + 1];
            const diff = Math.abs(level - adjacent);
            if (diff < 1 || diff > 3) {
                isSafe = false;
                return;
            }
        }
    });

    if (!isSafe && firstCheck) {
        const safeWithDampener = report.some((_, index) => {
            const newReport = [...report];
            newReport.splice(index, 1);

            if (isReportSafe(newReport, false)) {
                return true;
            }
        });

        return safeWithDampener;
    }

    return isSafe;
}
