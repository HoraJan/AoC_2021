export * as day01 from './01'

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
    first: (input: string) => number
    second: (input: string) => number
}