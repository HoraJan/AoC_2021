import { Test } from '.';

const parseHeader = (binaryString: string) => {
  const version = binaryString.slice(0, 3)
  const typeId = binaryString.slice(3, 6)

  return {
    version: parseInt(version, 2),
    typeId: parseInt(typeId, 2),
    restOfString: binaryString.slice(6)
  }
}

const parseLiteral = (binaryString: string) => {
  const goOn = true
  let digits = ''
  while (goOn) {
    const digit = binaryString.slice(0, 5)
    binaryString = binaryString.slice(5)
    digits += digit.slice(1, 5)
    if (digit.slice(0, 1) === '0') {
      // console.log(digits, digits.join(''))
      return { digit: parseInt(digits, 2), restOfString: binaryString }
    }
  }
}

const parseOperator = (binaryString: string, operator: number) => {
  const lengthtType = binaryString.slice(0, 1)
  binaryString = binaryString.slice(1)
  // console.log(lengthtType)
  const packets = []
  if (lengthtType === '0') {
    const subPacketsLength = parseInt(binaryString.slice(0, 15), 2)
    // console.log(subPacketsLength)
    binaryString = binaryString.slice(15)

    let parsedBits = 0
    while (subPacketsLength - parsedBits > 0) {
      const packet = parsePacket(binaryString)
      parsedBits += packet.totalLength
      packets.push(packet)
      binaryString = packet.restOfString
    }

  } else {
    const subPacketCount = parseInt(binaryString.slice(0, 11), 2)
    // console.log(subPacketCount)
    binaryString = binaryString.slice(11)

    let parsedPackets = 0
    while (subPacketCount - parsedPackets > 0) {
      const packet = parsePacket(binaryString)
      parsedPackets += 1
      packets.push(packet)
      binaryString = packet.restOfString
    }
  }
  let digit = 0
  if (operator === 0) {
    digit = packets.reduce((acc, curr) => acc + curr.digit, 0)
  }
  if (operator === 1) {
    digit = packets.reduce((acc, curr) => acc * curr.digit, 1)
  }
  if (operator === 2) {
    digit = packets.reduce((acc, curr) => Math.min(acc, curr.digit), Number.POSITIVE_INFINITY)
  }
  if (operator === 3) {
    digit = packets.reduce((acc, curr) => Math.max(acc, curr.digit), Number.NEGATIVE_INFINITY)
  }
  if (operator === 5) {
    digit = packets[0].digit > packets[1].digit ? 1 : 0
  }
  if (operator === 6) {
    digit = packets[0].digit < packets[1].digit ? 1 : 0
  }
  if (operator === 7) {
    digit = packets[0].digit === packets[1].digit ? 1 : 0
  }
  // console.log(packets, operator, result)

  return { version: packets.reduce((acc, curr) => acc + curr.version, 0), restOfString: binaryString, digit }
}

const parsePacket = (binaryString: string) => {
  const originLength = binaryString.length
  const { version: headerVersion, typeId, restOfString: restOfStringAfterHeader } = parseHeader(binaryString)
  binaryString = restOfStringAfterHeader
  // console.log(version, typeId, binaryString)
  if (typeId === 4) {
    const { digit, restOfString } = parseLiteral(binaryString)
    binaryString = restOfString
    // console.log(digit, binaryString)

    return { version: headerVersion, restOfString: binaryString, totalLength: originLength - binaryString.length, digit }
  }
  const { version, restOfString, digit } = parseOperator(binaryString, typeId)

  return { version: version + headerVersion, restOfString, totalLength: originLength - restOfString.length, digit }
}

const solve = (inputString: string, wantedProperty: string) => {
  const binaryString = inputString.split('').map(letter => parseInt(letter, 16).toString(2).padStart(4, '0')).join('')
  const packet = parsePacket(binaryString)

  return packet[wantedProperty]
}


export const first = (inputString: string) => solve(inputString, 'version')

export const second = (inputString: string) => solve(inputString, 'digit')

export const tests: Test[] = [
  {
    input: `D2FE28`,
    results: {
      first: 6
    },
  },
  {
    input: `38006F45291200`,
    results: {
      first: 9
    },
  },
  {
    input: `EE00D40C823060`,
    results: {
      first: 14
    },
  },
  {
    input: `8A004A801A8002F478`,
    results: {
      first: 16
    },
  },
  {
    input: `C200B40A82`,
    results: {
      second: 3
    },
  },
  {
    input: `04005AC33890`,
    results: {
      second: 54
    },
  },
  {
    input: `880086C3E88112`,
    results: {
      second: 7
    },
  },
  {
    input: `CE00C43D881120`,
    results: {
      second: 9
    },
  },
  {
    input: `D8005AC2A8F0`,
    results: {
      second: 1
    },
  },
  {
    input: `F600BC2D8F`,
    results: {
      second: 0
    },
  },
  {
    input: `9C005AC2F8F0`,
    results: {
      second: 0
    },
  },
  {
    input: `9C0141080250320F1802104A08`,
    results: {
      second: 1
    },
  },



];

export const input = `A20D6CE8F00033925A95338B6549C0149E3398DE75817200992531E25F005A18C8C8C0001849FDD43629C293004B001059363936796973BF3699CFF4C6C0068C9D72A1231C339802519F001029C2B9C29700B2573962930298B6B524893ABCCEC2BCD681CC010D005E104EFC7246F5EE7328C22C8400424C2538039239F720E3339940263A98029600A80021B1FE34C69100760B41C86D290A8E180256009C9639896A66533E459148200D5AC0149D4E9AACEF0F66B42696194031F000BCE7002D80A8D60277DC00B20227C807E8001CE0C00A7002DC00F300208044E000E69C00B000974C00C1003DC0089B90C1006F5E009CFC87E7E43F3FBADE77BE14C8032C9350D005662754F9BDFA32D881004B12B1964D7000B689B03254564414C016B004A6D3A6BD0DC61E2C95C6E798EA8A4600B5006EC0008542D8690B80010D89F1461B4F535296B6B305A7A4264029580021D1122146900043A0EC7884200085C598CF064C0129CFD8868024592FEE9D7692FEE9D735009E6BBECE0826842730CD250EEA49AA00C4F4B9C9D36D925195A52C4C362EB8043359AE221733DB4B14D9DCE6636ECE48132E040182D802F30AF22F131087EDD9A20804D27BEFF3FD16C8F53A5B599F4866A78D7898C0139418D00424EBB459915200C0BC01098B527C99F4EB54CF0450014A95863BDD3508038600F44C8B90A0801098F91463D1803D07634433200AB68015299EBF4CF5F27F05C600DCEBCCE3A48BC1008B1801AA0803F0CA1AC6200043A2C4558A710E364CC2D14920041E7C9A7040402E987492DE5327CF66A6A93F8CFB4BE60096006E20008543A8330780010E8931C20DCF4BFF13000A424711C4FB32999EE33351500A66E8492F185AB32091F1841C91BE2FDC53C4E80120C8C67EA7734D2448891804B2819245334372CBB0F080480E00D4C0010E82F102360803B1FA2146D963C300BA696A694A501E589A6C80`;
