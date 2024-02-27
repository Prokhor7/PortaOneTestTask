import * as fs from "fs";
import * as readline from "readline";

const inputFile = process.argv[2];

if (!inputFile) {
  console.error("Please provide a file path as a command line argument.");
  process.exit(1);
}

function processFile(): void {
  const valueCounts = new Map<number, number>();
  let previousValue: number | undefined = undefined;
  let increasingSequence: number[] = [];
  let longestIncreasingSequence: number[] = [];
  let decreasingSequence: number[] = [];
  let longestDecreasingSequence: number[] = [];
  let max: number;
  let min: number;
  let numberOfvalues = 0;
  let sum = 0;

  const stream = readline.createInterface({
    input: fs.createReadStream(inputFile),
    output: process.stdout,
    terminal: false,
  });
  stream
    .on("line", (line: string) => {
      const num = parseInt(line.trim(), 10);
      if (!isNaN(num)) {
        valueCounts.set(num, (valueCounts.get(num) || 0) + 1);
        if (previousValue !== undefined) {
          if (num > max) {
            max = num;
          }
          if (num < min) {
            min = num;
          }
          if (num > previousValue) {
            decreasingSequence = [];
            increasingSequence.push(num);
            if (increasingSequence.length > longestIncreasingSequence.length) {
              longestIncreasingSequence = increasingSequence;
            }
          } else if (num < previousValue) {
            increasingSequence = [];
            decreasingSequence.push(num);
            if (decreasingSequence.length > longestDecreasingSequence.length) {
              longestDecreasingSequence = decreasingSequence;
            }
          }
        } else {
          max = num;
          min = num;
          increasingSequence.push(num);
          longestIncreasingSequence = increasingSequence;
          decreasingSequence.push(num);
          longestDecreasingSequence = decreasingSequence;
        }
        previousValue = num;
        sum += num;
        numberOfvalues++;
      }
    })
    .on("close", () => {
      if (valueCounts.size === 0) {
        console.log("File is empty.");
      } else {
        console.log(`Max: ${max}`);
        console.log(`Min: ${min}`);
        findMedian(valueCounts);
        const mean = sum / numberOfvalues;
        console.log(`Mean: ${mean}`);
        console.log(
          `Longest increasing Sequence: ${longestIncreasingSequence.join(", ")}`
        );
        console.log(
          `Longest decreasing Sequence: ${longestDecreasingSequence.join(", ")}`
        );
      }
    });
}

function findMedian(valueCounts: Map<number, number>): void {
  const sortedValues = Array.from(valueCounts.keys()).sort((a, b) => a - b);
  const valuesArray: number[] = [];

  sortedValues.forEach((value) => {
    const occurrences = valueCounts.get(value) || 0;
    for (let i = 0; i < occurrences; i++) {
      valuesArray.push(value);
    }
  });

  const middle = Math.floor(valuesArray.length / 2);
  let median: number;

  if (valuesArray.length % 2 === 0) {
    median = (valuesArray[middle - 1] + valuesArray[middle]) / 2;
  } else {
    median = valuesArray[middle];
  }
  console.log(`Median: ${median}`);
}

processFile();
