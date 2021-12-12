import * as days from './days';
import { Day } from './days';

const green = '\x1b[32m%s\x1b[0m';
const red = '\x1b[31m%s\x1b[0m';
const yellow = '\x1b[33m%s\x1b[0m';
const parts = ['first', 'second'];

const solveDay = ([regex, day]: [string, Day]) => {
  parts.forEach((part) => {
    day.tests.forEach((test, index) => {
      if (!test.results[part]) return;
      const result = day[part](test.input);

      if (test.results[part] === result) {
        console.log(green, `✓ test ${index} ${part} part should be ${test.results[part]}`);
        return;
      }

      console.log(red, `𐄂 test ${index} ${part} part should be ${test.results[part]} and is ${result}`);
      throw new Error(`error in ${part} part`);
    });
    console.log('=======');
    console.log(`result ${part} part is:`);
    console.time(`${regex}-${part}`)
    console.log(green, day[part](day.input));
    console.timeEnd(`${regex}-${part}`)
    console.log('       ');
  });
}

const solve = () => {
  const [, , regex] = process.argv;
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
  // console.log(err)
}