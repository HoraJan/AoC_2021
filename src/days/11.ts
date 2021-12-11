import { Test } from '.';

const increaseNeighbours = (array: number[][], lineIndex: number, pointIndex: number) => {
  if (array[lineIndex - 1]?.[pointIndex - 1] > -1) array[lineIndex - 1][pointIndex - 1] += 1
  if (array[lineIndex - 1]?.[pointIndex] > -1) array[lineIndex - 1][pointIndex] += 1
  if (array[lineIndex - 1]?.[pointIndex + 1] > -1) array[lineIndex - 1][pointIndex + 1] += 1
  if (array[lineIndex]?.[pointIndex - 1] > -1) array[lineIndex][pointIndex - 1] += 1
  if (array[lineIndex]?.[pointIndex + 1] > -1) array[lineIndex][pointIndex + 1] += 1
  if (array[lineIndex + 1]?.[pointIndex - 1] > -1) array[lineIndex + 1][pointIndex - 1] += 1
  if (array[lineIndex + 1]?.[pointIndex] > -1) array[lineIndex + 1][pointIndex] += 1
  if (array[lineIndex + 1]?.[pointIndex + 1] > -1) array[lineIndex + 1][pointIndex + 1] += 1
}

const doStep = (array: number[][]) => {
  const flashing = []
  let newFlash = false

  do {
    newFlash = false
    for (let lineIndex = 0; lineIndex < array.length; lineIndex++) {
      for (let pointIndex = 0; pointIndex < array[0].length; pointIndex++) {
        if (array[lineIndex][pointIndex] < 10) continue

        const coordinates = `${lineIndex},${pointIndex}`
        if (flashing.includes(coordinates)) continue

        flashing.push(`${lineIndex},${pointIndex}`)
        increaseNeighbours(array, lineIndex, pointIndex)
        newFlash = true
      }
    }
  } while (newFlash)
  return flashing.length
}

export const first = (inputString: string) => {
  let array = inputString.split('\n').map(line => line.split('').map(Number))
  let totalFlashes = 0

  for (let step = 0; step < 100; step++) {
    array = array.map(line => line.map(point => point += 1))
    const flashing = doStep(array)
    totalFlashes += flashing
    array = array.map(line => line.map(point => point > 9 ? 0 : point))
  }

  return totalFlashes
}

export const second = (inputString: string) => {
  let array = inputString.split('\n').map(line => line.split('').map(Number))
  let step = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    array = array.map(line => line.map(point => point += 1))
    step += 1
    const flashing = doStep(array)
    if (flashing === 100) return step

    array = array.map(line => line.map(point => point > 9 ? 0 : point))
  }
}

export const tests: Test[] = [
  {
    input: `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`,
    results: {
      first: 1656,
      second: 195,
    },
  }];

export const input = `4575355623
3325578426
7885165576
4871455658
3722545312
8362663832
5562743324
4165776412
1817813675
4255524632`;
