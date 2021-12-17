import { Test } from '.';

const solve = (inputString: string) => {
  const [, xMin, xMax, yMin, yMax] =
    inputString.match(/(\d+)..(\d+).*(-\d+)..(-\d+)/).map(Number)

  const minXSpeed = Math.floor(Math.pow(2 * xMin, 0.5))
  const maxXSpeed = xMax
  const minYSpeed = yMin
  const maxYSpeed = -yMin

  const maxHeight: number[] = []

  for (let x = minXSpeed; x <= maxXSpeed; x++) {
    for (let y = minYSpeed; y <= maxYSpeed; y++) {
      let speedX = x
      let speedY = y
      let position = [0, 0]
      let over = false
      let hitArea = false
      let innerMaxHeight = 0
      while (!over) {
        position = [position[0] + speedX, position[1] + speedY]
        if (position[1] > innerMaxHeight) {
          innerMaxHeight = position[1]
        }
        hitArea = hitArea || position[0] >= xMin && position[0] <= xMax && position[1] >= yMin && position[1] <= yMax
        speedX = speedX === 0 ? 0 : speedX - 1
        speedY -= 1
        over = position[0] > xMax || position[1] < yMin
      }

      if (hitArea) maxHeight.push(innerMaxHeight)

    }
  }

  return maxHeight
}

export const first = (inputString: string) => Math.max(...solve(inputString))

export const second = (inputString: string) => solve(inputString).length

export const tests: Test[] = [
  {
    input: `target area: x=20..30, y=-10..-5`,
    results: {
      first: 45,
      second: 112
    },
  },
];

export const input = `target area: x=235..259, y=-118..-62`;
