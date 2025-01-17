---
layout: post
title: "구현 - 개요 및 예제"
excerpt: "이것이 취업을 위한 코딩테스트다 책 구현 문제 공부 1"

categories:
  - Algorithm

tags:
  - [Algorithm, Study]

toc: true
toc_sticky: true

date: 2022-04-21
last_modified_at: 2022-04-25
---

## **아이디어를 코드로 바꾸는 구현**

&nbsp;

### 개요

---

&nbsp;  
&nbsp;코딩 테스트에서 '구현'이란 '머릿속에 있는 알고리즘을 소스코드로 완전히 바꾸는 과정'이다. 즉 '구현' 유형은 모든 문제를 포괄하고 있는 유형이라고도 볼 수 있다. 하지만 이를 무시하기에는 코딩 테스트에서는 이 '구현' 유형이 중심이 되는 문제가 상당히 많이 나온다. 즉, 코딩 테스트를 위해서는 반드시 공부해야 하는 것이라는 말이다.  
&nbsp;  
&nbsp;그렇다면 어떤 문제가 '구현' 유형 문제로 따로 빼서 말할 수 있을까? 우리가 알고리즘 문제를 푸는데 항상 먼저 문제를 읽는다. 그리고 그 문제를 풀 수 있을만한 아이디어를 얻고, 알고리즘을 짠다. 하지만 이것만으로 문제를 풀 수는 없다. 그 이유는 소스코드로 이 알고리즘을 바꾸지 못했기 때문이다. 즉, 이런 소스코드로 바꾸기 어려운 문제가 '구현' 문제, 어려운 '구현' 문제라고 할 수 있다. 예를 들면, 알고리즘은 간단한데, 코드가 지나칠 만큼 길어지는 문제나 특정 소수점 자리까지 출력하거나 문자열이 입력으로 주어질 때에 한 문자 단위로 끊어서 리스트로 넣어야 하는(파싱을 해야 하는) 등의 문제가 이에 해당한다고 할 수 있다.  
&nbsp;  
&nbsp;이 책에서는 '완전 탐색'과 '시뮬레이션' 유형을 모두 '구현' 유형으로 넣어서 보고 있으므로 나 역시 그러하게 필기를 할 것이다. 참고로 <span style='color: pink'>'**완전 탐색**'</span>은 <span style='color: pink'>**모든 경우의 수들을 하나도 빠짐없이 다 계산하는 방식**</span>이고, <span style='color: #FFD59E'>'**시뮬레이션**'</span>은 <span style='color: #FFD59E'>**문제에서 제시한 알고리즘을 한 단계씩 차례대로 직접 수행해야 하는 문제 유형**</span>을 의미한다.  
&nbsp;

### **구현 시 주의해야 할 메모리 제약 사항**

---

&nbsp;

#### **↘︎ C/C++에서의 변수 표현 범위**

&nbsp;전통적으로 프로그래밍 언어에서 정수형을 표현할 때에는 int 자료형을 주로 사용한다. 이는 4바이트 크기를 지녔다. 그리고, 표현 범위는 -2,147,483,648 ~ 2,147,438,647 인데, 그렇다는 것은 이보다 큰 수는 int 자료형으로 처리가 불가능 하다는 말이 된다.  
&nbsp;  
&nbsp;그렇다면 그보다 큰 수는 어떻게 처리해야 할까? 이 경우는 먼저 8바이트 크기인 long long과 같은 자료형을 사용할 수 있다. 하지만, 이 또한 9,223,372,036,854,775,807보다 큰 수를 처리할 수가 없기 때문에 그 이상의 수는 결국 흔히 BigInteeger라고 불리는 클래스를 직접 구현하거나 인터넷을 통해서 외부 라이브러리를 가져와야 한다. Java의 경우는 이 라이브러리가 표준 라이브러리로 존재하지만 C++의 경우는 그렇지 않기 때문에 검색을 통해 찾아야 하는데, 이건 검색과 외부 라이브러리 사용이 가능한 코딩 테스트 환경인 경우에만 가능할 것이다.  
&nbsp;  
&nbsp;물론 이런 정도의 큰 수를 처리하는 문제는 잘 출제되지는 않는다. 다만, 이 경우 파이썬을 이용하면 프로그래머가 직접 이 변수에 자료형을 직접 지정할 필요가 없으며, 매우 큰 수에 대한 연산도 기본으로 지원하기 때문에 큰 걱정거리가 아니게 된다. 곧, 파이썬을 선택한 순간부터 나 역시 코딩 테스트에서 이 정수형 연산 문제 때문에 골머리를 앓는 일은 크게 줄었다고 생각할 수 있다.  
&nbsp;

#### **↘︎ 파이썬에서 리스트 크기**

---

&nbsp;  
&nbsp;앞에서처럼 파이썬은 변수 선언에 있어서 미리 자료형을 명시할 필요가 없지만(구현상의 복잡도가 적은 편) 메모리나 처리 속도에서는 상대적으로 단점이 될 수 있는 언어이다. 예를 들면 파이썬에서 여러 개의 변수를 사용할 때에 흔히 리스트를 사용하는데 이 때에 리스트의 길이에 따라서(데이터 개수) int 자료형의 메모리 사용량이 다음과 같게 된다.  
&nbsp;

| 데이터 개수(리스트 크기) | 메모리 사용량 |
| :----------------------- | :------------ |
| 1,000                    | 약 4KB        |
| 1,000,000                | 약 4MB        |
| 10,000,000               | 약 40MB       |

&nbsp;대체로 코딩 테스트에서 128 ~ 512MB로 메모리를 제한하는데 알고리즘 상에서는 수백만 개 이상의 데이터 처리를 요하는 문제가 자주 나오기 때문에 파이썬으로 코딩을 할 경우 이 부분에 유의할 필요가 있다.

&nbsp;물론 그 정도로 많은 데이터 처리를 요하는 문제도 잘 출제되지는 않는다. 채점 환경 역시 이에 크게 영향을 받기 때문이다. 다만, 유의는 해야할 점이므로 <span style='color: pink'>**메모리 사용량 제한보다 더 적은 크기의 메모리를 사용해야 한다**</span>는 점만 기억하도록 해야겠다.  
&nbsp;

#### **↘︎ 채점 환경**

---

&nbsp;  
&nbsp;파이썬은 앞서 말한 것처럼 동작 속도도 타 언어에 비해 느린 편이다. 보통 문제에는 시간, 메모리 제한 등이 있는데, <span style='color: pink'>**파이썬은 대략 1초에 2,000만 번의 연산을 수행한다고 가정하고 풀면 시간 제한에 안정적**</span>일 수 있다.  
&nbsp;  
&nbsp;예를 들어서 시간 제한이 1초이고, 데이터의 개수가 100만인 문제가 있다면, 이 문제는 O(NlogN) 이내의 알고리즘을 이용해서 문제를 풀어야 한다. (O^2의 알고리즘부터는 100만 \* 100만 == 10,000만의 연산이 되어 2,000만 번의 연산을 넘어서므로...) 즉, 앞으로 문제를 풀 때에 시간 제한과 데이터 양에 따라서 어떤 시간 복잡도의 알고리즘으로 풀어야 할지를 미리 생각할 수 있어야 하겠다.  
&nbsp;

#### **구현 문제 접근 방법**

---

&nbsp;  
&nbsp;일단 구현 유형 문제는 큰 수의 처리나 문자열 처리가 많은 편이라 파이썬이 C/C++에 비헤 기본적으로 유리하다. 다만, 시간 측면에서 파이썬의 구현 속도가 이들보다 느린데, 최근에 코딩 테스트에서 Pypy3를 지원하는 곳이 늘고 있는데, 이는 파이썬3의 문법을 그대로 사용하면서도 C나 C++에 견줄만큼 속도가 빠르기 때문에 이를 지원하는 곳에서는 Pypy3를 적극적으로 사용하는 편이 좋다. (1초에 약 2,000만 ~ 1억번의 연산 속도)  
&nbsp;  
&nbsp;API 개발 문제 또한 구현 유형과 맞닿아 있는 문제인데 이 경우는 별도의 웹 서버나 데이터 분석에 대한 기초 지식이 필요하다. 이런 기능을 사용할 때에도 C++이나 자바에 비해서 파이썬은 매우 간결하고 직관적인 코드의 라이브러리를 사용할 수 있어서 더 유리한 면이 있다.  
&nbsp;

## **↘︎ 예제 문제1 - 상하좌우**

---

| 시간 제한 | 풀이 시간 | 메모리 제한 | 난이도 |
| :-------- | :-------- | :---------- | :----- |
| 1초       | 15분      | 128MB       | 1 / 3  |

### ↘︎ 문제 내용

> #### &nbsp;여행가 A는 N x N 크기의 정사각형 공간 위에 서 있다. 이 공간은 1 x 1 크기의 정사각형으로 나누어져 있다. 가장 왼쪽 위 좌표는 (1, 1)이며, 가장 오른쪽 아래 좌표는 (N, N)에 해당한다. 여행가 A는 상, 하, 좌, 우 방향으로 이동할 수 있으며, 시작 좌표는 항상 (1, 1)이다. 우리 앞에는 여행가 A가 이동할 계획이 적힌 계획서가 놓여 있다.
>
> &nbsp;  
> 🙂 ㅁ ㅁ ㅁ ㅁ  
> ㅁ ㅁ ㅁ ㅁ ㅁ  
> ㅁ ㅁ ㅁ ✔️ ㅁ  
> ㅁ ㅁ ㅁ ㅁ ㅁ  
> ㅁ ㅁ ㅁ ㅁ ㅁ
>
> #### &nbsp;계획서에는 하나의 줄에 띄어쓰기를 기준으로 하여, L, R, U, D 중 하나의 문자가 반복적으로 적혀있다. 각 문자의 의미는 다음과 같다.
>
> &nbsp;
>
> #### &nbsp;L : 왼쪽으로 한 칸 이동
>
> #### &nbsp;R : 오른쪽으로 한 칸 이동
>
> #### &nbsp;U : 위로 한 칸 이동
>
> #### &nbsp;D : 아래로 한 칸 이동
>
> &nbsp;
>
> #### &nbsp;이때 여행가 A가 N x N 크기의 정사각형 공간을 벗어나는 움직임은 무시된다. 예를 들어 (1, 1)의 위치에서 L 혹은 U를 만나면 무시된다. 다음은 N = 5인 지도와 계획서이다.
>
> &nbsp;  
> R → R → R → U → D → D  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**⇞** 공간 밖이므로 무시  
> ● → → → ㅁ  
> ㅁ ㅁ ㅁ ↓ ㅁ  
> ㅁ ㅁ ㅁ ✔️ ㅁ  
> ㅁ ㅁ ㅁ ㅁ ㅁ  
> ㅁ ㅁ ㅁ ㅁ ㅁ
>
> #### &nbsp;이 경우 6개의 명령에 따라서 여행가가 움직이게 되는 위치는 순서대로 (1, 2), (1, 3), (1, 4), (1, 4), (2, 4), (3, 4)이므로, 최종적으로 여행가 A가 도착하게 되는 곳의 좌표는 (3, 4)이다. 다시 말해 3행 4열의 위치에 해당하므로 (3, 4)라고 적는다. 계획서가 주어졌을 때 여행가 A가 최종적으로 도착할 지점의 좌표를 출력하는 프로그램을 작성하시오.

&nbsp;

### ↘︎ 입력 조건

     첫째 줄에 공간의 크기를 나타내는 N이 주어진다. (1 <= N <= 100)

     둘째 줄에 여행가 A가 이동할 계획서 내용이 주어진다. (1 <= 이동 횟수 <= 100)

&nbsp;

### ↘︎ 출력 조건

     첫 째 줄에 여행가 A가 최종적으로 도착할 지점의 좌표 (X, Y)를 공백으로 구분하여 출력한다.

&nbsp;

### ↘︎ 입력 예시

    5
    R R R U D D

&nbsp;

### ↘︎ 출력 예시

    3 4

&nbsp;이 문제를 요구사항대로 구현 시에 시간 복잡도는 O(N)이 된다. N이 최대 100이므로 사실상 시간 제한은 널널한 문제이다.  
&nbsp;이런 식으로 일련의 명령에 따라 실행하는 문제 유형이 바로 '시뮬레이션' 유형이며 구현이 중요한 대표적인 케이스이다. 난이도는 그렇게 어렵지 않기에 보통 그리디 알고리즘이나 구현 문제가 코딩 테스트의 1 ~ 2번 문제에 자주 출제되며, 쉽지만 합격을 좌우하는 아주 중요한 문제라고 할 수 있다.  
&nbsp;

### ↘︎ 풀이

```python
# N을 입력받기.
n = int(input())
# plan 공백 구분해서 입력받기
plans = input().split()

x, y = 1, 1 # x, y의 초기 위치 설정
# 이동 타입 지정
types = ["L", "R", "U", "D"]
# 타입의 인덱스에 맞게 각 타입에 따라 이동하는 x축 y축 값 설정
move_x = [0, 0, -1, 1]
move_y = [-1, 1, 0, 0]

for plan in plans :
    for idx in range(len(types)) :
        # 해당 plan과 같은 타입의 인덱스 값으로 x, y를 이동
        if plan == types[idx] :
            next_x = x + move_x[idx]
            next_y = y + move_y[idx]

    # 만약 지도 밖으로 넘어가면 무시
    if next_x < 1 or next_y < 1 or next_x > n or next_y > n :
        continue

    x, y = next_x, next_y # 새로운 위치로 x, y를 이동

print(x, y) # 답 출력
```

&nbsp;

## **↘︎ 예제 문제2 - 시각**

---

| 시간 제한 | 풀이 시간 | 메모리 제한 | 난이도 |
| :-------- | :-------- | :---------- | :----- |
| 2초       | 15분      | 128MB       | 1 / 3  |

### ↘︎ 문제 내용

> #### &nbsp;정수 N이 입력되면 00시 00분 00초부처 N시 59분 59초까지의 모든 시각 중에서 3이 하나라도 포함되는 모든 경우의 수를 구하는 프로그램을 작성하시오. 예를 들어 1을 입력했을 때 다음은 3이 하나라도 포함되어 있으므로 세어야 하는 시각이다.
>
> &nbsp;
>
> #### - 00시 00분 03초
>
> #### - 00시 13분 30초
>
> &nbsp;
>
> #### &nbsp;반면에 다음은 3이 하나도 포함되어 있지 않으므로 세면 안 되는 시각이다.
>
> &nbsp;
>
> #### - 00시 02분 55초
>
> #### - 01시 27분 45초

&nbsp;

### ↘︎ 입력 조건

     첫째 줄에 정수 N이 입력된다. (0 <= N <= 23)

&nbsp;

### ↘︎ 출력 조건

     00시 00분 00초부터 N시 59분 59초까지의 모든 시각 중에서 3이 하나라도 포함되는 모든 경우의 수를 출력한다.

&nbsp;

### ↘︎ 입력 예시

    5

&nbsp;

### ↘︎ 출력 예시

    11475

&nbsp;이 문제의 제한 시간은 2초이므로 대략 4000만번의 계산까지 처리할 수 있는데 반해 하루는 86,400초이기 때문에 모든 경우의 수를 하나씩 모두 세서 풀어도 되는 문제이다.  
&nbsp;그리하여 시간, 분, 초의 3중 반복문을 통해서 답을 도출하면 되는데, <span style='color:pink'>**이처럼 가능한 경우의 수를 모두 검사해보는 유형을 완전탐색 알고리즘이라고 한다.**</span> 완전 탐색 알고리즘은 구현 문제에서의 대표적인 문제 유형이기는 하지만, 비효율적인 시간 복잡도를 가지고 있기 때문에 데이터 개수가 많아지면 정상적으로 작동하지 않을 수 있기 때문에 <span style='color: pink'>**100만 개 이하일 경우**</span>에만 쓰는 것이 좋다.
&nbsp;

### ↘︎ 풀이

```python
# N을 입력받기
N = int(input())

count = 0
for hour in range(N+1): # 시간 : 0 ~ N
    for minute in range(60): # 분 : 0 ~ 59
        for second in range(60): # 초 : 0 ~ 59
            # time을 각 2자리(빈 자리는 0으로)로 하여 시간, 분, 초 순서대로 문자로 나열
            time = f'{hour:02d}{minute:02d}{second:02d}'
            # time에 '3'이 포함되어 있으면 count += 1
            if '3' in time:
                count += 1

print(count) # 답 출력
```
