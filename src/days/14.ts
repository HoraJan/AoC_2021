import { Test } from '.';

export const first = (inputString: string) => {
  const [start, instructionsString] = inputString.split('\n\n')
  const instructions = instructionsString.split('\n').map(line => line.split(' -> ')).map(([pair, newChar]) => [[pair[0].charCodeAt(0), pair[1].charCodeAt(0)], newChar.charCodeAt(0)])

  let product = start.split('').map(char => char.charCodeAt(0))

  for (let step = 0; step < 10; step++) {
    const newProduct = []
    product.forEach((char, index) => {
      if (index === 0) {
        newProduct.push(char)

        return
      }
      const instruction = instructions.find(inst => inst[0][0] === product[index - 1] && inst[0][1] === char)

      newProduct.push(instruction[1])
      newProduct.push(char)
    })

    product = newProduct
    // console.log(product)
  }
  const sums = {}
  product.forEach(char => {
    if (!sums[char]) sums[char] = 0
    sums[char] += 1
  })
  const sorted = Object.values(sums).sort((a: number, b: number) => a - b)

  return - +sorted[0] + +sorted[sorted.length - 1]
}

export const second = (inputString: string) => {
  const [start, instructionsString] = inputString.split('\n\n')
  const instructions = instructionsString.split('\n').map(line => line.split(' -> ')).map(([pair, newChar]) => [[pair[0].charCodeAt(0), pair[1].charCodeAt(0)], newChar.charCodeAt(0)])

  let product = start.split('').map(char => char.charCodeAt(0))

  for (let step = 0; step < 40; step++) {
    console.log(step)
    const newProduct = []
    product.forEach((char, index) => {
      if (index === 0) {
        newProduct.push(char)

        return
      }
      const instruction = instructions.find(inst => inst[0][0] === product[index - 1] && inst[0][1] === char)

      newProduct.push(instruction[1])
      newProduct.push(char)
    })

    product = newProduct
  }
  const sums = {}
  product.forEach(char => {
    if (!sums[char]) sums[char] = 0
    sums[char] += 1
  })
  const sorted = Object.values(sums).sort((a: number, b: number) => a - b)

  return - +sorted[0] + +sorted[sorted.length - 1]
}

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
