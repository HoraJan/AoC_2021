export * as day01 from './01';
export * as day02 from './02';
export * as day03 from './03';
export * as day04 from './04';
export * as day05 from './05';
export * as day06 from './06';
export * as day07 from './07';
export * as day08 from './08';

export interface Test {
    input: string
    results: {
        first?: number
        second?: number
    }
}

export interface Day {
    tests: Test[]
    input: string
    first(input: string): number
    second(input: string): number
}
