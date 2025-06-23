# MeowBot 웹퍼블리싱 프로젝트

## 프로젝트 개요
MeowBot은 “따뜻한 반려동물 로봇” 컨셉의 제품 홍보 데모 페이지입니다.  
부드러운 파스텔 톤과 고양이 로봇 디자인을 활용해 아늑한 홈 인테리어 감성을 전달하고, 스크롤 기반 스토리텔링과 인터랙티브 애니메이션으로 몰입감을 극대화했습니다.

---

## 개발 기간
**2025.06.16–06.18 (3일간 스프린트)**  
_이미지 & 동영상 생성 → 개발 → 테스트까지 단기간에 완성_

---

## 컨셉
- **따뜻한 반려동물 로봇**: 현실에서 반려생활이 어려운 사용자 대상  
- **아늑한 홈 인테리어**: 그레이·그린 컬러 팔레트로 편안함 강조  
- **스토리텔링 UX**: 스크롤에 따라 제품 특징·기능을 단계별로 자연스럽게 소개  

---

## 주요 인터랙션 & 기능

- **로딩 애니메이션**  
  - 커스텀 프로그레스 바 + 순차 이미지 페이드 인/아웃  
  - GSAP 타임라인 기반 제어  

- **스크롤 스냅 & 휠 제어**  
  - Section 단위 scroll-snap  
  - GSAP ScrollToPlugin으로 부드러운 이동  

- **이미지 플립 & 커튼 전환**  
  - 스크롤 중 Y축 180° 회전 → 얇은 선 형태 변신  
  - 이후 섹션 전체가 사다리꼴 커튼처럼 좌우로 열리며 다음 콘텐츠 노출  

- **마퀴(Marquee) 효과**  
  - 무한 루프 가로 이미지 스크롤  
  - IntersectionObserver로 진입 시 애니메이션 활성화  

- **제품 상세 갤러리**  
  - 썸네일 클릭 시 메인 이미지/동영상 전환  
  - 자연스러운 페이드 애니메이션 적용  

- **반응형 레이아웃**  
  - CSS Flexbox 사용  
  - 모바일(@max-width:512px)에서 100dvh → auto 전환  

- **네비게이션 & 토글 메뉴**  
  - 햄버거 클릭 시 X 형태 애니메이션  
  - CSS transform & transition 활용  

---

## 사용 기술 및 라이브러리

- **GSAP (GreenSock Animation Platform)**  
  - ScrollTrigger, ScrollToPlugin, Timeline 활용  

- **Vanilla JavaScript (ES6+)**  
  - IntersectionObserver API  
  - DOM 이벤트 핸들링 & 상태 관리  

- **HTML5 & CSS3**  
  - CSS Custom Properties  
  - Flexbox 레이아웃  
  - scroll-snap, transform & width 기반 클리핑  

---

## 콘텐츠 생성 도구

- **이미지 생성**  
  - ChatGPT, Google Gemini  

- **동영상 생성**  
  - Pollo.ai, RunwayML  

---
