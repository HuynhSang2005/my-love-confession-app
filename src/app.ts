// =================================================================
// ============== PHẦN LOGIC CHÍNH CỦA ỨNG DỤNG =====================
// =================================================================

// --- Lấy các element cần thiết từ DOM ---
const body = document.body;
const questionPage = document.getElementById('question-page')!;
const galleryPage = document.getElementById('gallery-page')!;
const yesBtn = document.querySelector('.yes-btn') as HTMLButtonElement;
const noBtn = document.querySelector('.no-btn') as HTMLButtonElement;
const answerText = document.querySelector('.answer-text') as HTMLParagraphElement;
const resetBtn = document.querySelector('.reset-btn') as HTMLButtonElement;

let yesButtonMoveCount = 0;
const MAX_MOVES = 3;
let yesBtnCanClick = false;

function moveYesBtn() {
  if (yesButtonMoveCount >= MAX_MOVES) {
    yesBtnCanClick = true;
    return;
  }
  
  yesButtonMoveCount++;
  
  // Lấy kích thước viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Lấy kích thước button
  const buttonWidth = 150; // Cố định kích thước để tránh lỗi
  const buttonHeight = 50;
  
  // Tạo vị trí ngẫu nhiên với margin an toàn
  const margin = 20;
  const maxX = viewportWidth - buttonWidth - margin;
  const maxY = viewportHeight - buttonHeight - margin;
  
  // Đảm bảo vị trí không âm
  const newX = Math.max(margin, Math.random() * maxX);
  const newY = Math.max(margin, Math.random() * maxY);
  
  // Thêm class moving để tắt pointer events
  yesBtn.classList.add('moving');
  
  // Chuyển button sang position fixed để tránh bị ảnh hưởng bởi container
  yesBtn.style.position = 'fixed';
  yesBtn.style.left = `${newX}px`;
  yesBtn.style.top = `${newY}px`;
  yesBtn.style.width = `${buttonWidth}px`;
  yesBtn.style.height = `${buttonHeight}px`;
  yesBtn.style.zIndex = '1000';
  
  // Sau 500ms, cho phép tương tác lại
  setTimeout(() => {
    yesBtn.classList.remove('moving');
    
    // Nếu đã di chuyển đủ số lần, cho phép click
    if (yesButtonMoveCount >= MAX_MOVES) {
      yesBtnCanClick = true;
      yesBtn.style.boxShadow = '0 0 20px rgba(233, 77, 88, 0.8)';
      yesBtn.style.animation = 'pulse 1s infinite';
    }
  }, 500);
}

// Logic cho button "Có, em yêu" (troll button)
yesBtn.addEventListener('mouseenter', () => {
  if (!yesBtnCanClick) {
    moveYesBtn();
  }
});

yesBtn.addEventListener('touchstart', (e) => {
  if (!yesBtnCanClick) {
    e.preventDefault();
    moveYesBtn();
  }
});

yesBtn.addEventListener('click', (e) => {
  if (!yesBtnCanClick) {
    e.preventDefault();
    moveYesBtn();
  } else {
    // Route đến gallery
    navigateTo('gallery');
  }
});

// Logic cho button "Không yêu" (button đứng yên)
noBtn.addEventListener('click', () => {
  // Hiện text tiêu cực và button reset
  answerText.textContent = 'Anh hiểu rồi, em có thương yêu gì tôi ! Ai rồi cũng kháccccc';
  resetBtn.style.display = 'block';
  yesBtn.style.display = 'none';
  noBtn.style.display = 'none';
});

// Logic cho button reset
resetBtn.addEventListener('click', () => {
  // Reset tất cả về trạng thái ban đầu
  yesButtonMoveCount = 0;
  yesBtnCanClick = false;
  answerText.textContent = '';
  resetBtn.style.display = 'none';
  yesBtn.style.display = 'block';
  noBtn.style.display = 'block';
  
  // Reset style của button "Có yêu"
  yesBtn.style.position = 'relative';
  yesBtn.style.left = '';
  yesBtn.style.top = '';
  yesBtn.style.width = '';
  yesBtn.style.height = '';
  yesBtn.style.zIndex = '';
  yesBtn.style.boxShadow = '';
  yesBtn.style.animation = '';
  yesBtn.classList.remove('moving');
});

function navigateTo(page: 'question' | 'gallery') {
  if (page === 'gallery') {
    questionPage.classList.remove('active');
    galleryPage.classList.add('active');
    body.classList.add('gallery-active');
    
    // Reset lại gallery trước khi khởi động
    const existingHearts = document.querySelector('.floating-hearts');
    const existingSparkles = document.querySelector('.sparkles');
    if (existingHearts) existingHearts.remove();
    if (existingSparkles) existingSparkles.remove();
    
    // Khởi động gallery và hiệu ứng
    setTimeout(() => {
      initGallery();
      initWebGLHeartAnimation();
      
      // Khởi động audio
      const audio = document.querySelector('audio') as HTMLAudioElement;
      if (audio) {
        audio.play().catch(e => {
          console.log('Audio autoplay blocked:', e);
          // Thêm user interaction để play audio
          document.addEventListener('click', () => {
            audio.play();
          }, { once: true });
        });
      }
    }, 500);
  } else {
    questionPage.classList.add('active');
    galleryPage.classList.remove('active');
    body.classList.remove('gallery-active');
    
    // Dừng audio
    const audio = document.querySelector('audio') as HTMLAudioElement;
    if (audio) {
      audio.pause();
    }
    
    // Reset WebGL
    webGLInitialized = false;
  }
}

// =================================================================
// ============== PHẦN LOGIC CHO GALLERY KỶ NIỆM ===================
// =================================================================

function initGallery() {
  const radius = 260;
  const imgWidth = 140;
  const imgHeight = 200;

  const odrag = document.getElementById('drag-container');
  const ospin = document.getElementById('spin-container');
  const ground = document.getElementById('ground');
  const galleryTitle = document.querySelector('.gallery-title') as HTMLElement;
  
  if (!odrag || !ospin || !ground) {
    console.warn("Gallery elements not found");
    return;
  }

  // Tạo floating hearts
  createFloatingHearts();
  
  // Tạo sparkles
  createSparkles();

  const aImg = ospin.getElementsByTagName('img');
  const aEle = [...aImg];

  // Đảm bảo có ảnh để hiển thị
  if (aEle.length === 0) {
    console.warn("No images found in gallery");
    return;
  }

  console.log(`Found ${aEle.length} images in gallery`);

  // Set container dimensions
  ospin.style.width = `${imgWidth}px`;
  ospin.style.height = `${imgHeight}px`;

  // Đảm bảo gallery title luôn hiển thị
  if (galleryTitle) {
    galleryTitle.style.display = 'block';
    galleryTitle.style.opacity = '1';
  }

  // Initialize carousel positioning
  function init(delayTime: number) {
    const angleStep = 360 / aEle.length;
    
    for (let i = 0; i < aEle.length; i++) {
      const ele = aEle[i] as HTMLImageElement;
      const angle = i * angleStep;
      
      // Position each image in 3D space
      ele.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
      ele.style.transition = "transform 1s ease";
      ele.style.transitionDelay = `${delayTime ? delayTime / 1000 : (aEle.length - i) / 4}s`;
      
      // Ensure images are visible
      ele.style.display = 'block';
      ele.style.opacity = '1';
      
      console.log(`Image ${i + 1} positioned at angle ${angle}deg`);
    }
  }

  // Initialize with delay
  setTimeout(() => {
    init(1000);
    
    // Khởi động auto-rotation sau khi init xong
    setTimeout(() => {
      ospin.style.animation = 'autoSpin 20s linear infinite';
      console.log('Auto-rotation started');
    }, 2000);
  }, 100);

  // Interaction variables
  let sX: number, sY: number, nX: number, nY: number;
  let desX = 0, desY = 0, tX = 0, tY = 10;
  let timer: ReturnType<typeof setInterval>;

  // Apply transform to container với giới hạn an toàn
  function applyTransform(obj: HTMLElement) {
    // Giới hạn rotation để tránh mất elements
    if (tY > 90) tY = 90;   // Không cho xoay quá 90 độ lên trên
    if (tY < -20) tY = -20; // Không cho xoay quá -20 độ xuống dưới
    
    obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
    
    // Log để debug
    console.log(`Transform applied: rotateX(${-tY}deg) rotateY(${tX}deg)`);
  }

  // Mouse/touch interaction với cải tiến
  document.onpointerdown = function (e) {
    if (!galleryPage.classList.contains('active')) return false;
    
    clearInterval(timer);
    e = e || window.event;
    sX = e.clientX;
    sY = e.clientY;

    // Pause auto-rotation
    if (ospin.style.animationPlayState) {
      ospin.style.animationPlayState = 'paused';
    }

    this.onpointermove = function (e) {
      e = e || window.event;
      nX = e.clientX;
      nY = e.clientY;
      desX = nX - sX;
      desY = nY - sY;
      
      // Giảm sensitivity để tránh di chuyển quá nhanh
      tX += desX * 0.05;
      tY += desY * 0.05;
      
      applyTransform(odrag);
      sX = nX;
      sY = nY;
    };

    this.onpointerup = function () {
      timer = setInterval(function () {
        desX *= 0.95;
        desY *= 0.95;
        tX += desX * 0.05;
        tY += desY * 0.05;
        applyTransform(odrag);

        if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
          clearInterval(timer);
          // Resume auto-rotation
          if (ospin.style.animationPlayState) {
            ospin.style.animationPlayState = 'running';
          }
        }
      }, 17);
      
      this.onpointermove = this.onpointerup = null;
    };

    return false;
  };

  // Keyboard navigation với giới hạn
  document.addEventListener('keydown', function(e) {
    if (!galleryPage.classList.contains('active')) return;
    
    switch(e.key) {
      case 'ArrowLeft':
        tX -= 5; // Giảm step size
        applyTransform(odrag);
        break;
      case 'ArrowRight':
        tX += 5;
        applyTransform(odrag);
        break;
      case 'ArrowUp':
        if (tY < 90) { // Giới hạn
          tY += 5;
          applyTransform(odrag);
        }
        break;
      case 'ArrowDown':
        if (tY > -20) { // Giới hạn
          tY -= 5;
          applyTransform(odrag);
        }
        break;
    }
  });

  // Reset button để về vị trí ban đầu
  document.addEventListener('keydown', function(e) {
    if (!galleryPage.classList.contains('active')) return;
    
    if (e.key === 'r' || e.key === 'R') {
      tX = 0;
      tY = 10;
      applyTransform(odrag);
    }
  });
}

// Sửa function createFloatingHearts để tránh duplicate
function createFloatingHearts() {
  const existingHearts = document.querySelector('.floating-hearts');
  if (existingHearts) {
    existingHearts.remove();
  }
  
  const heartsContainer = document.createElement('div');
  heartsContainer.className = 'floating-hearts';
  
  for (let i = 0; i < 9; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    heartsContainer.appendChild(heart);
  }
  
  document.getElementById('gallery-page')?.appendChild(heartsContainer);
}

// Sửa function createSparkles để tránh duplicate
function createSparkles() {
  const existingSparkles = document.querySelector('.sparkles');
  if (existingSparkles) {
    existingSparkles.remove();
  }
  
  const sparklesContainer = document.createElement('div');
  sparklesContainer.className = 'sparkles';
  
  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 2 + 's';
    sparklesContainer.appendChild(sparkle);
  }
  
  document.getElementById('gallery-page')?.appendChild(sparklesContainer);
}

// =================================================================
// =========== PHẦN LOGIC CHO HIỆU ỨNG TRÁI TIM WEBGL ==============
// =================================================================

let webGLInitialized = false;

function initWebGLHeartAnimation() {
  if (webGLInitialized) return;
  
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    console.warn("Canvas element not found");
    return;
  }

  const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
  if (!gl) {
    console.warn("WebGL not supported");
    return;
  }

  webGLInitialized = true;

  // Vertex shader source
  const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Fragment shader source với hiệu ứng đẹp hơn
  const fragmentShaderSource = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    
    vec2 getHeartPosition(float t) {
      return vec2(
        16.0 * sin(t) * sin(t) * sin(t),
        -(13.0 * cos(t) - 5.0 * cos(2.0 * t) - 2.0 * cos(3.0 * t) - cos(4.0 * t))
      );
    }
    
    float getGlow(float dist, float radius, float intensity) {
      return pow(radius / dist, intensity);
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 center = vec2(0.5, 0.5);
      vec2 pos = center - uv;
      
      pos.y /= u_resolution.x / u_resolution.y;
      pos.y += 0.02;
      
      float scale = 0.000020 * u_resolution.y;
      float t = u_time * 0.5;
      
      vec3 col = vec3(0.0);
      
      // Multiple hearts với màu sắc khác nhau
      for(float i = 0.0; i < 3.0; i++) {
        float heartTime = t + i * 2.0;
        vec2 heartPos = getHeartPosition(heartTime) * scale;
        float heartDist = length(pos - heartPos);
        
        vec3 heartColor = vec3(
          0.8 + 0.2 * sin(i * 2.0),
          0.3 + 0.3 * cos(i * 1.5),
          0.6 + 0.4 * sin(i * 3.0)
        );
        
        float glow = getGlow(heartDist, 0.012, 1.2);
        col += glow * heartColor;
      }
      
      // Sparkle effects
      vec2 sparklePos = fract(pos * 20.0 + u_time * 0.1);
      float sparkle = smoothstep(0.02, 0.0, length(sparklePos - 0.5));
      col += sparkle * vec3(1.0, 0.8, 0.9) * 0.3;
      
      // Tone mapping
      col = 1.0 - exp(-col * 0.8);
      col = pow(col, vec3(0.4545));
      
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  // Compile shader function
  function compileShader(source: string, type: number): WebGLShader | null {
    if (!gl) return null; // Thêm dòng này
    
    const shader = gl.createShader(type);
    if (!shader) return null;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }

  // Create program
  const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
  
  if (!vertexShader || !fragmentShader) {
    console.error('Failed to compile shaders');
    return;
  }

  const program = gl.createProgram();
  if (!program) {
    console.error('Failed to create program');
    return;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    return;
  }

  gl.useProgram(program);

  // Get attribute and uniform locations
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const timeLocation = gl.getUniformLocation(program, 'u_time');

  // Create buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
  const positions = new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
     1.0,  1.0,
  ]);
  
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  // Setup vertex attributes
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Resize function
  function resize() {
    if (!gl) return; // Thêm dòng này
    
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  // Animation loop
  let startTime = Date.now();
  
  function render() {
    if (!webGLInitialized || !gl) return; // Thêm !gl
    
    resize();
    
    const currentTime = (Date.now() - startTime) / 1000;
    
    // Clear canvas
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Set uniforms
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, currentTime);
    
    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    requestAnimationFrame(render);
  }

  // Handle window resize
  window.addEventListener('resize', resize);
  resize();
  
  // Start animation
  render();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  questionPage.classList.add('active');
});