---
layout: post
title: "컴퓨터 구조 - 1"
excerpt: "영남대학교 최규상 교수님 컴퓨터 구조 수업 필기 1"

categories:
  - CS

tags:
  - [CS, Study]

toc: true
toc_sticky: true

date: 2022-04-19
last_modified_at: 2022-04-19
---

### Introduction

---

&nbsp;  
컴퓨터 혁명, 발전의 원천은 Moore's Law(무어의 법칙)

이로 인해서...

1. 자동차에 컴퓨터가 들어감
2. 휴대폰
3. 휴먼 게놈 프로젝트
4. WWW(World Wide Web)
5. 검색 엔진  
   -> 컴퓨터가 모든 분야에 사용된다.

### 무어의 법칙이란?

1965년 무어의 예측  
: "하나의 칩에 들어갈 수 있는 트랜지스터의 수는 매 2년마다 2배씩 늘어날 것!"  
→ 실제로는 매 2년마다 2배가 아닌 그 이상 늘어나고 있다.

Log Scale : 눈금 하나에 10배 (1, 10, 100, 1000, 10000...)

현재는 여러가지 이유로 맞지가 않지만, 2000년대 초반까지는 맞는 법칙이었다.

&nbsp;

### 컴퓨터의 구분

---

&nbsp;  
Personal computer : 일반 사람들이 사용하는 컴퓨터  
Server conputer : 웹 서버, 데이터베이스 서버... 고사양  
Super computer : 엔지니어용, 과학용 (특정 목적)  
Embedded computer : 컴퓨터가 어떤 시스템의 한 컴포넌트로 들어가 있는 것.  
&nbsp;

> 스마트폰의 경우, 첫 번째 기능 : 전화
>
> &nbsp; +&nbsp; 인터넷 등의 컴퓨팅 기능이 하나의 컴포넌트로 들어가 있음

&nbsp;

### 컴퓨터 단위

---

&nbsp;  
Bit : 0 또는 1, 컴퓨터의 정보를 저장하는 가장 작은 단위  
Byte : 8 Bit, 컴퓨터의 가장 기본적인 저장 단위  
Kilobyte : 2^10 or 1,024 bytes  
Megabyte : 2^20 or 1,048,576 bytes  
&nbsp; → 때때로 10^6 으로 해석되기도 함  
Gigabyte : 2^30 or 1,073,741,824 bytes  
&nbsp; → 때때로 10^9 으로 해석되기도 함  
Terabyte : 2^40 or 1,099,511,627,776 bytes  
&nbsp; → 때때로 10^12 으로 해석되기도 함  
Petabyte : 2^50 or 1,024 terabytes  
&nbsp; → 때때로 10^15 으로 해석되기도 함  
Exabyte : 2^60 or 1,024 petabytes  
&nbsp; → 때때로 10^18 으로 해석되기도 함  
(분야마다 다름 - 10의 몇 승은 주로 통신, 네트워크에서 쓰는 단위)  
&nbsp;

### PostPC

&nbsp;  
Personal Mobile Device (PMD) : 핸드폰, 테블릿 등등..  
→ 배터리로 동작  
Cloud computing (Warehouse Scale Computers(WSC)) : 아마존, 구글 등등...  
→ 클라우드 컴퓨팅 안에서 여러 서비스가 클라우드 서버에서 제공됨  
&nbsp;

### 수업에서 배울 것

---

&nbsp;

1. 프로그램이 어떻게 machine language로 바뀌는지  
   &nbsp; ↘︎ 혹은 하드웨어가 어떻게 실행하는지
2. 하드웨어, 소프트웨어 인터페이스
3. 무엇이 퍼포먼스를 결정하고 어떻게 퍼포먼스를 향상할 것인가?
4. parallel processing - 이 과목에서는 배우지 않음

&nbsp;

### Understanding Rerformance

---

&nbsp;  
Algorithm(알고리즘)  
&nbsp; ↘︎ operation 수를 줄이는 것  
Programming language, compiler, architecture  
&nbsp; ↘︎ 실행하는 명령어 수로 결정  
Processor and memmory system  
&nbsp; ↘︎ 명령어들을 얼마나 빨리 실행시키는가로 결정  
I/O system (including OS)  
&nbsp; ↘︎ I/O operation들을 얼마나 빨리 처리하느냐로 결정  
&nbsp;

### 컴퓨터 아키텍쳐(Architecture)를 발전시킨 8가지 아이디어

---

&nbsp;
교재 1장

- Moor's Law
- abstract

---

교재 2장

- common case fast

---

여러 파트에서 해석되고 걸쳐있음

- parallelism

---

교재 4장

- pipelining
- prediction (예측)

---

교재 5장

- hierarchy

---

교재 6장

- dependability via redundancy  
  (redundancy를 통해 안정성 확보)

### Below Your Program (프로그램의 기저)

---

&nbsp;  
Hardware  
&nbsp; ↘︎ Processor, memory, I/O controllers  
&nbsp;  
System software  
&nbsp; ↘︎ 운영체제(OS)  
&nbsp; ↘︎ 컴파일러가 작성한 코드를 기계적 코드로 바꿔줌  
&nbsp;  
Application software
&nbsp; ↘︎ 실제 유저들이 사용하는 프로그램  
&nbsp;

### Level of Program Code (코드의 레벨)

---

&nbsp;  
High-level language : C, C++, Java, Python....  
&nbsp; ↘︎ 조금 더 사람이 이해하기 쉬움  
&nbsp; ↘︎ 생산성과 휴대성(potability)이 향상  
&nbsp;  
Assembly language  
&nbsp; ↘︎ binary code(machine instruction)의 텍스트 표현  
&nbsp; ↘︎ 아직은 사람이 프로그래밍할 수 있는 정도(하지만 어려움)  
&nbsp; ↘︎ awwembler가 바이너리 코드(단지 0, 1의 조합)로 변경  
&nbsp;  
Hardware representation  
&nbsp; ↘︎ 0과 1의 조합 : Binary digits (bits), 2진수  
&nbsp; ↘︎ 데이터와 명령어들을 인코딩  
&nbsp; ↘︎ 사람은 이해할 수 없고, 컴퓨터가 이해하는 수준
