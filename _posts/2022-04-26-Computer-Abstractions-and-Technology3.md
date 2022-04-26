---
layout: post
title: "컴퓨터 구조 - 3"
excerpt: "영남대학교 최규상 교수님 컴퓨터 구조 수업 필기 3"

categories:
  - CS

tags:
  - [CS, Study]

toc: true
toc_sticky: true

date: 2022-04-26
last_modified_at: 2022-04-26
---

## <span style='color: #F79F81'>Computer Abstractions and Technology 3 - Performance</span>

&nbsp;

### <span style='color: pink'>**1. Performance (+ 복습)**</span>

---

&nbsp;

### <span style='color: #D0A9F5'>**↘︎ Relative Rerformance(상대적 성능)**</span>

&nbsp;  
&nbsp;<span style='color: pink'>퍼포먼스는 실행 시간과 반비례  
&nbsp;Performance = 1 / Execution Time</span>  
&nbsp;

### <span style='color: #D0A9F5'>**↘︎ Measuring Execution Time (실행 시간 구하기)**</span>

&nbsp;  
&nbsp;1. Elapsed time : 전체 걸리는 시간  
&nbsp;2. CPU time : CPU에서만 걸리는 시간  
&nbsp;

### <span style='color: #D0A9F5'>**↘︎ CPU Clocking**</span>

&nbsp;  
&nbsp;하나의 Clock 사이클 : rising Edge/falling Edge 1개씩  
&nbsp; → 한 개의 사이클에 걸리는 시간이 **'Clock period'**  
&nbsp;&nbsp; → 1초동안 앞에 있는 Clock 사이클이 몇 개인가가 **'Clock frequency(rate)'**  
&nbsp;

### <span style='color: #D0A9F5'>**↘︎ Machine Clock Rate**</span>

&nbsp;  
&nbsp;CC(clock cycle) = 1 / CR(clock rate(frequency))  
&nbsp;<span style='color: pink'>Clock Cycle은 Clock Rate와 반비례</span>  
&nbsp;

### <span style='color: #D0A9F5'>**↘︎ CPU Time (진도 시작)**</span>

&nbsp;  
&nbsp; = CPU Clock Cycles x Clock Cycle Time(period)  
&nbsp; = CPU Clock Cycles / Clock Rate  
&nbsp;(Clock period = 1 / Clock Rate이기 때문에)  
&nbsp;  
&nbsp;성능을 위해서 이 CPU Time을 줄여야 함  
&nbsp; → 즉, CPU Clock Cycles의 수나 Clock Cycle Time을 줄이거나 CPU Rate를 높이면 된다.  
&nbsp;  
&nbsp;다만, 하드웨어 디자이너는 거래하게 되는 부분이 있는데.. 그게 Clock Rate을 높이면 Clock Cycle의 수가 높아지게 되는 관계에 대한 문제이다. 즉 상관 관계가 있어서 Rate을 높이면서 Cycle의 수를 줄이는 것은 쉽지 않기에 타협을 볼 수밖에 없다는 것이다. 하지만 그런 관계 속에서도 최대한의 효율을 가질 수 있도록 하드웨어를 만드는 것이 중요하다.  
&nbsp;

### <span style='color: #D0A9F5'>**↘︎ CPU Time 예제**</span>

&nbsp;  
&nbsp;컴퓨터 A : 2GHz clock, 10s CPU time  
&nbsp;컴퓨터 B 디자인 목표 : 6s CPU time / Clock Cycle 수는 A의 1.2배  
&nbsp;  
&nbsp;↘︎ 컴퓨터 B의 Clock Rate 구하는 과정

```
Clock Rate_B = Clock Cycles_B / CPU Time_B
Clock Rate_B = 1.2 * Clock Cycle_A / 6s

Clock Cycles_A = CPU Time_A * Clock Rate_A
Clock Cycles_A = 10s * 2GHz = 20 * 10^9
# 1GHz → 1 * 10^9

Clock Rate_B = 1.2 * 20 * 10^9 / 6s
Clock Rate_B = 24 * 10^9 / 6s = 4GHz
```

&nbsp;

### <span style='color: #D0A9F5'>**↘︎ Instruction Count and CPI**</span>

&nbsp;  
&nbsp;<span style='color: pink'>Clock Cycles</span> = Instruction Count x Cycles per Instruction (CPI)  
&nbsp;CPU Time = <span style='color: pink'>Instruction Count x CPI</span> x Clock Cycle Time

&nbsp;⭐︎ <span style='color: pink'>CPU Time = (Instruction Count x CPI) / Clock Rate</span>  
&nbsp;  
&nbsp;Insturction Count : 명령어의 수  
&nbsp; → 프로그램, ISA, 컴파일러에 따라서 결정됨.  
&nbsp;  
&nbsp;CPI : 명령어를 실행시키는 데에 몇 사이클이 걸리는가  
&nbsp; → 더 정확하게 명령어의 비율을 계산한 CPI(Average cycle per instruction)를 사용해야 함.  
&nbsp; → CPU 하드웨어에 의해서 결정됨.  
&nbsp; → 각각의 다른 명령어들은 다른 CPI를 사용하게 됨.  
&nbsp; → 프로그램마다 Average CPI가 다 다르다.(해당 명령어의 사용 빈도가 다름)  
&nbsp;

### <span style='color: #D0A9F5'>**↘︎ CPI 예제**</span>

&nbsp;  
&nbsp;컴퓨터 A : Cycle Time = 250ps(피코 세컨드)(= 4GHz), CPI = 2.0(하나의 명령어 실행에 2 사이클이 걸림)  
&nbsp;컴퓨터 B : Cycle Time = 500ps(= 2GHz), CPI = 1.2  
&nbsp;같은 ISA를 사용 → 같은 명령어 프로그램을 두 컴퓨터에서 실행  
&nbsp;  
&nbsp;두 컴퓨터 중에 어떤 컴퓨터가 얼마만큼 빠른가?

```
# 두 컴퓨터 모두 같은 ISA를 사용하므로 Instruction Count는 같으며, I라고 두어 표현함.

CPU Time_A = Instruction Count * CPI_A * Cycle Time_A
CPU Time_A = I * 2.0 * 250ps = I * 500ps

CPU Time_B = Instruction Count * CPI_B * Cycle Time_B
CPU Time_B = I * 1.2 * 500ps = I * 600ps

# CPU Time이 적은 A가 더 빠르다

CPU Time_B / CPU Time_A =
    (I * 600ps) / (I * 500ps) = 1.2

# A가 1.2배 더 빠르다.
```

&nbsp;

### <span style='color: #D0A9F5'>**↘︎ CPI in More Detail**</span>

&nbsp;  
&nbsp;정확한 Clock Cycles  
&nbsp;(1~n 타입의 명령어) →  
&nbsp;Clock Cycles = ∑(i=1 → n)(CPI_i x Instruction Count_i)  
&nbsp;  
&nbsp;Weighted average CPI(명령어 비율 포함 평균 CPI)  
&nbsp;CPI = Clock Cycles / Instruction Count  
&nbsp;CPI = ∑(i = 1 → n)(CPI_i x (Instruction Count_i / Instruction Count))  
&nbsp;

### <span style='color: #D0A9F5'>**↘︎ CPI 예제2**</span>

&nbsp;  
&nbsp;A, B, C class의 명령어들의 CPI와 2가지 sequence에서 각 명령어 사용 개수  
| Class | CPI for class | IC in sequence 1 | IC in sequence 2 |
| :----------: | :----------: | :----------: | :----------: |
| A | 1 | 2 | 4 |
| B | 2 | 1 | 1 |
| C | 3 | 2 | 1 |

&nbsp;  
&nbsp; → 어떤 sequence가 더 빠를까?  
&nbsp;  
&nbsp;Sequence 1 : IC = 5 (명령어 총 개수)

```
Clock Cycles = 2 x 1 + 1 x 2 + 2 x 3 = 10
Avg.CPI = 10 / 5 = 2.0
```

&nbsp;  
&nbsp;Sequence 2 : IC = 6

```
Clock Cycles = 4 x 1 + 1 x 2 + 1 x 3 = 9
Avg.CPI = 9 / 6 = 1.5
```

&nbsp;  
&nbsp;Clock Cycle이 적은 Sequence 2가 더 빠르다.  
&nbsp;

### <span style='color: #D0A9F5'>**↘︎ Performance Summary**</span>

&nbsp;  
&nbsp;각각 Instruction(명령어)는 프로그램에 의해, Clock Cycles는 명령어에 의해, Seconds는 Clock Cycles에 의해 결정된다.  
&nbsp;  
&nbsp;CPU Time = <span style='color: pink'>Instruction / Program</span> x <span style='color: #D0A9F5'>Clock Cycles / Instruction</span> x <span style='color: #F79F81'>Seconds / Clock Cycles</span>  
&nbsp;CPU Time = <span style='color: pink'>Instruction Count</span> x <span style='color: #D0A9F5'>CPI</span> x <span style='color: #F79F81'>Clock Period</span>  
&nbsp;  
&nbsp;각각의 퍼포먼스를 결정하는 요소들  
&nbsp; ↘︎ 알고리즘 → IC, CPI에 영향  
&nbsp; ↘︎ 프로그램 언어 → IC, CPI에 영향  
&nbsp; ↘︎ 컴파일러 → IC, CPI에 영향  
&nbsp; ↘︎ Instruction set architecture(명령어 집합 : ISA) → IC, CPI, T_c(Clock Period)에 영향  
&nbsp;

### <span style='color: #D0A9F5'>**↘︎ Performance 종합 예제**</span>

&nbsp;  
| Op(명령어 타입) | Freq(빈도수) | CPI_i | Freq x CPI_i |  
| :---------- | ----------: | ----------: | ----------: |  
| ALU | 50% | 1 | 0.5 |  
| Load | 20% | 5 | 1.0 |
| Store | 10% | 3 | 0.3 |
| Branch | 20% | 2 | 0.4 |
| | | | ∑ = 2.2|

&nbsp;  
&nbsp;Q1. 데이터 캐시(5장에서 배움)를 사용했더니 Load타입의 CPI가 2로 줄었다. 얼마나 빨라지는가?  
| Op(명령어 타입) | Freq(빈도수) | CPI_i | Freq x CPI_i |  
| :---------- | ----------: | ----------: | ----------: |  
| ALU | 50% | 1 | 0.5 |  
| Load | 20% | <span style='color: pink'>**2**</span> | <span style='color: pink'>**0.4**</span> |
| Store | 10% | 3 | 0.3 |
| Branch | 20% | 2 | 0.4 |
| | | | ∑ = <span style='color: pink'>**1.6**</span>|

&nbsp;  
&nbsp;n배 빠르다 = CPU Time old / CPU Time new  
&nbsp;CPU Time new (= 1.6 x IC x CC) / CPU Time old (= 2.2 x IC x CC)  
&nbsp; = 2.2 / 1.6 = 약 1.375 = 37.5% 만큼 빨라졌다.  
&nbsp;  
&nbsp;Q2. branch prediction(4장에서 배움)을 사용하니까 2 사이클 걸리던 branch타입의 CPI가 1 사이클로 줄었다.  
| Op(명령어 타입) | Freq(빈도수) | CPI_i | Freq x CPI_i |  
| :---------- | ----------: | ----------: | ----------: |  
| ALU | 50% | 1 | 0.5 |  
| Load | 20% | 5 | 1.0 |
| Store | 10% | 3 | 0.3 |
| Branch | 20% | <span style='color: pink'>**1**</span> | <span style='color: pink'>**0.2**</span> |
| | | | ∑ = <span style='color: pink'>**2.0**</span>|

&nbsp;→ 2.2 / 2.0 = 1.1 = 10% 정도 빨라진다.  
&nbsp;  
&nbsp;Q3. ALU 명령어를 1번에 2개씩 실행할 수 있게끔 바뀌었다.  
| Op(명령어 타입) | Freq(빈도수) | CPI_i | Freq x CPI_i |  
| :---------- | ----------: | ----------: | ----------: |  
| ALU | 50% | <span style='color: pink'>**0.5**</span> | <span style='color: pink'>**0.25**</span> |  
| Load | 20% | 5 | 1.0 |
| Store | 10% | 3 | 0.3 |
| Branch | 20% | 2 | 0.4 |
| | | | ∑ = <span style='color: pink'>**1.95**</span>|

&nbsp;→ 2.2 / 1.95 = 약 1.28 = 12.8% 정도 빨라진다.  
&nbsp;
