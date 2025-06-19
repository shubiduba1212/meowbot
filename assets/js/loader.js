import { initializeMainApp } from './main.js';

const loaderContainer = document.getElementById('loader-container');
const content = document.getElementById('content');

function showMainContent() {
  loaderContainer.style.display = 'none';
  content.classList.remove('hidden');
  content.classList.add('visible');
  sessionStorage.setItem('loadingShown', 'true');

  initializeMainApp();
}

function runLoadingAnimation() {
  fetch('loading.html')
    .then(res => res.text())
    .then(html => {
      loaderContainer.innerHTML = html;

      const loader = document.getElementById('loader');
      const currentLoadingImage = document.getElementById('current-loading-image');
      const nextLoadingImage = document.getElementById('next-loading-image');
      const progressBarFill = document.querySelector('.progress-bar-fill');
      const loadingPercentage = document.querySelector('.loading-percentage');

      const imagePaths = [
        'assets/images/loading1.png',
        'assets/images/loading2.png',
        'assets/images/loading3.png',
        'assets/images/loading4.png',
        'assets/images/loading5.png'
      ];

      const imageScales = [0.95, 0.95, 0.95, 0.95, 1.0];
      const totalDuration = 4.5;
      const imageFadeDuration = 0.6;
      const delayBetweenImages = (totalDuration - imageFadeDuration * imagePaths.length) / (imagePaths.length - 1);

      const preloadImages = (paths) => Promise.all(paths.map(src => {
        return new Promise(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
        });
      }));

      const container = document.getElementById("circle");
      const totalRings = 25;
      const dotsPerRing = 50;
      const ringSpacing = 15;
      const timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });

      for (let r = 1; r <= totalRings; r++) {
        const radius = r * ringSpacing;

        for (let i = 0; i < dotsPerRing; i++) {
          const dot = document.createElement("div");
          dot.classList.add("dot");

          const hue = Math.floor(Math.random() * 360);
          dot.style.backgroundColor = `hsl(${hue}, 80%, 70%)`;

          const minSize = 2 + r * 0.3;
          const maxSize = 4 + r * 1.2;
          const size = Math.random() * (maxSize - minSize) + minSize;
          dot.style.width = `${size}px`;
          dot.style.height = `${size}px`;

          dot.style.left = "50%";
          dot.style.top = "50%";

          const angle = (i / dotsPerRing) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          container.appendChild(dot);

          const delayOffset = r * 0.25 + i * 0.01;
          timeline.fromTo(dot, {
            x: 0, y: 0, scale: 0.2, opacity: 0
          }, {
            x: x, y: y, scale: 1, opacity: 1, duration: 1.0, delay: delayOffset, ease: "sine.out"
          }, 0).to(dot, {
            x: 0, y: 0, scale: 0.2, opacity: 0, duration: 1.0, delay: 0.2, ease: "sine.in"
          }, `>`);
        }
      }

      preloadImages(imagePaths).then(() => {
        const tl = gsap.timeline({
          onUpdate: () => {
            const p = Math.round(tl.progress() * 100);
            progressBarFill.style.width = `${p}%`;
            loadingPercentage.textContent = `${p}%`;
          },
          onComplete: () => {
            gsap.to(loader, {
              opacity: 0,
              duration: 0.8,
              ease: 'power2.out',
              onComplete: showMainContent // ✅ 로딩 끝나고 메인 진입
            });
          }
        });

        gsap.set(currentLoadingImage, { scale: imageScales[0] });

        for (let i = 0; i < imagePaths.length; i++) {
          const isLast = i === imagePaths.length - 1;
          const scale = imageScales[i];
          const next = imagePaths[i + 1];

          tl.to(currentLoadingImage, { scale, duration: imageFadeDuration }, i > 0 ? "+=0" : 0);

          if (!isLast) {
            tl.set(nextLoadingImage, { src: next, opacity: 0, scale: imageScales[i + 1] }, "<")
              .to(currentLoadingImage, { opacity: 0, duration: imageFadeDuration }, "<0.1")
              .to(nextLoadingImage, { opacity: 1, duration: imageFadeDuration }, "<")
              .call(() => {
                currentLoadingImage.src = next;
                gsap.set(currentLoadingImage, { opacity: 1, scale: imageScales[i + 1] });
                gsap.set(nextLoadingImage, { opacity: 0, src: '' });
              }, null, "+=0.05")
              .to({}, { duration: delayBetweenImages, ease: 'none' });
          }
        }
      });
    });
}

window.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('loadingShown')) {
    showMainContent();
  } else {
    runLoadingAnimation();
  }
});
