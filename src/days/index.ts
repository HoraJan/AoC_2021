export * as day01 from './01';
export * as day02 from './02';
export * as day03 from './03';
export * as day04 from './04';
export * as day05 from './05';
export * as day06 from './06';
export * as day07 from './07';
export * as day08 from './08';
export * as day09 from './09';
export * as day10 from './10';
export * as day11 from './11';
export * as day12 from './12';
export * as day13 from './13';
export * as day14 from './14';
export * as day15 from './15';
export * as day16 from './16';
export * as day17 from './17';
export * as day18 from './18';

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
