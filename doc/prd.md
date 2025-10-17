# GSMemKit - Product Requirements Document

## 1. Project Overview

**GSMemKit**은 포켓몬스터 골드/실버 한글판의 RAM 메모리를 에디팅하기 위한 웹 기반 도구입니다. 사용자가 웹 UI를 통해 원하는 메모리 값을 설정하면, 실제로 변경해야 할 메모리 주소와 값을 테이블 형식으로 출력합니다.

**Target Platform:** GitHub Pages (Static Web Application)
**Target Game:** 포켓몬스터 골드/실버 한글판 (Game Boy Color)
**Tech Stack:** Vanilla JavaScript, HTML5, CSS3

---

## 2. Goals & Scope

### Primary Goals
- 포켓몬스터 골드/실버 메모리 에디팅을 위한 직관적인 웹 UI 제공
- 주소:값 형식의 명확한 출력으로 다양한 에뮬레이터/도구와 호환
- GitHub Pages 호스팅으로 접근성 극대화

### Out of Scope (v1.0)
- 실시간 메모리 읽기/쓰기 (에뮬레이터 연동)
- 세이브 파일 직접 수정
- 자동 코드 적용 기능

---

## 3. Core Features

### 3.1 파티 포켓몬 에디팅
사용자가 자신의 파티 포켓몬(최대 6마리)을 수정할 수 있습니다.

**편집 가능한 항목:**
- 포켓몬 종족 (내부 ID)
- 레벨
- 현재 HP / 최대 HP
- 경험치
- 공격/방어/특공/특방/스피드 개체값 (IV)
- 노력치 (EV)
- 기술 (4개)
- PP
- 친밀도
- 지닌 도구
- 상태 이상
- 포획 레벨
- 성별

**UI 요구사항:**
- 파티 슬롯 선택 (1~6번)
- 포켓몬 검색/선택 (드롭다운 또는 자동완성)
- 숫자 입력 필드 (레벨, HP 등)
- 기술 선택 UI (4개 슬롯)

### 3.2 도구 에디팅
사용자가 가방의 아이템을 추가/수정/삭제할 수 있습니다.

**편집 가능한 항목:**
- 아이템 종류 (내부 ID)
- 소지 개수 (1~99)

**UI 요구사항:**
- 아이템 검색/선택
- 개수 입력
- 아이템 슬롯 추가/삭제 버튼
- 최대 슬롯 제한 표시

### 3.3 트레이너 포켓몬 포획
트레이너가 소유한 포켓몬을 포획 가능하게 만드는 기능입니다.

**동작 방식:**
- 특정 메모리 주소 값을 변경하여 트레이너 배틀 시 몬스터볼 사용 가능하게 함
- ON/OFF 토글 방식

**UI 요구사항:**
- 체크박스 또는 토글 스위치
- 설명 텍스트 (위험성 경고)

---

## 4. Output Specification

### 출력 형식
메모리 변경 내역을 다음과 같은 테이블 형식으로 출력합니다:

```
주소      | 값 (HEX) | 설명
----------|----------|------------------
0xD164    | 0x19     | 파티 1번 - 포켓몬 종족 (피카츄)
0xD165    | 0x32     | 파티 1번 - 레벨 (50)
0xD166    | 0x64     | 파티 1번 - 현재 HP (100)
...
```

### 추가 출력 옵션
- **복사 버튼**: 테이블 전체를 클립보드에 복사
- **내보내기**: CSV 또는 JSON 형식으로 다운로드
- **코드 변환**: (향후) GameShark/GameGenie 코드로 변환

---

## 5. Memory Map (Known Addresses)

> **Note:** 아래 주소는 해외판(국제판) 기준입니다. 한국판은 +0xFD (253 바이트) 오프셋이 적용됩니다.

### 파티 포켓몬 관련
- **파티 포켓몬 수**:
  - 해외판: `0xDA22` (1 byte)
  - 한국판: `0xDB1F` (1 byte) ✅ 검증됨
- **파티 포켓몬 데이터**:
  - 해외판: `0xDA23` ~ (각 포켓몬당 48 bytes)
  - 한국판: `0xDB27` ~ (각 포켓몬당 48 bytes) ✅ 검증됨
  - Offset +0x00: 종족
  - Offset +0x01: 지닌 도구
  - Offset +0x02~0x05: 기술 1~4
  - Offset +0x1F: 레벨
  - Offset +0x22~0x23: 현재 HP
  - Offset +0x24~0x25: 최대 HP

### 도구 관련
- **도구 가방**: `0xD892` ~ (아이템 ID + 개수 쌍)
  - 종료: `0xFF`

### 트레이너 포켓몬 포획
- **포획 가능 플래그**: `0xD0??` (조사 필요)

---

## 6. UI/UX Design Direction

### Layout
```
+----------------------------------+
|  GSMemKit - 포켓몬 골드/실버     |
|  메모리 에디터                    |
+----------------------------------+
| [탭1: 파티 포켓몬]                |
| [탭2: 도구]                       |
| [탭3: 트레이너 포획]              |
+----------------------------------+
|  (각 탭 별 에디팅 UI)             |
|                                  |
+----------------------------------+
| [생성] [초기화]                   |
+----------------------------------+
| 출력 테이블:                      |
| 주소 | 값 | 설명                  |
| .... | .. | ....                 |
+----------------------------------+
| [복사] [CSV 다운로드]             |
+----------------------------------+
```

### Design Principles
- **단순함**: 불필요한 장식 없이 기능에 집중
- **명확성**: 각 필드의 의미를 명확히 표시
- **반응형**: 모바일 환경도 고려
- **다크모드**: 선택 사항 (추후)

---

## 7. Technical Architecture

### File Structure
```
GSMemKit/
├── index.html          # 메인 HTML
├── css/
│   └── style.css       # 스타일시트
├── js/
│   ├── app.js          # 메인 애플리케이션 로직
│   ├── pokemon.js      # 포켓몬 데이터 및 에디팅 로직
│   ├── items.js        # 아이템 데이터 및 에디팅 로직
│   ├── memory.js       # 메모리 주소 계산 및 출력 생성
│   └── data/
│       ├── pokemon.json    # 포켓몬 목록 (ID, 이름)
│       ├── moves.json      # 기술 목록
│       └── items.json      # 아이템 목록
├── doc/
│   └── prd.md          # 본 문서
└── README.md
```

### Data Flow
1. 사용자 입력 (UI) → JavaScript 객체로 변환
2. 메모리 주소 계산 (offset 기반)
3. 주소:값 매핑 생성
4. 테이블 렌더링 및 출력

---

## 8. Milestones

### Phase 1: Foundation (v0.1)
- [ ] 기본 HTML/CSS 구조 구축
- [ ] 파티 포켓몬 UI (종족, 레벨만)
- [ ] 주소:값 테이블 출력 기능

### Phase 2: Core Features (v0.5)
- [ ] 파티 포켓몬 전체 항목 에디팅
- [ ] 도구 에디팅 기능
- [ ] 트레이너 포획 토글

### Phase 3: Polish (v1.0)
- [ ] 한글판 메모리 주소 검증 및 수정
- [ ] CSV/JSON 내보내기
- [ ] 반응형 디자인 적용
- [ ] 사용자 가이드 작성

### Future Enhancements
- GameShark 코드 변환
- 세이브 파일 직접 수정 기능
- 포켓몬 스프라이트 표시
- 프리셋 저장/불러오기

---

## 9. Known Challenges

### 한글판 메모리 주소 차이
- 한글판은 일반적인 일본판/영문판과 메모리 구조가 다를 수 있음
- 실제 에뮬레이터 디버거로 주소 확인 필요
- 사용자 피드백을 통한 검증 프로세스 필요

### 포켓몬 데이터 구조 복잡성
- 개체값, 노력치, 경험치 등의 계산식
- 스탯 재계산 로직 필요
- 체크섬 (있을 경우) 처리

### 브라우저 호환성
- 최신 브라우저 기준 개발 (ES6+)
- 구형 브라우저는 polyfill 또는 제외

---

## 10. Success Metrics

- 사용자가 5분 이내에 원하는 메모리 수정 값을 얻을 수 있음
- 출력된 메모리 값이 실제 게임에서 정상 작동함 (검증률 95%+)
- GitHub Pages 방문자 수 (추후 Analytics 연동)

---

## Appendix: References

- [Bulbapedia - Pokemon Data Structure](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_data_structure_in_Generation_II)
- [Datacrystal - Pokemon Gold/Silver](https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Gold_and_Silver)
- [Game Boy CPU Manual](http://marc.rawer.de/Gameboy/Docs/GBCPUman.pdf)
