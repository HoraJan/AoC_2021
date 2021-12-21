import BinaryHeapStrategy from "ts-priority-queue";
import { Test } from '.';

interface State {
  playersPositions: number[]
  playerToRoll: number
  dice: number
  scores: number[]
  rolls: number
  // predecessors: CountObject[]
  // ancesstors?: string[]
  count: number
}

// interface CountObject {
//   count: number
// }


const turn = (state: State, roll: number, diceSides: number) => {
  state.rolls += 3
  state.dice = (state.dice + 3 - 1) % diceSides + 1
  state.playersPositions[state.playerToRoll] = (state.playersPositions[state.playerToRoll] + roll - 1) % 10 + 1
  state.scores[state.playerToRoll] += state.playersPositions[state.playerToRoll]
  state.playerToRoll = state.playerToRoll === 0 ? 1 : 0

  return state
}

const parsePLayers = (inputString: string) => inputString.split('\n').map(player => Number(player.split(': ')[1]))

// const countPredecessors = (state: State, tree: { [key: string]: State }) => {
//   if (state.predecessors.length) {
//     // console.log(state)
//     return state.predecessors.reduce((acc, key) => acc + countPredecessors(tree[key], tree), 0)
//   }

//   return state.count
// }

const solve = (inputString: string, maxScore: number, diceSides: number, possibleRolls: (state: State) => number[]) => {
  const state = {
    playersPositions: [...parsePLayers(inputString)],
    playerToRoll: 0,
    dice: 1,
    scores: [0, 0],
    rolls: 0,
    count: 1,
    // ancesstors: [],
    // predecessors: []
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

  // const statesToSolve = [state]
  const tree = { [stateString]: state }
  const wonStates = []

  // let i = 0
  while (statesToSolve.length) {
    // i++
    // if (i % 10000 === 0) console.log(i, statesToSolve.length, wonStates.length)
    // console.log(statesToSolve.length)
    const state = statesToSolve.dequeue()

    // const state = statesToSolve.shift()
    // const stateString = `${state.playersPositions.join('-')};${state.playerToRoll};${state.scores.join('-')}`

    // 20-20;0;1-2
    const rolls = possibleRolls(state)
    const newStates = rolls.map(roll =>
      turn({
        ...state,
        scores: [...state.scores],
        playersPositions: [...state.playersPositions],
        // predecessors: [...state.predecessors]
      }, roll, diceSides))

    newStates.forEach(newState => {
      const newStateString = `${newState.playersPositions.join('-')};${newState.playerToRoll};${newState.scores.join('-')}`
      // state.ancesstors.push(stateString)
      if (newState.scores.find(score => score >= maxScore)) {
        wonStates.push(newState)
        return
      }
      if (!tree[newStateString]) {
        // statesToSolve.push(newState)
        statesToSolve.queue(newState)
        tree[newStateString] = newState
        // tree[stateString].count *= newState.count
        return
      }

      tree[newStateString].count += newState.count
      // tree[newStateString].predecessors.push(stateString)
    })
  }
  console.log(wonStates.length)
  return { wonStates, tree }
}

export const first = (inputString: string) => {
  const rolls = (state: State) => [state.dice + (state.dice + 1 - 1) % 100 + 1 + (state.dice + 2 - 1) % 100 + 1]
  const { wonStates } = solve(inputString, 1000, 100, rolls)

  return Math.min(...wonStates[0].scores) * wonStates[0].rolls
}

export const second = (inputString: string) => {


  const rolls = () => {
    const rolls = []
    for (let i = 0; i < 27; i++) {
      const sum = i.toString(3).padStart(3, '0').split('').reduce((acc, curr) => acc + Number(curr), 0) + 3
      rolls.push(sum)
    }

    return rolls
  }
  const { wonStates, tree } = solve(inputString, 21, 3, rolls)

  const firstCount = wonStates.reduce((acc, curr) => acc + (curr.scores[0] > curr.scores[1] ? curr.count : 0), 0)
  const secondCount = wonStates.reduce((acc, curr) => acc + (curr.scores[1] > curr.scores[0] ? curr.count : 0), 0)
  console.log(firstCount, secondCount)

  // countPredecessors(wonStates[0], tree)

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


