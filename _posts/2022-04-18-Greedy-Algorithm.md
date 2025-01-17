---
layout: post
title: "그리디 알고리즘 - 01"
excerpt: "이것이 취업을 위한 코딩테스트다 책 그리디 알고리즘 공부 1"

categories:
  - Algorithm

tags:
  - [Algorithm, Study]

toc: true
toc_sticky: true

date: 2022-04-18
last_modified_at: 2022-04-18
---

### _→ 현재 상황에서 지금 당장 좋은 것만 고르는 알고리즘_

&nbsp;  
<span style='background-color: pink; color: black'>**그리디 알고리즘의 특징부터 정리**</span>

1. <u>사전에 외우고 있지 않아도 풀 수 있는 가능성이 많다!</u>
2. <u>알고리즘에 대한 사용 방법을 정확히 알고 있어야 해결할 수 있다!</u>
3. <u>암기보다는 많은 유형을 풀면서 익숙해져야 한다!</u>
4. <u>문제를 보고 최소한의 아이디어를 낼 수 있는 창의성이 필요하다!</u>
   &nbsp;  
   &nbsp;

<span style="color: pink">↘︎</span>  
그리디 알고리즘의 문제는 쉬운 것 같으면서도 다양한 유형이 있으므로 결코 쉽다고만 볼 수는 없다. 다만, <span style='color: pink'>**'가장 큰 순서대로'**</span>, <span style='color: pink'>**'가장 작은 순서대로'**</span> 등의 기준이 문제 속에 알게 모르게 제시가 되어있으므로 이를 빠르게 캐치하자!

(위의 '가장 큰(작은) 순서대로의 경우 정렬 알고리즘을 사용하게 되는데, 실제로 그리디 알고리즘은 정렬 알고리즘과 자주 짝지어 출제된다.)

&nbsp;

## **거스름돈 문제**

---

> #### 당신은 음식점의 계산을 도와주는 점원이다.
>
> #### 카운터에는 거스름돈으로 사용할 500원, 100원, 50원, 10원짜리 동전이 무한히 존재한다고 가정한다.
>
> #### 손님에게 거슬러 줘야 할 돈이 N원일 때 거슬러 줘야 할 동전의 최소 개수를 구하라.
>
> #### (단, 거슬러 줘야 할 돈 N은 항상 10의 배수이다.)

그리디 알고리즘의 기본은 가장 탐욕적인 것을 선택한다는 것이다.

즉 이 문제에서 가장 탐욕적인 선택은...  
<span style='color: pink'>↘︎ **가장 큰 화폐 단위부터 돈을 거슬러 주는 것이다!**</span>  
&nbsp;

### ex) **1,260원의 경우**

1. 500원 (2)

   2개까지 줄 수 있다.

   → 1,260원 - 1,000원 = 260원  
   &nbsp;

2. 100원 (2)

   2개까지 줄 수 있다.

   → 260원 - 200원 = 60원  
   &nbsp;

3. 50원 (1)

   1개까지 줄 수 있다.

   → 60원 - 50원 = 10원  
   &nbsp;

4. 10원 (1)

   1개만 주면 된다.

   → 10원 - 10원 = 0원  
   &nbsp;

```python
n = 1260 # 거스름돈

# 화폐 단위 큰 순서대로 정렬한 배열
list = [500, 100, 50, 10]

count = 0 # 총 거스름돈으로 줄 동전 갯수
for i in list :
    count += n // i # 해당 화폐로 줄 수 있는 최대 갯수
    n = n % i # 해당 화폐로 지급한 금액 빼기

print(count)

# 시간 복잡도 : O(N)
```

다만, 주의해야될 점은 가장 큰 동전이 작은 값들의 배수여야만 한다는 점이다.  
예를 들어 동전의 단위가 500원 400원 100원이고, 800원을 줘야하는 상황이라면...

1. 500원을 먼저 1개 준다. → 100원을 3개 준다. (4)
2. 400원을 2개 준다. (2)

라는 상황이 나올 수 있기 때문이다.

<span style="color: pink">↘︎</span>  
즉, 다시말해 가지고 있는 동전 중에서 큰 단위가 항상 작은 단위의 배수라면 작은 단위의 동전들을 종합해도 큰 수의 동전을 먼저 내는 것보다 더 좋은 답을 낼 수 없으므로 해당 알고리즘을 써도 된다는 것이며 이처럼 **<span style='color: pink'>그리디 알고리즘 문제는 풀이를 위한 최소한의 아이디어를 떠올리고 검토할 수 있어야 답을 도출해낼 수 있다.</span>**
