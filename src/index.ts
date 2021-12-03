import * as days from './days';
import { Day } from './days';

const green = '\x1b[32m%s\x1b[0m';
const red = '\x1b[31m%s\x1b[0m';
const parts = ['first', 'second'];

try {
    const [, , regex] = process.argv;
    if (!regex) throw new Error('you should select single day!');

    const day: Day = days[`day${regex}`];
    if (!day) throw new Error('day not found!');

    parts.forEach((part) => {
        day.tests.forEach((test, index) => {
            if (!test.results[part]) return;
            const result = day[part](test.input)

            if (test.results[part] === result) {
                console.log(green, `✓ test ${index} ${part} part should be ${test.results[part]}`);
                return;
            }

            console.log(red, `𐄂 test ${index} ${part} part should be ${test.results[part]} and is ${result}`);
            throw new Error(`error in ${part} part`);
        });
        console.log('=======');
        console.log(`result ${part} part is:`);
        console.log(green, day[part](day.input));
        console.log('       ');
    });
} catch (err) {
    console.error(red, err.message);
}
