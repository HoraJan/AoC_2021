import { Test } from '.';

const flatten = (input: any, currentLevel: number) => {
  let flatted = []
  // console.log('i', input)
  input.forEach((element) => {
    if (!Array.isArray(element)) {
      flatted.push({ level: currentLevel, element })

      return
    }

    flatted = [...flatted, ...flatten(element, currentLevel + 1)]
  })

  return flatted
}

const reduce = (input: any[]) => {
  const toReduce = input.findIndex((el, index, array) => {
    // console.log(el, array[index + 1])
    return el.level > 4 && array[index + 1]?.level === el.level
  })

  if (toReduce > -1) {
    const removed = input.splice(toReduce, 2, { level: input[toReduce].level - 1, element: 0, })
    if (input[toReduce - 1]) input[toReduce - 1].element += removed[0].element
    if (input[toReduce + 1]) input[toReduce + 1].element += removed[1].element

    return reduce(input)
  }

  if (input.find(el => el.element > 9)) {
    const findIndex = input.findIndex(el => el.element > 9)
    input.splice(findIndex, 1,
      { level: input[findIndex].level + 1, element: Math.floor(input[findIndex].element / 2), },
      { level: input[findIndex].level + 1, element: Math.ceil(input[findIndex].element / 2), })

    return reduce(input)
  }

  return input
}

const calculate = (input: any[]) => {
  const toSum = input.findIndex((el, index) => el.level === input[index + 1]?.level)
  if (toSum > -1) {
    input.splice(toSum, 2, { level: input[toSum].level - 1, element: input[toSum].element * 3 + input[toSum + 1].element * 2 })

    return calculate(input)

  }

  return input
}

export const first = (inputString: string) => {
  const lines = inputString.split('\n').map(line => JSON.parse(line))
  // console.log('l', lines)
  const firstFlatten = flatten([lines[0]], 0)
  const added = lines.reduce((acc, curr, index) => {
    // console.log(index, acc)
    if (!index) {

      return acc
    }

    const result = flatten([curr], 1)
    // console.log('r', result)

    const reduced = reduce([...acc.map(el => ({ ...el, level: el.level + 1 })), ...result])
    return reduced
  }, firstFlatten)
  // console.log('a', added)

  const [calculated] = calculate(added)
  // console.log(calculated)

  return calculated.element
}

export const second = (inputString: string) => {
  const lines = inputString.split('\n').map(line => JSON.parse(line))

  let maxMagnitude = 0

  for (let first = 0; first < lines.length; first++) {
    for (let second = 0; second < lines.length; second++) {
      if (first === second) continue

      const firstFlatten = flatten([lines[first]], 1)
      const secondFlatten = flatten([lines[second]], 1)

      const reduced = reduce([...firstFlatten, ...secondFlatten])
      const [calculated] = calculate(reduced)
      if (calculated.element > maxMagnitude) {
        maxMagnitude = calculated.element
        console.log(first, second, firstFlatten, secondFlatten, reduced)

      }
    }
  }

  return maxMagnitude
}

export const tests: Test[] = [
  {
    input: `[[1,2],[[3,4],5]]`,
    results: {
      first: 143
    },
  },
  {
    input: `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]`,

    results: {
      first: 3488
    },
  },


  {
    input: `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`,
    results: {
      first: 4140,
      second: 3993
    },
  },
];

export const input = `[[[7,1],2],3]
[[1,7],7]
[[6,8],[[6,[3,6]],[0,5]]]
[[[[2,1],8],[[9,4],8]],[[6,5],4]]
[[1,[[3,8],[9,1]]],[[9,1],[[1,7],0]]]
[[[7,4],[8,[7,6]]],[9,[[6,3],[7,8]]]]
[[[[5,0],1],4],[[5,[6,9]],[[4,3],2]]]
[[[3,8],8],[[[3,2],8],[9,[0,5]]]]
[[[[5,8],[3,9]],[7,[1,4]]],[6,1]]
[3,[[[3,3],9],[0,7]]]
[[[6,9],1],[[0,[8,4]],[[2,2],9]]]
[[[[6,2],3],[0,4]],3]
[[[[3,8],7],[[7,4],0]],[2,[5,[2,8]]]]
[[4,[9,[8,0]]],[[1,5],[[9,3],8]]]
[[[8,5],[3,[1,4]]],[[6,[8,0]],[[2,7],[2,6]]]]
[4,7]
[[[[2,3],0],[[1,9],[4,1]]],[[1,[4,2]],3]]
[[[8,[5,3]],[[5,7],7]],[[5,6],[6,4]]]
[[[[2,4],1],[8,6]],[[6,5],[0,[9,1]]]]
[[[1,[5,7]],8],[[[9,1],9],[[1,2],4]]]
[[[[5,5],[4,0]],[4,[9,6]]],[[[2,1],1],7]]
[[[[1,9],[9,5]],[[5,0],[3,1]]],[[[6,7],[8,8]],[[7,3],0]]]
[[6,[[6,7],[9,0]]],[[7,7],[[0,3],0]]]
[[0,6],[5,2]]
[[[[5,8],3],[[9,0],8]],[7,4]]
[[0,[[9,9],[9,4]]],[[[1,1],2],[1,[6,7]]]]
[0,[[5,7],2]]
[[2,[[5,4],6]],[1,[8,[7,6]]]]
[[[1,7],[8,[5,8]]],[[[2,1],[9,1]],[[5,6],9]]]
[[1,8],[9,[4,3]]]
[5,[2,[[5,5],9]]]
[3,[8,[[2,8],[4,8]]]]
[[[4,9],[[5,5],0]],[9,[8,[3,0]]]]
[[[2,[6,4]],[8,[9,9]]],[[[0,4],8],[3,[9,7]]]]
[[[[8,1],[2,4]],3],[1,[[3,3],[6,3]]]]
[[[8,[7,3]],[1,8]],2]
[[8,[8,4]],[[6,[4,7]],[3,0]]]
[[[[4,6],[8,3]],9],[9,[[8,9],[0,9]]]]
[[3,[[2,7],[4,4]]],2]
[8,[[[8,6],2],[[8,9],6]]]
[[[[5,7],[2,0]],[[0,2],[5,5]]],[[[8,5],5],[[1,3],[2,3]]]]
[[1,6],[[9,8],[9,[4,9]]]]
[[[[1,4],5],9],[4,[6,8]]]
[[[[6,4],[9,0]],[[1,4],[6,6]]],[[9,[2,8]],2]]
[[[[5,9],2],[[0,0],5]],[2,1]]
[6,[[3,2],[[3,0],0]]]
[[[[7,4],1],[[4,1],1]],[[3,4],4]]
[3,[9,[9,7]]]
[[[3,[3,3]],[0,3]],[1,[1,8]]]
[[8,[8,7]],[[9,2],5]]
[[[1,[3,9]],[5,9]],[1,5]]
[[[[7,8],[9,7]],9],[[[9,2],[2,2]],[[9,6],8]]]
[4,[[3,5],[[1,3],[5,5]]]]
[7,[[[0,1],2],[[3,6],5]]]
[0,[[[2,4],[3,4]],[8,9]]]
[[1,[[6,8],1]],[8,0]]
[1,1]
[7,0]
[[1,2],[[0,[8,3]],[[4,5],[9,7]]]]
[[[[2,3],[5,9]],[7,[1,9]]],2]
[[3,5],[[9,7],9]]
[[[[6,9],[4,8]],6],0]
[[[[2,4],[3,9]],[2,[9,4]]],[[[8,9],[3,1]],7]]
[[5,[[0,2],4]],[[[9,9],[7,4]],[1,5]]]
[3,[6,[[5,4],1]]]
[[[2,[2,7]],2],[[4,[7,3]],5]]
[7,[[0,[2,0]],[[9,4],6]]]
[[4,[3,[6,2]]],9]
[[[0,[5,6]],[8,3]],[[7,9],[0,[9,6]]]]
[8,[[6,4],[4,8]]]
[[[8,[6,8]],[5,[7,3]]],[[[7,8],5],2]]
[[[[3,5],[4,7]],5],[[0,0],[9,[1,9]]]]
[[7,[[1,5],9]],[[[3,4],[1,7]],[1,[7,9]]]]
[[0,[3,[4,1]]],[[[2,9],3],[4,[0,8]]]]
[[[8,[1,6]],[[0,1],7]],[[[1,1],[0,2]],[[9,4],[9,6]]]]
[[[[6,7],0],[[6,8],9]],[[1,[6,6]],[[2,9],[4,7]]]]
[[[[5,0],[1,2]],[1,[5,1]]],[[0,4],1]]
[[9,1],6]
[[7,2],[[[5,5],[4,3]],6]]
[[9,[[0,6],9]],[[7,9],[7,1]]]
[[[[7,3],[6,4]],[[2,5],[7,2]]],[[[4,4],0],[[9,5],[8,5]]]]
[[[[8,8],[6,4]],[[0,2],[9,5]]],2]
[[[[3,0],7],[9,2]],[[0,[8,6]],[[7,2],[8,5]]]]
[[0,6],[1,[9,[4,3]]]]
[[0,8],[[[5,0],6],[5,[2,0]]]]
[[[[7,1],[0,3]],[[9,9],[3,5]]],[4,[8,4]]]
[7,[[1,[3,7]],[[3,4],[2,3]]]]
[[[[2,2],[4,8]],[[3,4],0]],[[[1,5],[2,8]],5]]
[6,[[[9,1],5],[9,9]]]
[[[2,[8,6]],[[9,9],[6,3]]],4]
[[[[3,2],[9,3]],8],9]
[[[[6,9],0],[[0,6],[1,3]]],[[5,[9,8]],[[1,5],[3,7]]]]
[[2,[4,[2,3]]],[[[6,0],[7,2]],3]]
[[[[8,3],4],[6,[8,8]]],4]
[[[9,8],5],[[[4,4],[6,3]],[8,6]]]
[9,2]
[[[3,4],[4,[7,0]]],[0,[4,[6,9]]]]
[[[0,8],[3,9]],[[[3,8],6],[[9,3],6]]]
[[[[5,6],[0,3]],1],[8,[2,9]]]
[[[[4,2],8],[[9,3],7]],0]`;
