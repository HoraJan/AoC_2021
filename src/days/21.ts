import BinaryHeapStrategy from "ts-priority-queue";
import { Test } from '.';

interface State {
  playersPositions: number[]
  playerToRoll: number
  dice: number
  scores: number[]
  rolls: number
  count: number
}

const turn = (state: State, roll: number, diceSides: number) => {
  state.rolls += 3
  state.dice = (state.dice + 3 - 1) % diceSides + 1
  state.playersPositions[state.playerToRoll] = (state.playersPositions[state.playerToRoll] + roll - 1) % 10 + 1
  state.scores[state.playerToRoll] += state.playersPositions[state.playerToRoll]
  state.playerToRoll = state.playerToRoll === 0 ? 1 : 0

  return state
}

const parsePLayers = (inputString: string) => inputString.split('\n').map(player => Number(player.split(': ')[1]))

const solve = (inputString: string, maxScore: number, diceSides: number, possibleRolls: (state: State) => number[]) => {
  const state = {
    playersPositions: [...parsePLayers(inputString)],
    playerToRoll: 0,
    dice: 1,
    scores: [0, 0],
    rolls: 0,
    count: 1,
  }
  const stateString = `${state.playersPositions.join('-')};${state.playerToRoll};${state.scores.join('-')}`

  const statesToSolve = new BinaryHeapStrategy<State>({
    comparator: ({ scores: aCost }, { scores: bCost }) => {
      if (Math.min(...aCost) === Math.min(...bCost))
        return Math.max(...aCost) - Math.max(...bCost)

      return Math.min(...aCost) - Math.min(...bCost)
    }
  });

  statesToSolve.queue(state)

  const tree = { [stateString]: state }
  const wonStates = []

  while (statesToSolve.length) {
    const state = statesToSolve.dequeue()
    const rolls = possibleRolls(state)
    const newStates = rolls.map(roll =>
      turn({
        ...state,
        scores: [...state.scores],
        playersPositions: [...state.playersPositions],
      }, roll, diceSides))

    newStates.forEach(newState => {
      const newStateString = `${newState.playersPositions.join('-')};${newState.playerToRoll};${newState.scores.join('-')}`
      if (newState.scores.find(score => score >= maxScore)) {
        wonStates.push(newState)
        return
      }

      if (!tree[newStateString]) {
        statesToSolve.queue(newState)
        tree[newStateString] = newState
        return
      }

      tree[newStateString].count += newState.count
    })
  }

  return { wonStates, tree }
}

export const first = (inputString: string) => {
  const rolls = (state: State) => [state.dice + (state.dice + 1 - 1) % 100 + 1 + (state.dice + 2 - 1) % 100 + 1]
  const { wonStates } = solve(inputString, 1000, 100, rolls)

  return Math.min(...wonStates[0].scores) * wonStates[0].rolls
}

export const second = (inputString: string) => {
  const rolls = () => [
    3, 4, 5, 4, 5, 6, 5, 6,
    7, 4, 5, 6, 5, 6, 7, 6,
    7, 8, 5, 6, 7, 6, 7, 8,
    7, 8, 9
  ]

  const { wonStates } = solve(inputString, 21, 3, rolls)
  let firstCount = 0
  let secondCount = 0

  wonStates.forEach(curr => {
    if (curr.scores[0] > curr.scores[1]) return firstCount += curr.count
    secondCount += curr.count
  })

  return Math.max(firstCount, secondCount)
}

export const tests: Test[] = [
  {
    input: `Player 1 starting position: 4
Player 2 starting position: 8`,
    results: {
      first: 739785,
      second: 444356092776315
    },
  },
];

export const input = `Player 1 starting position: 4
Player 2 starting position: 1`;


