
import { Test } from '.';

const connections: { [key: string]: number[] } = {
  '0': [1],
  '1': [0, 3, 11],
  // '2': [1, 11, 3],
  '3': [1, 5, 13],
  // '4': [3, 5, 13],
  '5': [3, 7, 15],
  // '6': [5, 7, 15],
  '7': [5, 9, 17],
  // '8': [7, 9, 17],
  '9': [7, 10, 17],
  '10': [9],
  '11': [1, 3, 12],
  '12': [11],
  '13': [3, 5, 14],
  '14': [13],
  '15': [5, 7, 16],
  '16': [15],
  '17': [7, 9, 18],
  '18': [17],
}
const doubles = [
  '1-11', '11-1', '1-3', '3-1', '3-11', '11-3',
  '3-13', '13-3', '3-5', '5-3', '5-13', '13-5',
  '5-15', '15-5', '5-7', '7-5', '7-15', '15-7',
  '7-17', '17-7', '7-9', '9-7', '9-17', '17-9',
]

const forbiddenMoves = {
  'A': ['3-13', '5-13', '5-15', '7-15', '7-17', '9-17'],
  'B': ['1-11', '3-11', '5-15', '7-15', '7-17', '9-17'],
  'C': ['1-11', '3-11', '3-13', '5-13', '7-17', '9-17'],
  'D': ['1-11', '3-11', '3-13', '5-13', '5-15', '7-15'],
}

const isCharFinal = (index: number, state: string[]) => {
  if (index < 11) return false
  if (index === 11 && state[index] === 'A') return state[index] === state[index + 1]
  if (index === 13 && state[index] === 'B') return state[index] === state[index + 1]
  if (index === 15 && state[index] === 'C') return state[index] === state[index + 1]
  if (index === 17 && state[index] === 'D') return state[index] === state[index + 1]
  if (index === 12 && state[index] === 'A') return true
  if (index === 14 && state[index] === 'B') return true
  if (index === 16 && state[index] === 'C') return true
  if (index === 18 && state[index] === 'D') return true

  return false
}

const getScore = (char: string) => {
  if (char === 'A') return 1
  if (char === 'B') return 10
  if (char === 'C') return 100
  if (char === 'D') return 1000
}

const winState = '###########A#A#B#B#C#C#D#D'

//  0 1 2 3 4 5 6 7 8 9 10
//     11  13  15  17
//     12  14  16  18
const solve = (inputString: string) => {
  const wins = []
  const state = new Array<string>(19).fill(null)
  const states = new Map()
  inputString
    .split('\n')
    .slice(2, 4)
    .forEach((line, index) =>
      line
        .match(/[A-D].*[A-D].*[A-D].*[A-D]/)[0]
        .split('#')
        .forEach((char, charIndex) => {
          state[11 + index + 2 * charIndex] = char
        }))

  states.set(state.join('#'), 0)
  const possibleStates = [{ score: 0, state, previousStates: [] }]
  let i = 0;
  while (possibleStates.length) {
    i++
    const currentState = possibleStates.shift()
    if (states.has(currentState.state.join('#')) && states.get(currentState.state.join('#')).score <= currentState.score) continue
    if (i % 10000 === 0) console.log(i, wins)
    const possibleMoves = currentState.state.flatMap((position, index) => {
      if (!position) return []

      return connections[index].filter((pos) => !currentState.state[pos]).map(pos => ({ char: position, to: pos, from: index }))
    })

    possibleMoves
      .filter(({ from, to, char }) =>
        !forbiddenMoves[char].includes(`${from}-${to}`) &&
        !isCharFinal(from, state))
      .map(({ from, to, char }) => {
        const newState = [...currentState.state]
        newState[from] = null
        newState[to] = char
        const newScore = currentState.score + getScore(char) * (doubles.includes(`${from}-${to}`) ? 2 : 1)

        if (newState.join('#') === winState) {
          wins.push(currentState)
        }

        return {
          state: newState,
          score: newScore,
          previousStates: [...currentState.previousStates, currentState.state]
        }
      }).filter(({ state, score }) =>
        !states.has(state.join('#')) || states.get(state.join('#')).score > score
      ).forEach(({ state, score, previousStates }) => {
        states.set(state.join('#'), score)
        possibleStates.push({ state, score, previousStates })
      })
  }

  console.log(i, possibleStates.length, states.size)
  console.log(winState, states.get(winState), wins[0])
  return states.get(winState)
}

export const first = (inputString: string) => solve(inputString)


export const second = (inputString: string) => solve(inputString)


export const tests: Test[] = [
  {
    input: `#############
    #...........#
    ###B#C#B#D###
      #A#D#C#A#
      #########`,
    results: {
      first: 12521,
      second: 1
    }
  },
];

export const input = `#############
#...........#
###B#A#B#C###
  #C#D#D#A#
  #########`;

// D 8000 5000 C 500 700 B 50 40 A 5 9
14510

// A  4
// #############
// #.A.........#
// ###B#.#B#C###
//   #C#D#D#A#
//   #########

// D  5000
// #############
// #.A.....D...#
// ###B#.#B#C###
//   #C#.#D#A#
//   #########

// B  50
// #############
// #.A.....D...#
// ###.#.#B#C###
//   #C#B#D#A#
//   #########

// B  40
// #############
// #.A.....D...#
// ###.#B#.#C###
//   #C#B#D#A#
//   #########

// C  300
// #############
// #.A.....D.AC#
// ###.#B#.#.###
//   #C#B#D#A#
//   #########

// A  3
// #############
// #.A.....D.AC#
// ###.#B#.#.###
//   #C#B#D#.#
//   #########

// D  3000
// #############
// #.A.......AC#
// ###.#B#.#.###
//   #C#B#D#D#
//   #########

// D  5000
// #############
// #.A.......AC#
// ###.#B#.#D###
//   #C#B#.#D#
//   #########

// C  800
// #############
// #.A.......AC#
// ###.#B#.#D###
//   #.#B#C#D#
//   #########

// A  3
// #############
// #.........AC#
// ###.#B#.#D###
//   #A#B#C#D#
//   #########

// A  8
// #############
// #..........C#
// ###A#B#.#D###
//   #A#B#C#D#
//   #########

// C  500
// #############
// #...........#
// ###A#B#C#D###
//   #A#B#C#D#
//   #########