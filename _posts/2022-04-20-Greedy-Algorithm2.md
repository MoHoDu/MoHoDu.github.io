---
layout: post
title: "그리디 알고리즘 - 02"
excerpt: "이것이 취업을 위한 코딩테스트다 책 그리디 알고리즘 공부 2"

categories:
  - Algorithm

tags:
  - [Algorithm, Study]

toc: true
toc_sticky: true

date: 2022-04-20
last_modified_at: 2022-04-20
---

## **큰 수의 법칙**

---

| 시간 제한 | 풀이 시간 | 메모리 제한 | 난이도 |
| :-------- | :-------- | :---------- | :----- |
| 1초       | 30분      | 128MB       | 1 / 3  |

### ↘︎ 문제 내용

> #### &nbsp; '큰 수의 법칙'은 일반적으로 통계 분야에서 다루어지는 내용이지만 동빈이는 본인만의 방식으로 다르게 사용하고 있다. 동빈이의 큰 수의 법칙은 다양한 수로 이루어진 배열이 있을 때 주어진 수들을 M번 더하여 가장 큰 수를 만드는 법칙이다. 단, 배열의 특정한 인덱스(번호)에 해당하는 수가 연속해서 K번을 초과하여 더해질 수 없는 것이 이 법칙의 특징이다.
>
> &nbsp;
>
> #### &nbsp; 예를 들어 순서대로 2, 4, 5, 4, 6으로 이루어진 배열이 있을 때 M이 8이고, K가 3이라고 가정하자. 이 경우 특정한 인덱스의 수가 연속해서 세 번까지만 더해질 수 있으므로 큰 수의 법칙에 따른 결과는 6 + 6 + 6 + 5 + 6 + 6 + 6 + 5인 46이 된다.
>
> &nbsp;
>
> #### &nbsp; 단, 서로 다른 인덱스에 해당하는 수가 같은 경우에도 서로 다른 것으로 간주한다. 예를 들어 순서대로 3, 4, 3, 4, 3으로 이루어진 배열이 있을 때 M이 7이고, K가 2라고 가정하자. 이 경우 두 번째 원소에 해당하는 4를 번갈아 두 번씩 더하는 것이 가능하다. 결과적으로 4 + 4 + 4 + 4 + 4 + 4 + 4인 28이 도출된다.
>
> &nbsp;
>
> #### &nbsp; 배열의 크기 N, 숫자가 더해지는 횟수 M, 그리고 K가 주어질 때 동빈이의 큰 수의 법칙에 따른 결과를 출력하시오.

&nbsp;

### ↘︎ 입력 조건

     첫째 줄에 N(2 <= N <= 1,000), M(1 <= M <= 10,000), K(1 <= K <= 10,000)의 자연수가 주어지며, 각 자연수는 공백으로 구분한다.

     둘째 줄에 N개의 자연수가 주어진다. 각 자연수는 공백으로 구분한다. 단, 각각의 자연수는 1 이상 10,000 이하의 수로 주어진다.

     입력으로 주어지는 K는 항상 M보다 작거나 같다.

&nbsp;

### ↘︎ 출력 조건

     첫 째 줄에 동빈이의 큰 수의 법칙에 따라 더해진 답을 출력한다.

&nbsp;

### ↘︎ 입력 예시

    5 8 3
    2 4 5 4 6

&nbsp;

### ↘︎ 출력 예시

    46

&nbsp;  
이 문제 역시 전형적인 그리디 문제 유형이다.  
여기서 가장 탐욕스러운 선택지는 가장 큰 수를 K번 더하고, 2번째로 큰 수를 1번 더한 뒤 다시 가장 큰 수를 K번 더하는 식으로 M번 숫자를 더하는 것이다.  
이를 토대로 파이썬 코드를 작성하면 다음과 같다.  
&nbsp;

### ↘︎ 반복문을 이용한 풀이

```python
# N, M, K를 공백 구분해서 입력받기
N, M, K = map(int, input().split( ))
# N개의 수를 공백 구분해서 배열로 입력받기
data = list(map(int, input().split()))

data.sort() # 배열을 정렬
first = data[N - 1] # 가장 큰 수 찾기
second = data[N - 2] # 가장 작은 수 찾기

result = 0

while True :
    for i in range(K) : # 가장 큰 수를 K번 더하기
        if m == 0: # M이 0이면 탈출
            break
        result += first
        m -= 1 # 더할 때마다 M - 1
    if m === 0: # M이 0이면 탈출
        break
    # 가장 큰 수를 K번 더한 뒤에 두 번째로 큰 수를 한 번 더하기
    result += second
    m -= 1 # 더할 때마다 M - 1

print(result) # 답 출력
```

하지만, 이런 식으로 하면, M의 크기가 100억 이상 커졌을 때에 시간 초과 판정을 받을 것이다.  
그맇다면 반복문으로 한 번씩 더하는 것이 아니라 가장 큰 수, 두 번째 큰 수가 각각 더해지는 갯수를 미리 구하면 어떨까?  
&nbsp;  
이럴 때에는 실제 문제에서 주어진 예시를 가지고 생각해보는 편이 좋다.  
M이 8이고, K가 3, 가장 큰 수(F)와 그 다음 수(S)가 6과 5라면 이상적인 덧셈은 다음과 같다.

    6 + 6 + 6 + 5 // 6 + 6 + 6 + 5

잘 보면 하나의 묶음에 K _ F + S가 있고, 한 묶음 당 숫자는 K + 1만큼 존재한다. 그렇다면 묶음의 개수는 M // (K + 1)개가 될 것이고, 각 묶음에서 F가 K개씩 있기 때문에 F는 (M // (K + 1)) _ K번 더하면 될 것 같다.  
&nbsp;  
하지만, K가 4인 경우는 좀 다르다.

    6 + 6 + 6 + 6 + 5 // 6 + 6 + 6

이 경우에는 위와 같이 계산하면 F는 (8 // 5) \* 4 = 4번 더하는 것으로 나오지만 실상은 4번하고 3번 더 더해야 한다. 즉, K + 1로 나눈 다음의 나머지에서도 F와 S의 갯수를 구해야 한다.  
일단 이 경우 나머지는 8 % (k + 1)인 3이 된다. 그런데 가장 큰 수는 4번까지 더할 수 있으므로 나머지 3번은 모두 F로 채워 더하면 된다. 즉, K + 1보다 작은 갯수에서는 두번째로 큰 수(S)가 들어갈 자리가 없다는 것이다.  
이를 토대로 F와 S가 더해질 갯수는 다음과 같이 정리할 수 있다.

&nbsp;  
→ count_first = ((M // (K + 1)) \* K) + (M % (K + 1))  
→ count_second = M - count_second

&nbsp;

### ↘︎ 더해질 갯수를 미리 구하는 풀이

```python
# N, M, K를 공백 구분해서 입력받기
N, M, K = map(int, input().split( ))
# N개의 수를 공백 구분해서 배열로 입력받기
data = list(map(int, input().split()))

data.sort() # 배열을 정렬
first = data[N - 1] # 가장 큰 수 찾기
second = data[N - 2] # 가장 작은 수 찾기

# 가장 큰 값이 더해지는 갯수
count_first = (M // (K + 1)) * K + (M % (K + 1))
# 두번째로 큰 값이 더해지는 갯수
count_secound = M - count_first
# 결과값 구하기
result = (first * count_first) + (second * count_secound)

print(result) # 답 출력
```

&nbsp;

## **숫자 카드 게임**

---

| 시간 제한 | 풀이 시간 | 메모리 제한 | 난이도 |
| :-------- | :-------- | :---------- | :----- |
| 1초       | -분       | 128MB       | 1 / 3  |

### ↘︎ 문제 내용

> #### &nbsp; 숫자 카드 게임은 여러 개의 숫자 카드 중에서 가장 높은 숫자가 쓰인 카드 한 장을 뽑는 게임이다. 단, 게임의 룰을 지키며 카드를 뽑아야 하고 룰은 다음과 같다.
>
> &nbsp;
>
> 1. #### 숫자가 쓰인 카드들이 N x M의 형태로 놓여 있다. 이때 N은 행의 개수를 의미하며, M은 열의 개수를 의미한다.
> 2. #### 먼저 뽑고자 하는 카드가 포함되어 있는 행을 선택한다.
> 3. #### 그다음 선택된 행에 포함된 카드들 중 가장 숫자가 낮은 카드를 뽑아야 한다.
> 4. #### 따라서 처음에 카드를 골라낼 행을 선택할 때, 이후에 해당 행에서 가장 숫자가 낮은 카드를 뽑을 것을 고려하여 최종적으로 가장 높은 숫자의 카드를 뽑을 수 있도록 전략을 세워야 한다.
>
> &nbsp;
>
> #### &nbsp; 예를 들어 3 x 3 형태로 카드들이 다음과 같이 놓여 있다고 가정하자.
>
> &nbsp;
>
> #### &nbsp;&nbsp; ---M개---
>
> #### &nbsp;&nbsp;3&nbsp; &nbsp; &nbsp; 1&nbsp; &nbsp; &nbsp; 2&nbsp; &nbsp; |
>
> #### &nbsp;&nbsp;4&nbsp; &nbsp; &nbsp; 1&nbsp; &nbsp; &nbsp; 4&nbsp; &nbsp; N개
>
> #### &nbsp;&nbsp;2&nbsp; &nbsp; &nbsp; 2&nbsp; &nbsp; &nbsp; 2&nbsp; &nbsp; |
>
> &nbsp;
>
> #### &nbsp; 여기서 카드를 골라낼 행을 고를 때 첫 번째 혹은 두 번째 행을 선택하는 경우, 최종적으로 뽑는 카드는 1이다. 하지만 세 번째 행을 선택하는 경우 최종적으로 뽑는 카드는 2이다. 따라서 이 예제에서는 세 번째 행을 선택하여 숫자 2가 쓰여진 카드를 뽑는 것이 정답이다.
>
> #### &nbsp; 카드들이 N x M 형태로 놓여 있을 때, 게임의 룰에 맞게 카드를 뽑는 프로그램을 만드시오.

&nbsp;

### ↘︎ 입력 조건

     첫째 줄에 숫자 카드들이 놓인 행의 개수 N과 열의 개수 M이 공백을 기준으로 하여 각각 자연수로 주어진다. (1 <= N, M <= 100)

     둘째 줄에 N개의 줄에 걸쳐 각 카드에 적힌 숫자가 주어진다. 각 숫자는 1 이상 10,000 이하의 자연수이다.

&nbsp;

### ↘︎ 출력 조건

     첫째 줄에 게임의 룰에 맞게 선택한 카드에 적힌 숫자를 출력한다.

&nbsp;

### ↘︎ 입력 예시 1

    3 3
    4 1 2
    4 1 4
    2 2 2

&nbsp;

### ↘︎ 출력 예시 1

    2

&nbsp;

### ↘︎ 입력 예시 2

    2 4
    7 3 1 8
    3 3 3 4

&nbsp;

### ↘︎ 출력 예시 2

    3

&nbsp;  
문제 설명이 살짝 어렵게 느껴질 수 있지만, 실상 문제에서 아이디어 도출하는 데에는 크게 어려움 없는 문제이다.  
여기서의 포인트는 <span style='color: pink'>**각 행마다 가장 작은 수를 찾은 다음 그 수들 중에서 가장 큰 수를 고르는 것**</span>이다.  
&nbsp;  
이 경우에 최소의 수를 구하기 위해서 min() 함수를 사용할 수 있으며, 필요시에는 이중 반복문 구조를 사용할 수도 있어야 한다. 지금은 일단 min() 함수만 사용해서도 다음과 같이 풀이를 할 수 있다.  
&nbsp;

### ↘︎ min() 함수를 이용한 풀이

```python
# N과 M을 공백 구분해서 입력받기
N, M = map(int, input().split())

result = 0
# 한 줄씩 총 N번 입력받아서 계산
for i in range(N) :
    data = list(map(int, input().split()))
    # 현재 행에서 가장 작은 수 도출하기
    min_value = min(data)
    # 가장 작은 수들 중에서 가장 큰 수 찾기
    result = max(result, min_value)

print(result) # 답 출력
```

&nbsp;

## **1이 될 때까지**

---

| 시간 제한 | 풀이 시간 | 메모리 제한 | 난이도 |
| :-------- | :-------- | :---------- | :----- |
| 1초       | -분       | 128MB       | 1 / 3  |

### ↘︎ 문제 내용

> #### &nbsp; 어떠한 수 N이 1이 될때까지 다음의 두 과정 중 하나를 반복적으로 선택하여 수행하려고 한다. 단, 두 번째 연산은 N이 K로 나누어떨어질 때만 선택할 수 있다.
>
> &nbsp;
>
> 1. #### N에서 1을 뺀다.
> 2. #### N을 K로 나눈다.
>
> &nbsp;
>
> #### &nbsp; 예를 들어 N이 17, K가 4라고 가정하자. 이때 1번의 과정을 한 번 수행하면 N은 16이 된다. 이후에 2번의 과정을 두 번 수행하면 N은 1이 된다. 결과적으로 이 경우 전체 과정을 실행한 횟수는 3이 된다. 이는 N을 1로 만드는 최소 횟수이다.
>
> &nbsp;
>
> #### &nbsp; N과 K가 주어질 때 N이 1이 될때까지 1번 혹은 2번의 과정을 수행해야 하는 최소 횟수를 구하는 프로그램을 작성하시오.

&nbsp;

### ↘︎ 입력 조건

     첫째 줄에 N(2 <= N <= 100,000)과 K(2 <= K <= 100,000)가 공백으로 구분되며 각각 자연수로 주어진다. 이때 입력으로 주어지는 N은 항상 K보다 크거나 같다.

&nbsp;

### ↘︎ 출력 조건

     첫째 줄에 N이 1이 될 때까지 1번 혹은 2번의 과정을 수행해야 하는 횟수의 최솟값을 출력한다.

&nbsp;

### ↘︎ 입력 예시

    25 5

&nbsp;

### ↘︎ 출력 예시

    2

&nbsp;  
이 문제 역시 아이디어를 도출해내는데 큰 어려움은 없다.  
주어진 N에 대해 가장 빠르게 1로 수를 줄이는 방법은 당연히 2번 방법이므로, <span style='color: pink'>**최대한 많이 나누는 경우**</span>를 찾으면 된다.  
&nbsp;  
그러기 위해서는 일단 K로 나눌 수 있을 때까지 N을 빼고, K의 배수가 된다면 나누는 과정을 거치면 된다.  
&nbsp;

### ↘︎ 단순한 풀이

```python
# N과 K를 공백 구분해서 입력받기
N, K = map(int, input().split())

result = 0
# N이 K 이상이라면 계속 나누기
while N >= K :
    # N이 K로 나누어 떨어지지 않으면 N - 1
    while N % K != 0 :
        N -= 1
        result += 1
    # K로 나누기
    N //= K
    result += 1

while N > 1 :
    N -= 1
    result += 1

print(result)
```

&nbsp;  
이 문제의 경우는 N의 범위가 10만 이하이므로, 이처럼 일일이 1씩 빼도 시간 초과가 되지는 않는다. 하지만 100억 이상의 큰 수의 경우를 가정한다면, N이 K의 배수가 될 때까지 한번에 나머지 값을 빼버리는 방식으로 하는 것이 옳다.  
&nbsp;

### ↘︎ 나머지를 한번에 빼는 풀이

```python
# N과 K를 공백 구분해서 입력받기
N, K = map(int, input().split())

result = 0
while True :
    quo = N // K # N을 K로 나눈 몫
    remain = N % K # N을 K로 나누고 난 나머지
    # 나머지 값들을 한번에 결과로 더하고, 추가로 1을 더하기
    result += remain + 1 # 나누는 행위 == 1개의 단계
    N = quo # N을 K로 나눈 몫으로 변경
    if N < K : # N이 K보다 작으면, 탈출
        break

result += (N - 1) # 1이 될 때까지 빼주는 단계
print(result) # 답 출력
```
