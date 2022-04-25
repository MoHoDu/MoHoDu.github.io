---
layout: post
title: "구현 - 실전 문제"
excerpt: "이것이 취업을 위한 코딩테스트다 책 구현 문제 공부 2"

categories:
  - Algorithm

tags:
  - [Algorithm, Study]

toc: true
toc_sticky: true

date: 2022-04-25
last_modified_at: 2022-04-25
---

## **↘︎ 문제1 - 왕실의 나이트**

---

| 시간 제한 | 풀이 시간 | 메모리 제한 | 난이도 |
| :-------- | :-------- | :---------- | :----- |
| 1초       | 20분      | 128MB       | 1 / 3  |

### ↘︎ 문제 내용

> #### &nbsp;행복 왕국의 왕실 정원은 체스판과 같은 8 x 8 좌표 평면이다. 왕실 정원의 특정한 한 칸에 나이트가 서 있다. 나이트는 매우 충성스러운 신하로서 매일 무술을 연마한다.
>
> #### &nbsp;나이트는 말을 타고 있기 때문에 이동을 할 때는 L자 형태로만 이동할 수 있으며 정원 밖으로는 나갈 수 없다. 나이트는 특정한 위치에서 다음과 같은 2가지 경우로 이동할 수 있다.
>
> &nbsp;
>
> #### 1. 수평으로 두 간 이동한 뒤에 수직으로 한 칸 이동하기
>
> #### 2. 수직으로 두 칸 이동한 뒤에 수평으로 한 칸 이동하기
>
> &nbsp;  
> &nbsp;&nbsp;&nbsp;&nbsp;a&nbsp; b&nbsp; c&nbsp; d&nbsp; e&nbsp; f&nbsp; g&nbsp; h  
> &nbsp;1&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼  
> &nbsp;2&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻  
> &nbsp;3&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼  
> &nbsp;4&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻  
> &nbsp;5&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼  
> &nbsp;6&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻  
> &nbsp;7&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼  
> &nbsp;8&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻&nbsp;◼&nbsp;◻
>
> #### &nbsp;이처럼 8 x 8 좌표 평면상에서 나이트의 위치가 주어졌을 때 나이트가 이동할 수 있는 경우의 수를 출력하는 프로그램을 작성하시오. 이때 왕실의 정원에서 행 위치를 표현할 때는 1부터 8로 표현하며, 열 위치를 표현할 때는 a부터 h로 표현한다.
>
> #### &nbsp;예를 들어 만약 나이트가 a1에 있을 때 이동할 수 있는 경우의 수는 다음 2가지이다. a1의 위치는 좌표 평면에서 구석의 위치에 해당하며 나이트는 정원의 밖으로는 나갈 수 없기 때문이다.
>
> &nbsp;
>
> #### 1. 오른쪽으로 두 칸 이동 후 아래로 한 칸 이동하기(c2)
>
> #### 2. 아래로 두 칸 이동 후 오른쪽으로 한 칸 이동하기(b3)
>
> &nbsp;
>
> #### &nbsp;또 다른 예로 나이트가 c2에 위치해 있다면 나이트가 이동할 수 있는 경우의 수는 6가지이다. 이건 직접 계산해보시오.

&nbsp;

### ↘︎ 입력 조건

     첫째 줄에 8 x 8 좌표 평면 상에서 현재 나이트가 위치한 곳의 좌표를 나타내는 두 문자로 구성된 문자열이 입력된다. 입력 문자는 a1처럼 열과 행으로 이뤄진다.

&nbsp;

### ↘︎ 출력 조건

     첫째 줄에 나이트가 이동할 수 있는 경우의 수를 출력하시오.

&nbsp;

### ↘︎ 입력 예시

    a1

&nbsp;

### ↘︎ 출력 예시

    2

&nbsp;이 문제의 경우는 이전 예제1 '상하좌우' 문제와 유사한 시뮬레이션 유형의 문제이다. 그때처럼 이동할 수 있는 방법들을 따라서 하나씩 이동시켜보면서 가능하다면 경우의 수 + 1을 하는 식으로 풀면 된다.  
&nbsp;이번 경우에는 나이트의 이동 경로를 다음과 같이 표현할 수 있다.  
&nbsp;  
↘︎  
steps = [(2, 1), (2, -1), (-2, 1), (-2, -1), (1, 2), (1, -2), (-1, 2), (-1, -2)]  
(음수의 경우는 왼쪽으로 이동하거나 아래쪽으로 이동한 경우이다.)  
&nbsp;  
&nbsp;이를 이용해 총 8가지의 방법을 반복문을 통해 초기 좌표에서 x, y값에 더하고, 8 x 8 좌표 평면에서 벗어나지 않는 경우를 구하면 된다. 다만, a로 표현된 x값을 ord()라는 내장함수를 통해서 문자의 유니코드로 변환받고, 'a'가 1이여야 하기 때문에 'a'의 유니코드 값을 빼고 1을 추가하는 식의 과정이 추가로 필요하겠다.  
&nbsp;

### ↘︎ 풀이

```python
# start point를 입력받기
start = input()

# start point의 좌표를 설정하기
x = int(ord(start[0])) - int(ord('a')) + 1
y = int(start[1])

# 나이트가 이동할 수 있는 8가지의 방법 정의하기
steps = [(2, 1), (2, -1), (-2, 1), (-2, -1), (1, 2), (1, -2), (-1, 2), (-1, -2)]

count = 0
# 8가지의 방법에 대해서 각각 이동 가능한지 판단하기
for step in steps:
    next_x = x + step[0]
    next_y = y + step[1]
    # 이동 가능할 시에 count += 1
    if (next_x >= 1 and next_x <= 8 and next_y >= 1 and next_y <= 8 ):
        count += 1

print(count) # 답 출력
```

&nbsp;

#### &nbsp;<span style='color: pink'>**앞서 예제 1에서의 이동 방법을 표현하는 방식과 이번에 방식 모두 앞으로 자주 사용하게 될 것이므로 기억해두는 편이 좋다.**</span>

&nbsp;  
**↘︎ 방법 1  
<span style='color: pink'>&nbsp;types = ["L", "R", "U", "D"]  
&nbsp;move_x = [0, 0, -1, 1]  
&nbsp;move_y = [-1, 1, 0, 0]</span>  
&nbsp;  
↘︎ 방법 2  
<span style='color: pink'>&nbsp;steps = [(2, 1), (2, -1), (-2, 1), (-2, -1), (1, 2), (1, -2), (-1, 2), (-1, -2)]**</span>  
&nbsp;

## **↘︎ 문제2 - 게임 개발**

---

| 시간 제한 | 풀이 시간 | 메모리 제한 | 난이도 |
| :-------- | :-------- | :---------- | :----- |
| 1초       | 40분      | 128MB       | 2 / 3  |

### ↘︎ 문제 내용

> #### &nbsp;현민이는 게임 캐릭터가 맵 안에서 움직이는 시스템을 개발 중이다. 캐릭터가 있는 장소는 1 x 1 크기의 정사각형으로 이뤄진 N x M 크기의 직사각형으로, 각각의 칸은 육지 또는 바다이다. 캐릭터는 동서남북 중 한 곳을 바라본다.
>
> #### &nbsp;맵의 각 칸은 (A, B)로 나타낼 수 있고, A는 북쪽으로부터 떨어진 칸의 개수, B는 서쪽으로부터 떨어진 칸의 개수이다. 캐릭터는 상하좌우로 움직일 수 있고, 바다로 되어 있는 공간에는 갈 수 없다. 캐릭터의 움직임을 설정하기 위해 정해 놓은 매뉴얼은 이러하다.
>
> &nbsp;
>
> #### 1. 현재 위치에서 현재 방향을 기준으로 왼쪽 방향(반시계 방향으로 90도 회전한 방향)부터 차례대로 갈 곳을 정한다.
>
> #### 2. 캐릭터의 바로 왼쪽 방향에 아직 가보지 않은 칸이 존재한다면, 왼쪽 방향으로 회전한 다음 왼쪽으로 한 칸을 전진한다. 왼쪽 방향에 가보지 않은 칸이 없다면, 왼쪽 방향으로 회전만 수행하고 1단계로 돌아간다.
>
> #### 3. 만약 네 방향 모두 이미 가본 칸이거나 바다로 되어 있는 칸인 경우에는, 바라보는 방향을 유지한 채로 한 칸 뒤오 가고 1단계로 돌아간다. 단, 이때 뒤쪽 방향이 바다인 칸이라 뒤로 갈 수 없는 경우에는 움직임을 멈춘다.
>
> &nbsp;
>
> #### &nbsp;현민이는 위 과정을 반복적으로 수행하면서 캐릭터의 움직임에 이상이 있는지 테스트하려고 한다. 매뉴얼에 따라 캐릭터를 이동시킨 뒤에, 캐릭터가 방문한 칸의 수를 출력하는 프로그램을 만드시오.

&nbsp;

### ↘︎ 입력 조건

     첫째 줄에 맵의 세로 크기 N과 가로 크기 M을 공백으로 구분하여 입력한다. (N >= 3, M <= 50)
     둘째 줄에 게임 캐릭터가 있는 칸의 좌표 (A, B)와 바라보는 방향 d가 각각 서로 공백으로 구분하여 주어진다. 방향 d의 값은 다음과 같다.
     - 0 : 북쪽
     - 1 : 동쪽
     - 2 : 남쪽
     - 3 : 서쪽

     셋째 줄부터 맵이 육지인지 바다인지 입력한다. N개의 줄에 맵의 상태가 북쪽부터 남쪽 순서대로, 각 줄의 데이터는 서쪽부터 동쪽 순서대로 주어진다. 맵의 외곽은 항상 바다로 되어 있다.
     - 0 : 육지
     - 1 : 바다

     처음에 게임 캐릭터가 위치한 칸의 상태는 항상 육지이다.

&nbsp;

### ↘︎ 출력 조건

     첫째 줄에 이동을 마친 후 캐릭터가 방문한 칸의 수를 출력한다.

&nbsp;

### ↘︎ 입력 예시

    4 4         # 4 x 4 맵 생성
    1 1 0       # (1, 1)에 북쪽(0)을 바라보고 서 있는 캐릭터
    1 1 1 1     # 첫 줄은 모두 바다
    1 0 0 1     # 둘째 줄은 바다/육지/육지/바다
    1 1 0 1     # 셋째 줄은 바다/바다/육지/바다
    1 1 1 1     # 넷째 줄은 모두 바다

&nbsp;

### ↘︎ 출력 예시

    3

&nbsp;전형적인 시뮬레이션 유형 문제이면서 삼성전자 공채에서 자주 출제되는 대표적인 케이스이기도 히다. 별도의 알고리즘이 필요 없지만 문제가 길고 이해하여 코드로 옮기는 데에는 다소 어려울 수 있으므로 숙달이 필요하다.  
&nbsp;<span style='color: pink'>**한 가지 팁은 이런 식으로 방향을 설정해 이동하는 문제에서는 dx, dy라는 별도 리스트를 설정해서 방향을 정의하는 것이 효과적이다. 또한, 이런 2차원 리스트를 선언할 때에는 컴프리헨션(list = [])을 통해서 초기화하고 사용하는 것이 효과적이라는 점을 기억해야 한다.**</span>  
&nbsp;또한, 메서드를 만들면서 global 키워드를 통해서 방향을 바꿨는데 이는 애초에 d(방향 변수)가 전역 변수이기 때문이다.  
&nbsp;

### ↘︎ 풀이

```python
# N, M을 공백으로 구분하여 입력받기
N, M = map(int, input().split())

# 캐릭터 위치를 공백으로 구분해서 x 값, y 값, 방향 값 입력받기
x, y, d = map(int, input().split())

# 맵 데이터를 한 줄씩 공백으로 구분해서 입력받기
map_data = []
for i in range(N):
    map_data.append(list(map(int, input().split())))

# 북, 동, 남, 서 방향마다의 x, y 이동 값 정의
dx = [-1, 0, 1, 0]
dy = [0, 1, 0, -1]

# 현재 위치를 방문한 위치로 처리
map_data[x][y] = 2

# 왼쪽으로 회전 정의
def turn_left() :
    global d
    d = (d + 3) % 4

count = 1
count_turn = 0
# 시뮬레이션 시작
while True:
    # 1. 왼쪽으로 회전
    turn_left()
    next_x = x + dx[d]
    next_y = y + dy[d]
    # 전방 타일이 육지고, 방문한 적이 없다면 이동
    if (map_data[next_x][next_y] == 0):
        x = next_x
        y = next_y
        # 이동 후에 현 위치를 방문한 위치로 처리
        map_data[x][y] = 2
        # 이동 타일 갯수 + 1
        count += 1
        count_turn = 0
        continue
    else:
        # 그렇지 않다면 회전수만 + 1
        count_turn += 1
    # 만약 회전수가 4번(동서남북으로 다 돌아본 경우)인 경우
    if count_turn == 4:
        next_x = x - dx[d]
        next_y = y - dy[d]
        # 뒤 타일이 바다인 경우 프로그램 종료
        if (map_data[next_x][next_y] == 1):
            break
        # 뒤 타일이 육지인 경우 이동한 뒤 회전수 = 0
        else :
            x = next_x
            y = next_y
        count_turn = 0

print(count) # 답 출력
```