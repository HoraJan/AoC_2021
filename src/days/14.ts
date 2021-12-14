import { Test } from '.';

const analyseInstructions = (instructionString: string) =>
  instructionString
    .split('\n')
    .map(line => line.split(' -> '))
    .reduce((acc, [pair, newOne]) => {
      acc[pair] = newOne
      return acc
    }, {})


const prepareStep = (start: string) => start.split('').reduce((acc, char, index) => {
  if (index === 0) return acc

  if (!acc[start[index - 1] + char]) acc[start[index - 1] + char] = 0

  acc[start[index - 1] + char] += 1

  return acc
}, {})

const solveStep = (product: { [key: string]: number }, instructions: { [key: string]: string }) =>
  Object.entries(product).reduce((acc, [pair, count]) => {
    const instruction = instructions[pair]
    if (!acc[pair[0] + instruction]) acc[pair[0] + instruction] = 0
    if (!acc[instruction + pair[1]]) acc[instruction + pair[1]] = 0

    acc[pair[0] + instruction] += count
    acc[instruction + pair[1]] += count

    return acc
  }, {})


const calculateDiff = (product: { [key: string]: number }, start: string) => {
  const sums = {}
  // we use first letter or start string
  sums[start[0]] = 1

  // and second letter of each pair
  Object.entries(product).forEach(([[, secondChar], count]) => {
    if (!sums[secondChar]) sums[secondChar] = 0
    sums[secondChar] += count
  })
  const sorted = Object.values<number>(sums).sort((a: number, b: number) => a - b)

  return sorted[sorted.length - 1] - sorted[0]
}

const solve = (inputString: string, steps: number) => {
  const [start, instructionsString] = inputString.split('\n\n')
  const instructions = analyseInstructions(instructionsString)
  let product = prepareStep(start)

  for (let step = 0; step < steps; step++) {
    product = solveStep(product, instructions)
  }

  return calculateDiff(product, start)
}

export const first = (inputString: string) => solve(inputString, 10)

export const second = (inputString: string) => solve(inputString, 40)

export const tests: Test[] = [
  {
    input: `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`,
    results: {
      first: 1588,
      second: 2188189693529
    },
  }];

export const input = `PSVVKKCNBPNBBHNSFKBO

CF -> H
PP -> H
SP -> V
NO -> C
SF -> F
FS -> H
OF -> P
PN -> B
SH -> V
BO -> K
ON -> V
VP -> S
HN -> B
PS -> P
FV -> H
NC -> N
FN -> S
PF -> F
BF -> F
NB -> O
HS -> C
SC -> V
PC -> K
KF -> K
HC -> C
OK -> H
KS -> P
VF -> C
NV -> S
KK -> F
HV -> H
SV -> V
KC -> N
HF -> P
SN -> F
VS -> P
VN -> F
VH -> C
OB -> K
VV -> O
VC -> O
KP -> V
OP -> C
HO -> S
NP -> K
HB -> C
CS -> S
OO -> S
CV -> K
BS -> F
BH -> P
HP -> P
PK -> B
BB -> H
PV -> N
VO -> P
SS -> B
CC -> F
BC -> V
FF -> S
HK -> V
OH -> N
BV -> C
CP -> F
KN -> K
NN -> S
FB -> F
PH -> O
FH -> N
FK -> P
CK -> V
CN -> S
BP -> K
CH -> F
FP -> K
HH -> N
NF -> C
VB -> B
FO -> N
PB -> C
KH -> K
PO -> K
OV -> F
NH -> H
KV -> B
OS -> K
OC -> K
FC -> H
SO -> H
KO -> P
NS -> F
CB -> C
CO -> F
KB -> V
BK -> K
NK -> O
SK -> C
SB -> B
VK -> O
BN -> H`;
