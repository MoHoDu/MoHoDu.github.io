---
layout: post
title: "컴퓨터 구조 - 2"
excerpt: "영남대학교 최규상 교수님 컴퓨터 구조 수업 필기 2"

categories:
  - CS

tags:
  - [CS, Study]

toc: true
toc_sticky: true

date: 2022-04-21
last_modified_at: 2022-04-21
---

## Computer Abstractions and Technology 2

&nbsp;

### **↘︎ Under the cover**

---

&nbsp;  
&nbsp;**1. 컴퓨터의 컴포넌트**  
&nbsp;  
&nbsp;데스크탑, 서버, 임베디드...  
&nbsp;Input/Output includes  
&nbsp;&nbsp;- 유저 인터페이스 디바이스 : 디스플레이, 키보드, 마우스  
&nbsp;&nbsp;- 저장 공간 : 하드 디스크, CD/DVD, flash  
&nbsp;&nbsp;- 네트워크 어뎁터 : 네트워크를 연결시키는 기능  
&nbsp;  
&nbsp;(교재 20p 맥북 해체 사진 참고)  
&nbsp;  
&nbsp;**2. Inside the Processor (CPU)**  
&nbsp;  
&nbsp;세 가지 구성요소  
&nbsp;&nbsp;- Datapath(데이터 패스) : 데이터가 흘러가는 경로 → 4장에서 배울 것  
&nbsp;&nbsp;- Control(컨트롤) : 각각 CPU에 있는 컴포넌트를을 제어 → 4장에서 배울 것  
&nbsp;&nbsp;- Cache memory(캐시 메모리) : 빠른 연산을 위해서 CPU 내부 작은 SRAM 메모리에 있는 데이터들 → 5장에서 배울 것  
&nbsp;  
&nbsp;(교재 21p Apple A5 사진)  
&nbsp;- 코어(Arm Core) 2개  
&nbsp;- 각 코어에 대한 데이터 패스(Processor data path) 2개  
&nbsp;- 디지털 로직 블럭(digital logic block) 1개  
&nbsp;- I/O 1개  
&nbsp;- GPIO(I/O 채널) 1개  
&nbsp;- DRAM(SDRAM) 인터페이스  
&nbsp;- USB 인터페이스...  
&nbsp;  
&nbsp;**3. Abstractions**  
&nbsp;복잡한 문제에서 추상을 통해 단순화 시켜서 쉽게 풀거나 이해함.  
&nbsp;  
&nbsp;컴퓨터에서는 Instruction set architecture (ISA)가 이 역할을 함  
&nbsp;&nbsp;: 하드웨어와 소프트웨어 인터페이스  
&nbsp;&nbsp;→ 소프트웨어는 instruction set으로 이루어져 있고 하드웨어는 그 instruction을 실행  
&nbsp;&nbsp;→ 하드웨어와 소프트웨어를 독립적(independent)으로 만듦  
&nbsp;  
&nbsp;Application binary interface  
&nbsp;&nbsp;- The ISA + system software interface  
&nbsp;&nbsp;- 어떤 시스템에 있는 프로그램이 다른 컴퓨터 시스템에서 실행될 수 있는지에 대한 조건이 ABI → 같은 ABI를 충족한다면 다른 컴퓨터에서 실행 가능  
&nbsp;  
&nbsp;Implementation  
&nbsp;&nbsp;- 디테일한 구현  
&nbsp;&nbsp;- ISA를 어떻게 실제적으로 구현할 것인가? 등..  
&nbsp;  
&nbsp;**3. A Safe Place for Data**  
&nbsp;  
&nbsp;휘발성(volatile) main memory  
&nbsp;- DRAM  
&nbsp;- 전원이 나가면 데이터가 사라짐  
&nbsp;  
&nbsp;비휘발성(none-volatile) secondary memory  
&nbsp;- Secondary memory === Storage  
&nbsp;- Magnetic disk  
&nbsp;- Flash  
&nbsp;- Optical  
&nbsp;  
&nbsp;**4. Networks**  
&nbsp;  
&nbsp;컴퓨터 간에 정보를 주고 받기 위해 어떤 커뮤니케이션  
&nbsp;- LAN(Local area network) : 이더넷(Ethernet)  
&nbsp;- WAN(Wide area network) : 인터넷(the internet)  
&nbsp;- 무선 인터넷(Wireless network) : WiFi, Bluetooth  
&nbsp;

### **↘︎ Technologies for Building Processors and Memory**

---

&nbsp;  
&nbsp;**1. 기술 트렌드(Technology Trends)**  
&nbsp;(25p)  
&nbsp;  
&nbsp; x축은 연로, y축은 DRAM의 용량  
&nbsp; y축은 log scale이기 때문에 한 칸에 10배  
&nbsp;→ 시간이 지남에 따라 (무어의 법칙에 맞게) 엄청나게 늘어남  
&nbsp;  
&nbsp;- 용량과 퍼포먼스가 엄청난 성장  
&nbsp;- 가격은 감소(25p 상단 표 참고 : 기술/가성비)  
&nbsp;&nbsp;→ 비용 대비 성능이 아주 빠르게 성장  
&nbsp;  
&nbsp;**2. Semiconductor Technology**  
&nbsp;  
&nbsp;실제 칩을 만들 때에 어떤 것으로 만드는가?  
&nbsp;실리콘(silicon) : semiconductor  
&nbsp;- 하나의 실리콘 wafer에서 모두 성공하는 것이 아닌 실패하는 die도 존재  
&nbsp;- 반도체 공정시 수율 : wafer당 동작하는 다이의 비율  
&nbsp;&nbsp;→ 수율이 좋을 수록 원가 절감  
&nbsp;  
&nbsp;**교재 27p Intel Core i7 Wafer 참고**  
&nbsp;- 300mm 크기의 wafer에 280개의 칩이 있고, 32nm 공정(하나의 회로의 폭이 32nm)  
&nbsp;- 폭이 작을수록 하나의 wafer에 더 많은 칩을 생산(원가, 전력 소비 등을 절감)  
&nbsp;각 칩은 20.7 x 10.5 mm  
&nbsp;  
&nbsp;**Integrated Circuit Cost**  
&nbsp;  
&nbsp;관심있으면 보세요 ㅎㅎ 교재 28p  
&nbsp;

### **Performance(핵심)**

---

&nbsp;  
&nbsp;**1. Defining Performance**  
&nbsp;  
&nbsp;교재 29p 비행기 퍼포먼스 비교 표 참고  
&nbsp;- 승객 수, 한 번 주유로 얼마나 가는지, 속도, 승객 당 속도에 따라서 각각의 비행기가 모두 각각에 장점이 있었음  
&nbsp;  
&nbsp;✔️ 어떤 비행기가 가장 성능이 좋은가?  
&nbsp;&nbsp; - 퍼포먼스의 정의를 어디다가 두는가에 따라 다름  
&nbsp;  
&nbsp;↘︎ 퍼포먼스를 잘 정의하는 것이 중요!  
&nbsp;  
&nbsp;**Response Time and Throughput**  
&nbsp;- 컴퓨터의 성능을 좌우지하는 두 가지 큰 요소  
&nbsp;  
&nbsp;Response time(latency, 레이턴시) : 하나의 일을 수행하는데 얼마나 걸리나?  
&nbsp;Troughput : 단위 시간 당 몇 개의 일을 하는가?  
&nbsp;&nbsp; → 시간 당 task의 수, transaction의 수  
&nbsp;  
&nbsp;보통은 이 두 가지 중에서 하나를 골라서 퍼포먼스를 평가  
&nbsp;  
&nbsp;두 가지가 영향을 받는 예시 1 )  
&nbsp;- 프로세서를 최신의 빠른 프로세서로 변경  
&nbsp;✔️ Response time은 줄면 좋음  
&nbsp;✔️ Response time이 줄면 저절로 Troughput은 증가  
&nbsp;  
&nbsp;두 가지가 영향을 받는 예시 2 )  
&nbsp;- 추가적으로 프로세서를 설치  
&nbsp;✔️ 하나 당 처리 속도는 같지만 일정 시간 당 처리 가능한 일의 양은 증가  
&nbsp;✔️ 즉, Response time은 그대로인데 Throuput이 증가  
&nbsp;  
&nbsp;↘︎ 그렇기 때문에 퍼포먼스를 얘기할 때에 Response time에만 집중할 것  
&nbsp;  
&nbsp;**Relative Performance(상대적 성능)**  
&nbsp;  
&nbsp;<span style='color: pink'>**퍼포먼스(성능)은 1 / 실행 시간(execution time)**</span>  
&nbsp; → 실행 시간과 반비례  
&nbsp;  
&nbsp;<span style='color: pink'>"X가 Y보다 N배 빠르다"  
&nbsp;→ Performance_X / Performance_Y  
&nbsp;&nbsp;&nbsp;&nbsp; = Execution_time_Y / Execution_time_X = N</span>  
&nbsp;  
&nbsp;예시 1 ) 같은 프로그램을 실행하는데, A는 10초, B는 15초 걸린다.  
&nbsp;&nbsp; → 15초 / 10초 = 1.5  
&nbsp;&nbsp; ✔️ A가 1.5배 빠르다  
&nbsp;  
&nbsp;**Measuring Execution Time**  
&nbsp;  
&nbsp;Elapsed time(실제 전체 걸리는 시간)  
&nbsp; - 모든 것을 포함한 전체 걸리는 시간  
&nbsp;&nbsp; → 시스템 성능을 측정할 수 있음  
&nbsp;  
&nbsp;CPU time  
&nbsp; - I/O나 다른 업무로 사용된 시간들이 제외  
&nbsp; - 특정한 일에 대해서 CPU가 처리하는데 걸린 시간  
&nbsp; - user CPU time : 유저 모드에서 걸린 CPU time  
&nbsp; - system CPU time : 시스템 모드에서 CPU를 사용할 때 걸리는 시간  
&nbsp;  
&nbsp;↘︎ 시스템들은 각각 CPU와 시스템 성능에 따라서 영향을 다르게 받음  
&nbsp;
&nbsp;**CPU Clocking(논리 회로 수업에서 배움)**  
&nbsp;  
&nbsp;Clock period : 하나의 Clock 사이클에 걸리는 시간  
&nbsp; - 또 다시 각 Clock period에는 rising Edge와 falling Edge가 각각 1개씩 존재  
&nbsp;  
&nbsp;Clock frequency (rate) : 1초에 앞에 있는 Clock 사이클이 몇 개인지  
&nbsp;  
&nbsp;CC(사이클) = 1 / CR
