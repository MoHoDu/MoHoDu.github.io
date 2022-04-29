---
layout: post
title: "CT Problems 01"
excerpt: "Computational Thinking 문제 1"

categories:
  - CT

tags:
  - [CT, SSAFY, Study]

toc: true
toc_sticky: true

date: 2022-04-29
last_modified_at: 2022-04-29
---

### CT 문제 풀이집

---

**↘︎ 문제 1 설명**

```
<이동하기>
유니는 지금 2 * m 행렬의 (1,1) 위치에 있다.
행렬의 각 칸에는 그 칸을 지날 때의 점수가 적혀 있다.
유니는 (1,1)위치에서 오른쪽, 아래 방향으로만 이동해 (2,m)위치로 이동하려고 한다.
유니가 얻을 수 있는 최대 점수를 구하여라.

예시)
1  2  3
10 5  6

맵이 위와 같이 주어진다면, 유니는 가장 왼쪽 위에 있는 1에서 출발해 가장 오른쪽 아래에 있는 6으로 가려고 한다.

유니가 아래 → 오른쪽 → 오른쪽으로 이동할 경우 1 + 10 + 5 + 6 = 22점을 얻을 수 있다.
유니가 오른쪽 → 아래 → 오른쪽으로 이동할 경우 1 + 2 + 5 + 6 = 14점을 얻을 수 있다.
유니가 오른쪽 → 오른쪽 → 아래으로 이동할 경우 1 + 2 + 3 + 6 = 12점을 얻을 수 있다.

따라서 유니가 얻을 수 있는 최대 점수는 22점이다.
```

**↘︎ 문제1 세부 문제들**

```
4)
11 06 08 09 10 02 20
08 03 02 09 20 06 07

5)

```

**↘︎ 풀이**

1. 누적합 방법  
    11 06 08 09 10 02 20  
    (11 17 25 34 44 46 66)👉  
    08 03 02 09 20 06 07  
    (55 47 44 42 33 13 07)👈  
   : 66 64 69 76 77 59 67 중에 77이 가장 큼

2. DP  
    11 06 08 09 10 02 20  
   (**11** _17_ **25** **34** **44** _46_ _66_)  
    08 03 02 09 20 06 07  
   (**19** _22_ _27_ _43_ **64** **70** **77**)

- 6 < 8 → 11 + 8 = 19로
- 19 > 17(11 + 6) → 19 + 3 = 22로
- 22 < 25(17 + 8) → 25 + 2 = 27로....