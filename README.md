# GSMemKit

포켓몬스터 골드/실버 한글판 RAM 메모리 에디터

## 설명

GSMemKit은 포켓몬스터 골드/실버 한글판의 메모리를 쉽게 수정할 수 있도록 도와주는 웹 기반 도구입니다. 사용자가 원하는 값을 입력하면 실제로 변경해야 할 메모리 주소와 값을 테이블 형식으로 출력합니다.

## 기능

- **파티 포켓몬 에디팅**: 포켓몬 종족, 레벨 등을 수정
- **도구 에디팅**: 아이템 추가/수정/삭제 (개발 예정)
- **트레이너 포켓몬 포획**: 트레이너 배틀에서 몬스터볼 사용 가능하게 설정

## 사용 방법

1. GitHub Pages에서 접속: [링크 예정]
2. 원하는 탭 선택 (파티/도구/트레이너 포획)
3. 값 입력
4. "생성" 버튼 클릭
5. 출력된 주소:값 테이블을 에뮬레이터에 입력

## 주의사항

⚠️ **파티 포켓몬 메모리 주소는 한국판 기준으로 검증되었습니다.**
- 한국판 파티 주소 = 해외판 + 0xFD (253 바이트)
- 기타 메모리 영역은 에뮬레이터 테스트 권장

## 기술 스택

- Vanilla JavaScript
- HTML5 / CSS3
- GitHub Pages

## 개발 로드맵

### Phase 1: Foundation (v0.1) ✅
- [x] 기본 HTML/CSS 구조
- [x] 파티 포켓몬 UI (종족, 레벨)
- [x] 주소:값 테이블 출력

### Phase 2: Core Features (v0.5)
- [ ] 파티 포켓몬 전체 항목 (HP, 스탯, 기술 등)
- [ ] 도구 에디팅 기능
- [ ] 트레이너 포획 기능 구현

### Phase 3: Polish (v1.0)
- [ ] 한글판 메모리 주소 검증
- [ ] CSV/JSON 내보내기
- [ ] 반응형 디자인 개선
- [ ] 사용자 가이드

## 라이선스

MIT License

## 참고 자료

- [Bulbapedia - Pokemon Data Structure](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_data_structure_in_Generation_II)
- [Datacrystal - Pokemon Gold/Silver](https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Gold_and_Silver)
