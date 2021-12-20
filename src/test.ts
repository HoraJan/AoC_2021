const reading = `649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562`;

const array = reading.split("\n").map(line => line.split(',').map(Number));

console.log(
  array.flatMap((reading, readingIndex) =>
    array
      .map((nextReading) => ({
        readingIndex,
        diff: nextReading.map((value, index) => value - reading[index]),
      }))
      .filter(({ diff: [x, y, z] }) => x || y || z)
  )
);
