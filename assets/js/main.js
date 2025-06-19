gsap.registerPlugin( ScrollTrigger, ScrollToPlugin );

export function initializeMainApp() {
  const header    = document.querySelector('.header');
  const sections  = Array.from(document.querySelectorAll('.section'));
  let   allowWheelScroll = true;
  let   currentIndex     = 0;
  let isProgrammaticScroll = false;


  // 2) 초기화 호출 순서
  setupPageInteraction();
  initializeScrollLogic();
  applyWaveAnimation("top");
  applyWaveAnimation("bottom");
  typeTextAnimation();
  moveImageByScrolling();
  marquee()

  // 3) 섹션 간 수동 스냅 설정
  function setupPageInteraction() {
    const snapOffsets = sections.map(sec =>
      sec.offsetTop - header.offsetHeight
    );
    let isSnapping = false;

    window.addEventListener('wheel', onWheel, { passive: false });

    function onWheel(e) {
      // 모바일에서는 스냅 스크롤 동작하지 않음
      if (window.innerWidth <= 512) return;

      const dir    = Math.sign(e.deltaY);
      const inIntro = sections[currentIndex].classList.contains('introduce');

      // 인트로 섹션에서는 스냅 막고 자유 스크롤로 이동
      if (inIntro) return;

      // 이미 스냅 중이거나 tween 중이면 무시
      if (!allowWheelScroll || isSnapping || gsap.isTweening(window)) return;

      const next = currentIndex + dir;
      if (next < 0 || next >= sections.length) return;

      e.preventDefault();
      currentIndex = next;
      snapTo(currentIndex);
    }

    function snapTo(idx) {
      isSnapping = true;
      gsap.to(window, {
        scrollTo: { y: snapOffsets[idx] },
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => isSnapping = false
      });
    }

    const introIdx = sections.findIndex(s => s.classList.contains('introduce'));

    // 인트로 영역 진입 시 스냅 모드 해제 / 벗어날 땐 재설정
    if (window.innerWidth > 512) {
      ScrollTrigger.create({
        trigger: ".introduce",
        start: "top top",
        end: "bottom bottom",
        onEnter: () => {
          if (isProgrammaticScroll) return;
          allowWheelScroll = false;
        },
        onLeave: () => {
          if (isProgrammaticScroll) return;
          allowWheelScroll = true;
          currentIndex = introIdx + 1;
          snapTo(currentIndex);
        },
        onLeaveBack: () => {
          if (isProgrammaticScroll) return;
          allowWheelScroll = true;
          currentIndex = introIdx - 1;
          snapTo(currentIndex);
        },
        onEnterBack: () => {
          if (isProgrammaticScroll) return;
          allowWheelScroll = false;
          currentIndex = introIdx;
        }
      });
    }

    // IntersectionObserver, nav_btn 등은 항상 동작
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const features = entry.target.querySelectorAll('.feature');
          features.forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 300);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    const observer_need = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const features = entry.target.querySelectorAll('.need_img');
          features.forEach((el, i) => {
            setTimeout(() => el.classList.add('active'), i * 300);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('.benefits, .features').forEach(section => observer.observe(section));

    const section_need = document.querySelector('.need');
    observer_need.observe(section_need);

    const nav_btn = document.querySelector('.nav_btn');
    if (nav_btn) {
      nav_btn.addEventListener('click', () => {
        const nav = document.querySelector('nav');
        const header = document.querySelector('.header');
        toggleActiveClass([header, nav_btn, nav]);
      });
    }

    const toggleActiveClass = (e) => {
      if (Array.isArray(e)) {
        e.forEach(element => {
          element.classList.toggle('active');
        });
      } else if (e instanceof NodeList) {
        e.forEach(element => {
          element.classList.toggle('active');
        });
      } else if (e instanceof Element) {
        e.classList.toggle('active');
      }
    };
  }

  // 4) 현재 스크롤 위치로 currentIndex sync
  function initializeScrollLogic() {
    if (!sections.length || !header) return;
    const scrollY = window.scrollY + header.offsetHeight / 2;
    sections.forEach((sec, idx) => {
      if (scrollY >= sec.offsetTop - header.offsetHeight / 2) {
        currentIndex = idx;
      }
    });
  }

  function applyWaveAnimation(direction) {
    gsap.set( direction === "top" ? '.wave' : '.wave_container .wave', { scale: 1, xPercent: -50, transformOrigin: direction === "top" ? 'center bottom' : "center top"});
    gsap.to('.wave', {
      scale: 1.2,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      stagger: { each: 0.3, repeat: -1, yoyo: true }
    });
  }

  // 6) 타이핑 애니메이션
  function typeTextAnimation() {
    new TypeIt("#typed-text", {
      strings: ["랜선 집사", "분양 고민", "나만 없어"],
      speed: 80,
      deleteSpeed: 40,
      loop: true,
      breakLines: false,
      nextStringDelay: 1000
    }).go();
  }

  // 7) .introduce 섹션 내 GSAP 스크롤 트리거
  function moveImageByScrolling() {
    const imgWrap  = document.getElementById("imageWrapper");
    const imgInner = document.getElementById("imageInner");
    const mainImg  = document.getElementById("mainImage");
    const overlay  = document.getElementById("overlayText");
    const introduceMask = document.getElementById("introduceMask");

    const centerX = window.innerWidth  / 2 - imgWrap.offsetWidth  / 2;
    const centerY = window.innerHeight / 2 - imgWrap.offsetHeight / 2;
    const startX  = window.innerWidth * 0.95 - imgWrap.offsetWidth;
    const startY  = window.innerHeight * 0.05;
    const dX = centerX - startX, dY = centerY - startY;

    // 1) 이미지 중앙 이동
    gsap.to(imgWrap, {
      scrollTrigger:{
        trigger: ".introduce",
        start: "top top",
        end:   "30% top",
        scrub: true
      },
      x: dX, y: dY
    });

    // 2) 텍스트 등장
    gsap.to(overlay, {
      scrollTrigger:{
        trigger: ".introduce",
        start: "30% top",
        end:   "45% top",
        scrub: true
      },
      opacity: 1
    });

    // 3) 이미지 투명도 감소
    gsap.to(mainImg, {
      scrollTrigger:{
        trigger: ".introduce",
        start: "30% top",
        end:   "45% top",
        scrub: true
      },
      opacity: 0.5
    });

    // 4) 이미지 확대 + 회전
    gsap.to(imgInner, {
      scrollTrigger:{
        trigger: ".introduce",
        start: "45% top",
        end:   "60% top",
        scrub: true
      },
      scale: 1.5,
      rotationY: 90,
      transformOrigin: "center center"
    });

    // 5) 오버레이 텍스트 사라짐
    gsap.to(overlay, {
      scrollTrigger:{
        trigger: ".introduce",
        start: "60% top",
        end:   "65% top",
        scrub: true
      },
      opacity: 0
    });

    // 6) 새로운 영역 노출
    gsap.to(introduceMask, {
      scrollTrigger:{
        trigger: ".introduce",
        start: "60% top",
        end:   "65% top",
        scrub: true
      },
      scaleX: 1,
      rotateX: 0,
      opacity: 1
    });

    // 7) 새로운 영역 사라짐
    gsap.to(introduceMask, {
      scrollTrigger:{
        trigger: ".introduce",
        start: "80% top",
        end:   "100% top",
        scrub: true
      },
      scaleX: 0,
      rotateX: 20,     // 원래 시작 각도로 다시 되돌리고
      opacity: 0
    });

    // 처음엔 숨겨놓기
    gsap.set(imgWrap, { autoAlpha: 0 });
    // 인트로 진입 시만 fade-in
    ScrollTrigger.create({
      trigger: ".introduce",
      start: "top center",
      end:   "bottom top",
      onEnter:      () => gsap.to(imgWrap, { autoAlpha: 1, duration: 0.3 }),
      onEnterBack:  () => gsap.to(imgWrap, { autoAlpha: 1, duration: 0.3 }),
      onLeave:      () => gsap.to(imgWrap, { autoAlpha: 0, duration: 0.2 }),
      onLeaveBack:  () => gsap.to(imgWrap, { autoAlpha: 0, duration: 0.2 })
    });

  }

  // 8) marquee
  function marquee() {
    const rows = Array.from(document.querySelectorAll('.marquee-row'));

    rows.forEach(row => {
      const html = row.innerHTML;
      row.insertAdjacentHTML('beforeend', html);
    });

    let widths = rows.map(row => row.scrollWidth / 2);
    let offsets = rows.map(_ => 0);
    const speed = 0.5; // px per frame

    window.addEventListener('resize', () => {
      widths = rows.map(row => row.scrollWidth / 2);
    });

    function animate() {
      rows.forEach((row, i) => {
        offsets[i] = (offsets[i] + speed) % widths[i];

        const dir = row.classList.contains('reverse') ? 1 : -1;
        row.style.transform = `translateX(${dir * offsets[i]}px)`;
      });

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  };

  // 9) TOP 버튼 기능
  const topButton = document.getElementById("top_button");

  // 스크롤 위치에 따라 버튼 표시/숨김
  window.addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight * 0.6) {
      topButton.classList.add("show");
    } else {
      topButton.classList.remove("show");
    }
  });

  const homeSection = document.getElementById("home");
  // 클릭 시 상단으로 부드럽게 스크롤 이동
  function scrollToTop() {
    isProgrammaticScroll = true;
    allowWheelScroll     = false;

    homeSection.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      // 현재 인덱스를 홈(0)으로 강제 동기화
      currentIndex        = 0;
      isProgrammaticScroll = false;
      allowWheelScroll     = true;
    }, 600);
  }

  // TOP 버튼
  document.getElementById("top_button").addEventListener("click", (e) => {
    scrollToTop();
  });

  // 로고
  const logoSelectors = document.querySelectorAll(".logo, .footer_logo");

  logoSelectors.forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToTop();
    });
  });
}
