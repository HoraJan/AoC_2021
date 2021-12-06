import { Test } from '.';

const singleDay = (day: string) => {
  if (day === '0') return ['6', '8']
  return [(Number(day) - 1).toString()]
}

interface SingleDay {
  [key: string]: {
    count: number
    array: string[]
  }
}

const solveSingleDay = (inputSingleDay: SingleDay) => {
  const response = {}
  Object.entries(inputSingleDay).forEach(([number, obj]) => {
    obj.array = singleDay(number)
    obj.array.forEach(age => {
      if (response[age]) {
        response[age].count += obj.count
        return
      }
      response[age] = { count: obj.count, array: singleDay(age) }
    })
  })
  return response
}

const solve = (inputString: string, rounds: number) => {
  const ages = inputString.split(',')

  let response: SingleDay = {}
  ages.forEach(age => {
    if (response[age]) {
      response[age].count += 1
      return
    }
    response[age] = { count: 1, array: singleDay(age) }
  })

  for (let i = 0; i < rounds - 1; i++) {
    response = solveSingleDay(response)
  }

  return Object.values(response).reduce((acc, curr) => {
    return acc + curr.count * curr.array.length
  }, 0)
}

export const first = (inputString: string) => {
  return solve(inputString, 80)
}

export const second = (inputString: string) => {
  return solve(inputString, 256)
}

export const tests: Test[] = [
  {
    input: `3,4,3,1,2`,
    results: {
      first: 5934,
      second: 26984457539,
    },
  }];

export const input = `4,5,3,2,3,3,2,4,2,1,2,4,5,2,2,2,4,1,1,1,5,1,1,2,5,2,1,1,4,4,5,5,1,2,1,1,5,3,5,2,4,3,2,4,5,3,2,1,4,1,3,1,2,4,1,1,4,1,4,2,5,1,4,3,5,2,4,5,4,2,2,5,1,1,2,4,1,4,4,1,1,3,1,2,3,2,5,5,1,1,5,2,4,2,2,4,1,1,1,4,2,2,3,1,2,4,5,4,5,4,2,3,1,4,1,3,1,2,3,3,2,4,3,3,3,1,4,2,3,4,2,1,5,4,2,4,4,3,2,1,5,3,1,4,1,1,5,4,2,4,2,2,4,4,4,1,4,2,4,1,1,3,5,1,5,5,1,3,2,2,3,5,3,1,1,4,4,1,3,3,3,5,1,1,2,5,5,5,2,4,1,5,1,2,1,1,1,4,3,1,5,2,3,1,3,1,4,1,3,5,4,5,1,3,4,2,1,5,1,3,4,5,5,2,1,2,1,1,1,4,3,1,4,2,3,1,3,5,1,4,5,3,1,3,3,2,2,1,5,5,4,3,2,1,5,1,3,1,3,5,1,1,2,1,1,1,5,2,1,1,3,2,1,5,5,5,1,1,5,1,4,1,5,4,2,4,5,2,4,3,2,5,4,1,1,2,4,3,2,1`;
