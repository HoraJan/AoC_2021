import { performance } from 'perf_hooks';

import * as days from './days';
import { Day } from './days';

const green = '\x1b[32m%s\x1b[0m';
const red = '\x1b[31m%s\x1b[0m';
const yellow = '\x1b[33m%s\x1b[0m';
const parts = ['first', 'second'];
const greenTest = '%s\x1b[32m%s\x1b[0m%s';

const [, , ...args] = process.argv;
const test = !args.find(arg => arg.startsWith('--skipTest'))

const solveDay = ([regex, day]: [string, Day]) => {
  parts.forEach((part) => {
    if (test) day.tests.forEach((test, index) => {
      if (!test.results[part] && test.results[part] !== 0) return;
      const result = day[part](test.input);

      if (test.results[part] === result) {
        console.log('       ');
        console.log(green, `✓ test ${index} ${part} part should be ${test.results[part]}`);
        console.log('=======');
        return;
      }

      console.log(red, `𐄂 test ${index} ${part} part should be ${test.results[part]} and is ${result}`);
      throw new Error(`error in ${part} part`);
    });

    const startTime = performance.now()
    const result = day[part](day.input)
    const endTime = performance.now()
    console.log(greenTest, `day ${regex} ${part} part is: `, result, ` and took ${Math.floor(endTime - startTime)} ms`);
  });
  console.log('       ');
}

const solve = () => {
  const [, regex] = args.find(arg => arg.startsWith('--day'))?.split('=') || []
  const day: Day = days[`day${regex}`];

  if (!day) {
    console.log(yellow, 'day not found, solving everything!')
    Object.entries(days).forEach(solveDay)
    return
  }

  solveDay([regex, day])
}

try {
  solve()
} catch (err) {
  console.error(red, err.message);
  console.log(err)
}