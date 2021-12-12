import { Test } from '.';
const START = 'start'
const END = 'end'

const findRepeat = (caves: string[], possibleRepeat?: boolean) => {
  const smallCaves = caves.filter(cave => cave !== END && cave !== START && cave[0].match(/[a-z]/))
  const exists = {}

  const doubles = smallCaves.reduce((acc: number, cave: string) => {
    if (exists[cave])
      return acc + 1

    exists[cave] = 1
    return acc
  }, 0)

  return possibleRepeat ? doubles > 1 : doubles > 0
}

const isWayPossible = (way: string[], finishedWays: string[][], possibleRepeat?: boolean) => {
  const [lastStep] = way.slice(-1)

  if (lastStep === START) {
    finishedWays.push(way)
    return false
  }

  if (lastStep === END || lastStep === START) {
    return false
  }

  const isCaveSmall = lastStep[0].match(/[a-z]/)
  const isNotPossibleToVisit = findRepeat(way, possibleRepeat)
  if (isCaveSmall && isNotPossibleToVisit) {
    return false
  }

  return true
}

const solve = (inputString: string, possibleRepeat?: boolean) => {
  const graph: {
    [key: string]: string[]
  } = {}
  const finishedWays = []
  inputString.split('\n').forEach(line => {
    const [start, end] = line.split('-')
    if (!graph[start]) graph[start] = []
    if (!graph[end]) graph[end] = []
    graph[start].push(end)
    graph[end].push(start)
  })
  let possibleWays = [[END]]
  while (possibleWays.length > 0) {
    possibleWays = possibleWays.flatMap(way => {
      const [lastStep] = way.slice(-1)
      return graph[lastStep]
        .filter(newStep => isWayPossible([...way, newStep], finishedWays, possibleRepeat))
        .map(newStep => ([...way, newStep]))
    })
  }

  return finishedWays.length
}

export const first = (inputString: string) => solve(inputString)

export const second = (inputString: string) => solve(inputString, true)

export const tests: Test[] = [
  {
    input: `start-A
start-b
A-c
A-b
b-d
A-end
b-end`,
    results: {
      first: 10,
      second: 36,
    },
  },
  {
    input: `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`,
    results: {
      first: 19,
      second: 103,
    },
  },
  {
    input: `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`,
    results: {
      first: 226,
      second: 3509,
    },
  }];

export const input = `FK-gc
gc-start
gc-dw
sp-FN
dw-end
FK-start
dw-gn
AN-gn
yh-gn
yh-start
sp-AN
ik-dw
FK-dw
end-sp
yh-FK
gc-gn
AN-end
dw-AN
gn-sp
gn-FK
sp-FK
yh-gc`;
