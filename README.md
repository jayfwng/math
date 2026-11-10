# 다시, 수학

중1부터 차근차근 다시 잡는 수학 학습 PWA. (개념 → 문제 → 오답 개념 → 리마인드 복습, 자동 레벨업)

## 사용
- 배포: GitHub Pages (Settings → Pages → Deploy from branch → main / root)
- 주소: https://jayfwng.github.io/math/
- 아이폰: Safari로 열기 → 공유 → "홈 화면에 추가"

## 개발
- 빌드 없음 (바닐라 JS ES modules). 로컬: `python3 -m http.server 8123`
- 문제 검증: `node tools/test.mjs [--samples] [--only=id]`
- 콘텐츠: `content/map.js`(전체 개념 지도), `content/m1-*.js` 등(구현)
