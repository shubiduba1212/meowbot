document.addEventListener('DOMContentLoaded', () => {
  // Elements
  let mainImage = document.getElementById('mainImage');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const accordionItems = document.querySelectorAll('.accordion-item');
  const notifyBtn = document.querySelector('.notify-btn');
  const modal = document.getElementById('notifyModal');
  const form = document.getElementById('notifyForm');
  const submitBtn = form.querySelector('.submit-btn');
  const cancelBtn = form.querySelector('.cancel-btn');
  const inputs = form.querySelectorAll('input');
  const breedTags = document.querySelectorAll('.breed-tag');
  const completeModal = document.getElementById('completeModal');
  const completeOkBtn = document.querySelector('.complete-ok-btn');
  const topButton = document.getElementById('top_button');
  const footer = document.querySelector('.footer');

  // Top button visibility
  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.3) {
      topButton.classList.add('show');
      console.log('show class added');
    } else {
      topButton.classList.remove('show');
      console.log('show class removed');
    }
  });

  // Scroll to top when clicking the button
  topButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Breed media mapping
  const breedMedia = {
    koshot: [
      { type: 'image', src: 'assets/images/meowbot_koshot2.png', thumbnail: 'assets/images/meowbot_koshot2.png' },
      { type: 'video', src: 'assets/video/koshot2_detail.mp4', thumbnail: 'assets/images/meowbot_koshot2_pollo.png' }
    ],
    tuxido: [
      { type: 'image', src: 'assets/images/meowbot_koshot.png', thumbnail: 'assets/images/meowbot_koshot.png' },
      { type: 'video', src: 'assets/videos/koshot_detail.mp4', thumbnail: 'assets/images/meowbot_koshot_runway.png' },
      { type: 'video', src: 'assets/videos/koshot_pollo.mp4', thumbnail: 'assets/images/meowbot_koshot_pollo.png' }
    ],
    british: [
      { type: 'image', src: 'assets/images/meowbot_british.png', thumbnail: 'assets/images/meowbot_british.png' },
      { type: 'video', src: 'assets/videos/british_detail.mp4', thumbnail: 'assets/images/meowbot_british.png' },
      { type: 'video', src: 'assets/videos/british_pollo.mp4', thumbnail: 'assets/images/meowbot_british_pollo.png' }
    ],
    russian: [
      { type: 'image', src: 'assets/images/meowbot_russian.png', thumbnail: 'assets/images/meowbot_russian.png' },
      { type: 'image', src: 'assets/images/russian_detail.png', thumbnail: 'assets/images/russian_detail.png' },
      { type: 'video', src: 'assets/videos/russian_pollo.mp4', thumbnail: 'assets/images/meowbot_russian_pollo.png' },
    ],
    scottish: [
      { type: 'image', src: 'assets/images/meowbot_scottish.png', thumbnail: 'assets/images/meowbot_scottish.png' },
      { type: 'video', src: 'assets/videos/scottish_pollo.mp4', thumbnail: 'assets/images/meowbot_scottish_pollo.png' }
    ],
    siamese: [
      { type: 'image', src: 'assets/images/meowbot_siamese.png', thumbnail: 'assets/images/meowbot_siamese.png' },
      { type: 'video', src: 'assets/videos/siam_detail.mp4', thumbnail: 'assets/images/meowbot_siamese_runway.png' },
      { type: 'video', src: 'assets/videos/siam_pollo.mp4', thumbnail: 'assets/images/meowbot_siamese_pollo.png' }
    ],
    exotic: [
      { type: 'image', src: 'assets/images/meowbot_exotic.png', thumbnail: 'assets/images/meowbot_exotic.png' },
      { type: 'video', src: 'assets/videos/exotic_detail.mp4', thumbnail: 'assets/images/meowbot_exotic_pollo.png' }
    ],
    cheese: [
      { type: 'image', src: 'assets/images/meowbot_cheese.png', thumbnail: 'assets/images/meowbot_cheese.png' },
      { type: 'video', src: 'assets/videos/cheese_detail.mp4', thumbnail: 'assets/images/meowbot_cheese_pollo.png' }
    ]
  };

  // Update thumbnails based on breed
  function updateThumbnails(breed) {
    const mediaList = breedMedia[breed];
    const thumbnailList = document.querySelector('.thumbnail-list');
    thumbnailList.innerHTML = '';

    // Create thumbnails based on available media
    mediaList.forEach((media, index) => {
      const thumbnail = document.createElement('div');
      thumbnail.className = 'thumbnail';
      thumbnail.dataset.type = media.type;
      thumbnail.dataset.src = media.src;

      const img = document.createElement('img');
      img.src = media.thumbnail;
      img.alt = `MeowBot ${breed} ${index + 1}`;
      
      thumbnail.appendChild(img);
      thumbnailList.appendChild(thumbnail);

      // Set first thumbnail as active
      if (index === 0) {
        thumbnail.classList.add('active');
        updateMainMedia(media.type, media.src);
      }
    });

    // Reattach thumbnail click events
    attachThumbnailEvents();
  }

  // Update main media (image or video)
  function updateMainMedia(type, src) {
    const mainContainer = mainImage.parentElement;
    let newMedia;

    if (type === 'video') {
      newMedia = document.createElement('video');
      newMedia.autoplay = true;
      newMedia.loop = true;
      newMedia.muted = true;
      newMedia.playsInline = true;
      newMedia.style.pointerEvents = 'none';
    } else {
      newMedia = document.createElement('img');
    }

    newMedia.src = src;
    newMedia.style.opacity = '0';
    mainContainer.appendChild(newMedia);

    // Fade out old media
    if (mainImage) {
      mainImage.style.opacity = '0';
      setTimeout(() => {
        mainContainer.removeChild(mainImage);
        newMedia.style.opacity = '1';
        newMedia.id = 'mainImage';
        mainImage = newMedia;
      }, 300);
    } else {
      newMedia.style.opacity = '1';
      newMedia.id = 'mainImage';
      mainImage = newMedia;
    }
  }

  // Attach thumbnail click events
  function attachThumbnailEvents() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
        updateMainMedia(thumbnail.dataset.type, thumbnail.dataset.src);
      });
    });
  }

  // Handle breed tag clicks
  breedTags.forEach(tag => {
    tag.addEventListener('click', () => {
      breedTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      
      const breed = tag.dataset.breed;
      updateThumbnails(breed);

      // Update product title
      const breedNames = {
        koshot: '코리안 숏헤어',
        tuxido: '턱시도 코숏',
        british: '브리티쉬 숏헤어',
        russian: '러시안 블루',
        scottish: '스코티쉬 폴드',
        siamese: '샴',
        exotic: '엑조틱',
        cheese: '치즈 태비'
      };
      
      document.querySelector('.product-info h1').textContent = `MeowBot - ${breedNames[breed]}`;
    });
  });

  // Initial thumbnail events
  attachThumbnailEvents();

  // Handle accordion
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      accordionItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 모달 열릴 때 스크롤 방지
  function disableScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }
  function enableScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }
  function checkAndEnableScroll() {
    if (!modal.classList.contains('active') && !completeModal.classList.contains('active')) {
      enableScroll();
    }
  }

  // Handle modal
  notifyBtn.addEventListener('click', () => {
    modal.classList.add('active');
    disableScroll();
  });

  cancelBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    form.reset();
    checkAndEnableScroll();
  });

  // Form validation
  function validateForm() {
    let isValid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
      }
      if (input.type === 'tel') {
        const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
        if (!phoneRegex.test(input.value)) {
          isValid = false;
        }
      }
      if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          isValid = false;
        }
      }
    });
    submitBtn.disabled = !isValid;
  }

  inputs.forEach(input => {
    input.addEventListener('input', validateForm);
  });

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    modal.classList.remove('active');
    form.reset();
    completeModal.classList.add('active');
    // 스크롤 차단 유지
  });

  // Handle complete modal 확인 button
  completeOkBtn.addEventListener('click', () => {
    completeModal.classList.remove('active');
    checkAndEnableScroll();
  });

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      form.reset();
      checkAndEnableScroll();
    }
  });

  // Format phone number input
  const phoneInput = document.getElementById('phone');
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length >= 7) {
      value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
    } else if (value.length >= 3) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    }
    
    e.target.value = value;
  });

  // 분양 알림 신청 버튼이 footer와 겹치지 않게 처리
  if (notifyBtn && footer) {
    function setupNotifyBtnObserver() {
      // 기존 observer가 있으면 disconnect
      if (notifyBtn._observer) {
        notifyBtn._observer.disconnect();
        notifyBtn._observer = null;
      }
      if (window.innerWidth > 512) {
        // PC 모드에서는 인라인 스타일 제거
        notifyBtn.removeAttribute('style');
        notifyBtn.classList.remove('stop');
        return;
      }
      // 모바일에서만 IntersectionObserver 동작
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            notifyBtn.classList.add('stop');
            const footerRect = footer.getBoundingClientRect();
            const btnHeight = notifyBtn.offsetHeight;
            const absoluteTop = window.scrollY + footerRect.top - btnHeight - 20;
            notifyBtn.style.position = 'absolute';
            notifyBtn.style.top = absoluteTop + 'px';
            notifyBtn.style.bottom = 'auto';
          } else {
            notifyBtn.classList.remove('stop');
            notifyBtn.style.position = 'fixed';
            notifyBtn.style.top = '';
            notifyBtn.style.bottom = '20px';
          }
        },
        { root: null, threshold: 0 }
      );
      observer.observe(footer);
      notifyBtn._observer = observer;
    }

    setupNotifyBtnObserver();
    window.addEventListener('resize', setupNotifyBtnObserver);
  }

  const nav_btn = document.querySelector('.nav_btn');
  if (nav_btn) {
    nav_btn.addEventListener('click', () => {
      const nav = document.querySelector('nav');
      const header = document.querySelector('.header');
      toggleActiveClass([header, nav_btn, nav]);

      if (!header.classList.contains('active')) {
        enableScroll();
      } else {
        disableScroll();
      }
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

  window.addEventListener('resize', () => {
    const notifyBtn = document.querySelector('.notify-btn');
    if (notifyBtn && window.innerWidth > 512) {
      notifyBtn.style.position = '';
      notifyBtn.style.top = '';
      notifyBtn.style.bottom = '';
      notifyBtn.classList.remove('stop');
    }
  });

  if (notifyBtn) {
    notifyBtn.removeAttribute('style');
    notifyBtn.style.position = '';
    notifyBtn.style.top = '';
    notifyBtn.style.bottom = '';
    notifyBtn.style.left = '';
    notifyBtn.style.right = '';
  }
}); 