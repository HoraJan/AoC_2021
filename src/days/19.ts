import { Test } from '.';
import { performance } from 'perf_hooks';
import { arrayBuffer } from 'stream/consumers';


interface Reading {
  reading: number[];
  diff: number[];
  diffTo: number[];
  scanner: number;
}

interface Scanner {
  final: boolean
  scanner: number[][]
  x: number
  y: number
  z: number
}

const sameTriple = ([firstX, firstY, firstZ]: number[], second: number[]) => {
  return (second.includes(firstX) || second.includes(-firstX)) &&
    (second.includes(firstY) || second.includes(-firstY)) &&
    (second.includes(firstZ) || second.includes(-firstZ))
}

const getDiff = (firstReading: Reading, secondReading: Reading) => {
  const firstIndex = secondReading.diff.findIndex(i => Math.abs(i) === Math.abs(firstReading.diff[0]))
  const secondIndex = secondReading.diff.findIndex(i => Math.abs(i) === Math.abs(firstReading.diff[1]))
  const thirdIndex = secondReading.diff.findIndex(i => Math.abs(i) === Math.abs(firstReading.diff[2]))

  const firstDiff =
    secondReading.diff[firstIndex] === firstReading.diff[0] ?
      firstReading.reading[0] - secondReading.reading[firstIndex] :
      firstReading.reading[0] + secondReading.reading[firstIndex]

  const secondDiff =
    secondReading.diff[secondIndex] === firstReading.diff[1] ?
      firstReading.reading[1] - secondReading.reading[secondIndex] :
      firstReading.reading[1] + secondReading.reading[secondIndex]

  const thirdDiff =
    secondReading.diff[thirdIndex] === firstReading.diff[2] ?
      firstReading.reading[2] - secondReading.reading[thirdIndex] :
      firstReading.reading[2] + secondReading.reading[thirdIndex]

  return {
    firstDiff,
    secondDiff,
    thirdDiff,
    firstIndex,
    secondIndex,
    thirdIndex,
    firstPositive: secondReading.diff[firstIndex] === firstReading.diff[0] ? -1 : 1,
    secondPositive: secondReading.diff[secondIndex] === firstReading.diff[1] ? -1 : 1,
    thirdPositive: secondReading.diff[thirdIndex] === firstReading.diff[2] ? -1 : 1
  }
}

const getPairOfScanners = (firstScanner: Scanner, scanners: Scanner[]) => {
  // const firstScanner = scanners[0]
  let i = 0
  while (i < scanners.length) {

    // const startTime = performance.now()

    const secondScanner = scanners[i]
    if (firstScanner === secondScanner || secondScanner.final) {
      i++
      continue
    }

    const diffs = [firstScanner, secondScanner].map((scanner, index, array) => {
      return {
        index,
        readings: scanner.scanner
          .map(reading =>
          ({
            reading,
            diffs: array[index].scanner
              .map(nextReading => ({
                diffTo: nextReading,
                diff: nextReading
                  .map((value, index) => value - reading[index])
              })).filter(({ diff: [x, y, z] }) => x && y && z)

          }))
      }
    })
    // console.log(performance.now() - startTime)

    const flatted = diffs.flatMap(({ readings, index }) =>
      readings.flatMap(({ reading, diffs }) => diffs.map(diff => ({ reading, diff: diff.diff, diffTo: diff.diffTo, scanner: index }))))
    // console.log(performance.now() - startTime)

    const overlap = flatted.filter(({ reading, diff, scanner: firstScanner }, _, array) => {
      const secondReading = array.find(({ diff: secondDiff, diffTo, scanner: secondScanner }) => reading !== diffTo && firstScanner !== secondScanner && sameTriple(diff, secondDiff))
      // const response = secondReading && reading !== secondReading.diffTo

      return !!secondReading
    })
    // console.log(performance.now() - startTime)
    // console.log(performance.now() - startTime)

    // console.log(flatted.find(a => a.reading[0] === -485 && a.diff.diff[0] === 944))
    const filtered = overlap.filter((el, ind, array) => array.findIndex(newEl => newEl.reading === el.reading) === ind)
    // console.log(overlap)
    // console.log(filtered.length)
    // console.log(performance.now() - startTime)

    if (filtered.length > 23) return { overlap, secondScanner, secondIndex: i }

    i++
  }
}

const recalculate = (overlap: Reading[], secondScanner: Scanner) => {
  const pairs = overlap.slice(0, 2).flatMap(first => {
    const second = overlap.filter(reading => {
      // console.log(reading.reading, reading.diffTo, reading.diff, first.diff)
      if (reading.scanner === first.scanner) return false

      return sameTriple(reading.diff, first.diff)

    })
    return second
  })

  const readings = {}
  pairs.forEach((pair, index) => readings[pair.reading.join(';')] ? readings[pair.reading.join(';')] = [...readings[pair.reading.join(';')], index] : readings[pair.reading.join(';')] = [index])
  // console.log(pairs[0].reading === pairs[2].reading, pairs[1].reading === pairs[3].reading)
  // console.log(readings)
  // console.log(pairs, overlap[0])
  const [index] = Object.values<number[]>(readings).find(arr => arr.length > 1)
  // if (pairs[0].reading === pairs[2].reading) {
  //   index = 0
  // }
  const position = getDiff(overlap[0], pairs[index])
  // console.log(position)
  // console.log(position)
  secondScanner.x = position.firstDiff
  secondScanner.y = position.secondDiff
  secondScanner.z = position.thirdDiff

  return secondScanner.scanner.map((reading) => {
    const first = position.firstDiff - position.firstPositive * reading[position.firstIndex]
    const second = position.secondDiff - position.secondPositive * reading[position.secondIndex]
    const third = position.thirdDiff - position.thirdPositive * reading[position.thirdIndex]
    return [first, second, third]
  })
}

const mergeScans = (scanners: Scanner[]) => {
  // let [first] = scanners
  return scanners
    .flatMap(scanner => scanner.scanner)
    .filter((reading, index, array) => array.findIndex(inner => inner[0] === reading[0] && inner[1] === reading[1] && inner[2] === reading[2]) === index)
  // return scanners.filter(scanner => scanner !== secondScanner)
}

const solve = (inputString: string) => {
  const scanners = inputString
    .split('\n').map(line => line.trim()).join('\n')
    .split('\n\n')
    .map(scanner => scanner
      .split('\n')
      .filter((l, i) => i > 0)
      .map(line => line.trim().split(',').map(Number)))
    .map(scanner => ({ final: false, scanner, x: 0, y: 0, z: 0 }))

  // const connections = {}
  // for (let i = 1; i < scanners.length; i++) {
  //   connections[i] = getPairOfScanners(scanners[i], scanners).secondIndex
  // }
  // console.log(connections)
  scanners[0].final = true
  const toCheck = [0]

  while (toCheck.length > 0) {
    // const startTime = performance.now()
    // console.log(scanners.length, scanners[0].length)
    const performedIndex = toCheck.shift()
    let con = !!scanners.find(scanner => !scanner.final)
    // console.log(performedIndex, con, toCheck)
    while (con) {
      const result = getPairOfScanners(scanners[performedIndex], scanners)
      if (!result) {
        con = false
        break
      }
      const { overlap, secondScanner, secondIndex } = result
      // console.log(secondIndex)
      toCheck.push(secondIndex)
      const recalculatedCoords = recalculate(overlap, secondScanner)
      // if (secondIndex === 2) console.log(overlap)
      scanners[secondIndex].scanner = recalculatedCoords
      scanners[secondIndex].final = true
    }


    // console.log(performance.now() - startTime)
  }
  // scanners = 
  return scanners
  // console.log(scanners.map(sc => sc.scanner))
  // console.log(mergedScanners)
}

export const first = (inputString: string) => {
  const mergedScanners = mergeScans(solve(inputString)).sort((a, b) => a[0] - b[0])

  return mergedScanners.length
}

export const second = (inputString: string) => {
  const mergedScanners = solve(inputString)
  console.log(mergedScanners)
  let max = 0

  for (let i = 0; i < mergedScanners.length; i++) {
    for (let j = i + 1; j < mergedScanners.length; j++) {
      max = Math.max(max, Math.abs(mergedScanners[i].x - mergedScanners[j].x) +
        Math.abs(mergedScanners[i].y - mergedScanners[j].y) +
        Math.abs(mergedScanners[i].z - mergedScanners[j].z))
    }
  }

  return max
}

export const tests: Test[] = [
  {
    input: `--- scanner 0 ---
    404,-588,-901
    528,-643,409
    -838,591,734
    390,-675,-793
    -537,-823,-458
    -485,-357,347
    -345,-311,381
    -661,-816,-575
    -876,649,763
    -618,-824,-621
    553,345,-567
    474,580,667
    -447,-329,318
    -584,868,-557
    544,-627,-890
    564,392,-477
    455,729,728
    -892,524,684
    -689,845,-530
    423,-701,434
    7,-33,-71
    630,319,-379
    443,580,662
    -789,900,-551
    459,-707,401
    
    --- scanner 1 ---
    686,422,578
    605,423,415
    515,917,-361
    -336,658,858
    95,138,22
    -476,619,847
    -340,-569,-846
    567,-361,727
    -460,603,-452
    669,-402,600
    729,430,532
    -500,-761,534
    -322,571,750
    -466,-666,-811
    -429,-592,574
    -355,545,-477
    703,-491,-529
    -328,-685,520
    413,935,-424
    -391,539,-444
    586,-435,557
    -364,-763,-893
    807,-499,-711
    755,-354,-619
    553,889,-390
    
    --- scanner 2 ---
    649,640,665
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
    577,-820,562
    
    --- scanner 3 ---
    -589,542,597
    605,-692,669
    -500,565,-823
    -660,373,557
    -458,-679,-417
    -488,449,543
    -626,468,-788
    338,-750,-386
    528,-832,-391
    562,-778,733
    -938,-730,414
    543,643,-506
    -524,371,-870
    407,773,750
    -104,29,83
    378,-903,-323
    -778,-728,485
    426,699,580
    -438,-605,-362
    -469,-447,-387
    509,732,623
    647,635,-688
    -868,-804,481
    614,-800,639
    595,780,-596
    
    --- scanner 4 ---
    727,592,562
    -293,-554,779
    441,611,-461
    -714,465,-776
    -743,427,-804
    -660,-479,-426
    832,-632,460
    927,-485,-438
    408,393,-506
    466,436,-512
    110,16,151
    -258,-428,682
    -393,719,612
    -211,-452,876
    808,-476,-593
    -575,615,604
    -485,667,467
    -680,325,-822
    -627,-443,-432
    872,-547,-609
    833,512,582
    807,604,487
    839,-516,451
    891,-625,532
    -652,-548,-490
    30,-46,-14`,
    results: {
      first: 79,
      second: 3621
    },
  },
];

export const input = `--- scanner 0 ---
534,645,-322
388,-625,-587
-374,865,677
699,588,504
-319,800,690
449,-685,-738
884,581,405
131,93,-1
-235,-774,713
-312,-878,705
-329,-787,824
-715,888,-428
7,-85,64
-382,720,536
603,-680,489
702,605,-358
542,566,-374
-385,-335,-417
708,-707,515
-325,-363,-531
-349,-384,-424
-605,815,-439
777,605,400
748,-688,524
431,-699,-732
-689,893,-402

--- scanner 1 ---
909,417,525
641,-677,-385
-479,751,537
-477,448,-516
-466,-409,624
-572,-417,551
909,491,506
711,624,-703
-13,152,9
-447,-344,-622
886,385,540
590,690,-726
-365,725,658
174,54,-60
-569,622,-513
481,-336,523
-431,723,492
-478,-309,-465
642,-320,569
651,490,-705
-588,-332,-608
707,-649,-535
-621,485,-585
673,-558,-366
555,-334,625
-666,-398,649

--- scanner 2 ---
-842,-325,-518
-600,703,756
396,-406,-721
-784,-511,507
-662,694,685
-378,635,-708
687,721,503
597,762,417
426,-732,546
-729,-458,660
-686,-308,-611
-726,-382,-539
386,-500,-642
-847,-567,653
437,-320,-622
728,860,482
-17,99,49
606,-797,571
-443,622,-763
296,619,-686
-633,901,713
428,607,-802
364,631,-768
-523,776,-700
498,-802,651

--- scanner 3 ---
-748,564,480
69,81,-77
-757,545,520
-51,8,41
-826,681,-574
-502,-530,488
315,-539,776
446,-575,-557
-814,667,-715
-486,-697,-783
685,891,511
472,-416,-582
648,473,-623
474,-606,744
744,926,386
-475,-656,-857
684,585,-576
568,582,-598
359,-699,708
-565,-644,-927
-576,-622,612
676,947,568
590,-504,-590
-582,-461,590
-849,824,-684
-783,572,625

--- scanner 4 ---
-553,-889,892
-634,-732,-627
629,419,883
-625,-670,-556
-431,335,-373
377,-646,740
-332,240,-461
527,-603,-531
-530,685,976
-707,-809,829
593,369,678
-510,222,-412
-832,-699,-584
580,-548,-378
636,-485,-524
717,463,-331
-538,789,899
51,-65,79
394,-490,647
795,472,-516
639,516,-491
659,364,875
451,-606,668
-566,-954,837
-419,698,882

--- scanner 5 ---
736,-701,-393
325,-687,642
295,-638,756
-716,-764,-354
-617,746,520
511,704,709
-571,471,-488
-505,469,-654
-619,443,-533
272,-483,668
769,777,-521
571,570,707
-24,-1,65
698,-713,-273
746,809,-536
450,504,730
-700,-760,-317
-709,572,517
691,-612,-392
-402,-691,562
-447,-602,642
-761,709,589
-159,-121,-64
769,703,-502
-576,-904,-348
-444,-508,519

--- scanner 6 ---
-476,-590,332
522,-808,-890
-601,-452,-695
406,438,609
440,586,582
410,894,-571
-904,611,725
-874,616,-544
16,65,3
500,-697,-911
-903,657,-616
-432,-572,395
-530,-584,278
389,-328,713
-53,189,-148
490,830,-552
419,-391,746
-435,-473,-607
346,579,562
740,-733,-889
406,-418,719
418,839,-745
-902,480,-557
-764,619,769
-724,603,758
-375,-488,-708

--- scanner 7 ---
-527,858,-387
624,859,757
429,451,-373
428,-546,-653
-664,-462,-754
-733,-606,-791
-736,-514,-617
-734,-779,463
-11,92,33
527,-633,-660
580,702,696
719,-492,862
-453,887,746
-691,-821,646
434,361,-422
736,-387,789
-431,928,716
501,450,-485
538,-476,-617
-611,-776,557
-350,835,727
874,-407,859
644,722,697
-513,876,-393
-587,919,-538

--- scanner 8 ---
-543,-889,-520
-730,564,-390
346,-789,-747
439,-701,-681
621,-725,691
-737,351,670
537,299,967
86,-69,45
-549,-684,-605
636,-760,634
-538,-887,-618
-756,493,-416
-758,297,523
681,-589,658
-685,-502,748
407,-794,-670
568,435,-431
518,318,880
455,332,883
1,48,181
-707,-612,656
499,495,-575
-662,588,-478
-757,268,734
490,418,-479
-595,-643,812

--- scanner 9 ---
527,-585,614
-377,-670,676
-471,526,686
-757,-557,-380
-774,-752,-371
602,677,399
-769,-549,-422
851,-533,-772
756,801,-600
-395,-588,569
560,613,434
948,-508,-731
146,29,-103
-743,480,-702
460,-586,525
577,599,554
79,138,48
773,832,-754
-404,426,583
-626,558,-606
871,-585,-592
-371,585,550
826,766,-732
427,-576,427
-754,527,-655
-326,-509,658

--- scanner 10 ---
434,768,343
764,-676,-426
-283,-643,505
-841,-759,-516
-344,-794,445
397,366,-880
103,31,-147
-751,-808,-511
417,649,252
-533,634,-583
490,-473,795
-752,-696,-583
-603,459,423
430,-587,767
-635,714,-652
844,-660,-553
-326,-788,431
340,657,356
432,503,-921
-511,640,-744
512,416,-820
-498,433,450
-6,-30,32
872,-658,-526
-643,468,442
454,-480,746

--- scanner 11 ---
663,466,-361
471,-383,724
515,406,557
-679,-668,554
564,595,-350
-438,781,843
-640,806,-355
-526,796,-340
-750,856,-328
45,-36,15
501,397,819
449,-436,790
-467,729,646
-453,-498,-411
472,-261,-550
496,388,788
-122,130,80
431,-358,-575
-542,-489,-327
586,587,-389
-536,-643,567
611,-338,-627
-570,-471,-292
-546,-579,621
-351,735,685
603,-453,759

--- scanner 12 ---
-569,-708,-836
578,787,566
419,796,500
568,426,-549
-920,775,647
382,774,574
497,-437,557
452,-385,750
-683,-718,-821
457,-395,607
-579,-592,698
-585,577,-849
543,-499,-787
521,-507,-826
620,-378,-815
-939,656,615
-496,586,-765
-770,747,581
-613,559,-884
-112,37,-45
-793,-768,-848
-602,-526,577
429,349,-626
388,446,-601
-600,-392,637

--- scanner 13 ---
-523,-453,404
428,-599,477
416,-610,-646
-700,560,-615
-36,-75,45
-668,-521,-483
-499,-419,468
-799,745,-622
586,481,621
-804,638,-598
514,-500,436
500,627,664
608,-579,426
818,458,-729
547,504,669
-514,-458,-403
-685,500,498
818,325,-818
116,19,-77
490,-682,-686
881,376,-807
-527,-513,-338
433,-703,-802
-716,311,576
-511,-535,336
-773,446,534

--- scanner 14 ---
-522,-400,391
-509,-623,-702
-509,619,336
675,-683,-752
23,56,9
437,548,517
-771,633,327
-565,-498,531
700,-470,390
757,-548,388
912,-523,417
-742,685,-506
-587,-468,-677
-523,-503,-719
675,523,-408
676,-594,-819
-542,-406,567
623,703,-428
-740,638,318
666,-496,-852
-711,531,-523
398,570,525
409,471,396
598,662,-331
-676,663,-453

--- scanner 15 ---
-655,-568,-439
548,-575,-425
676,563,918
443,320,-283
737,-424,799
640,-488,794
345,-564,-412
-629,613,-395
343,-569,-510
-498,-353,733
789,-539,705
725,679,926
-744,596,816
-548,604,829
74,27,165
-486,-423,823
438,381,-360
-754,-655,-446
-669,563,-353
531,413,-349
636,559,884
-644,-725,-482
-674,420,-343
-38,-137,63
-707,670,838
-445,-497,812

--- scanner 16 ---
-767,619,645
-597,-729,523
-453,-692,592
-498,781,-351
928,-476,669
-770,525,522
403,985,-662
614,-705,-561
-709,-452,-651
937,778,825
521,902,-728
-643,-454,-485
-638,921,-345
-514,777,-314
867,-325,729
420,986,-775
55,101,106
782,-741,-601
-812,708,565
774,-689,-522
885,-331,743
-505,-555,520
-595,-426,-530
896,808,803
844,789,906

--- scanner 17 ---
-649,799,-401
-784,820,-413
-704,925,587
537,645,-660
-561,845,528
765,-805,531
549,726,838
-682,923,-397
668,694,857
550,653,-464
898,-470,-650
528,579,-501
738,-686,414
-321,-342,618
747,-770,503
-730,-498,-862
-308,-377,612
-638,934,602
148,142,-100
577,660,688
41,48,0
975,-547,-511
-747,-303,-871
-742,-506,-820
-273,-522,582
878,-522,-470

--- scanner 18 ---
760,421,-664
-421,652,-463
801,550,634
510,-715,-535
-544,-457,417
521,-808,-503
-429,624,584
153,-63,-13
14,23,-96
-293,666,696
-633,-606,366
-507,825,-483
616,481,-595
444,-803,-442
-723,-610,-681
586,-698,453
573,-901,442
671,-903,447
775,479,660
-459,750,678
-757,-570,-685
-479,630,-487
713,574,566
-638,-509,302
-765,-521,-801
712,404,-586

--- scanner 19 ---
-725,440,-714
634,594,661
732,307,-423
-751,-745,518
727,356,-333
-819,460,-721
623,551,504
-366,621,665
-53,-10,-32
-569,608,654
-656,-561,-730
-610,-809,608
-857,-622,-742
30,-172,47
537,-823,-831
733,587,574
517,-763,-694
-364,523,660
442,-928,520
-759,413,-862
581,-762,-674
-641,-653,496
287,-925,435
425,-855,415
-818,-632,-669
660,419,-422

--- scanner 20 ---
-637,620,-492
521,-626,-447
522,-677,310
-670,545,677
-494,615,-482
279,791,594
-744,582,699
423,844,673
494,634,-578
-607,-437,-489
-629,-776,559
491,-520,345
-678,741,690
-546,-416,-689
581,535,-585
14,100,-2
-133,16,-118
613,-629,-621
-687,660,-534
632,-534,333
349,803,684
-667,-439,-623
-663,-607,650
651,645,-621
-597,-757,678
665,-557,-484

--- scanner 21 ---
-461,-694,806
620,405,-615
765,397,-474
-608,351,721
-788,-725,-627
-553,359,751
-91,-30,46
-426,-819,865
374,-574,871
-874,258,-438
700,342,-461
-807,-685,-636
-558,556,685
285,-441,871
488,-676,-647
-887,352,-327
481,-861,-746
-780,-580,-662
296,-492,934
457,494,469
-978,335,-446
-405,-637,797
301,587,486
417,566,543
505,-754,-751

--- scanner 22 ---
471,-311,-670
-373,-545,819
-645,-261,-439
-368,-521,712
406,-560,477
-673,545,-345
-472,-538,634
26,119,41
-661,413,-461
354,-481,469
496,806,681
476,863,526
-487,575,574
386,588,-552
450,822,741
511,618,-534
460,-238,-780
-399,611,520
-456,653,385
-504,-406,-447
-658,-326,-384
390,-521,637
408,616,-692
-649,481,-379
434,-233,-754

--- scanner 23 ---
9,87,105
-183,-17,-84
-883,-714,-742
-881,491,766
-730,-416,809
403,-731,745
291,434,-373
384,-667,665
-750,-423,715
341,549,-433
-751,801,-827
565,-474,-509
-834,-804,-737
722,971,633
-733,909,-727
639,-598,-601
577,-676,737
743,860,655
428,469,-332
-887,581,749
-735,881,-700
-771,-715,-670
-914,554,736
-777,-275,749
559,-496,-670
721,896,415

--- scanner 24 ---
-238,542,596
-429,-624,-683
702,499,823
-303,507,-705
596,757,-575
440,-589,721
575,549,798
461,700,-533
548,-545,697
-350,-530,-673
777,-516,-445
-272,-561,684
-284,-672,817
-449,-444,-632
650,669,-611
481,-640,690
-294,483,582
21,-69,168
-385,495,-773
654,-563,-440
-269,483,-641
-280,-498,884
-245,410,701
631,-602,-488
583,536,686

--- scanner 25 ---
548,579,-606
-763,551,282
-503,-613,383
559,422,-649
-712,552,-475
449,492,-613
522,-723,549
-511,-758,348
-715,460,-649
-20,-42,-93
-484,-653,374
-643,408,-512
-620,441,305
450,-505,-893
705,794,566
-506,-912,-879
-566,-973,-728
-492,-930,-873
-606,582,317
758,650,645
83,-180,-13
683,-745,555
455,-415,-844
717,724,656
522,-504,-781
591,-621,629

--- scanner 26 ---
-595,-549,-755
713,834,523
-709,299,-594
-641,-487,589
664,826,639
519,-441,789
431,-375,882
-681,-445,639
-617,-557,-794
-719,746,532
426,-452,821
-99,64,-14
-518,-428,-783
547,787,-516
-560,737,598
-756,724,606
423,-422,-492
-570,376,-517
-686,-435,782
-750,396,-569
476,-449,-280
501,-420,-435
449,820,-526
-43,-39,132
624,792,643
636,720,-517

--- scanner 27 ---
546,-670,-919
-591,530,702
352,463,504
524,-713,745
-543,932,-731
641,-658,-791
104,-29,-80
429,359,512
409,-773,795
444,-814,658
-521,-476,527
-335,-554,-370
-725,911,-799
-631,549,693
-499,-637,521
445,729,-655
453,784,-685
-31,48,29
558,-743,-800
-367,-621,-529
-403,-714,-414
446,450,393
-486,557,728
650,779,-619
-600,876,-740
-623,-545,447`;
