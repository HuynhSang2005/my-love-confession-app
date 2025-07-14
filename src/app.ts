// =================================================================
// ============== PHẦN LOGIC CHÍNH CỦA ỨNG DỤNG =====================
// =================================================================

// --- Lấy các element cần thiết từ DOM ---
const body = document.body;
const questionPage = document.getElementById('question-page')!;
const galleryPage = document.getElementById('gallery-page')!;
const yesBtn = document.querySelector('.yes-btn')!;
const noBtn = document.querySelector('.no-btn') as HTMLButtonElement;
const answerText = document.querySelector('.answer-text') as HTMLParagraphElement;

let noButtonMoveCount = 0;
const MAX_MOVES = 3;
let noBtnCanClick = false;

function moveNoBtn() {
  if (noButtonMoveCount < MAX_MOVES) {
    noButtonMoveCount++;
    noBtn.classList.add('moving');
    // Tính vị trí random trong viewport
    const btnRect = noBtn.getBoundingClientRect();
    const maxX = window.innerWidth - btnRect.width - 20;
    const maxY = window.innerHeight - btnRect.height - 20;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    setTimeout(() => {
      noBtn.classList.remove('moving');
      if (noButtonMoveCount === MAX_MOVES) {
        noBtnCanClick = true;
        noBtn.style.opacity = '1';
      }
    }, 300);
  }
}

noBtn.addEventListener('mouseover', () => {
  if (!noBtnCanClick) moveNoBtn();
});
noBtn.addEventListener('click', () => {
  if (!noBtnCanClick) {
    moveNoBtn();
  } else {
    answerText.textContent = 'Anh hiểu rồi, em có thương yêu gì tôi ! Ai rồi cũng kháccccc';
    setTimeout(() => {
      navigateTo('gallery');
    }, 1200);
  }
});

yesBtn.addEventListener('click', () => {
  navigateTo('gallery');
});

function navigateTo(page: 'question' | 'gallery') {
  if (page === 'gallery') {
    questionPage.classList.remove('active');
    galleryPage.classList.add('active');
    body.classList.add('gallery-active');
    // Khởi động hiệu ứng gallery và trái tim nếu cần
    initGallery();
    initWebGLHeartAnimation();
  } else {
    questionPage.classList.add('active');
    galleryPage.classList.remove('active');
    body.classList.remove('gallery-active');
  }
}

// =================================================================
// ============== PHẦN LOGIC CHO GALLERY KỶ NIỆM ===================
// =================================================================
// (Code được port và điều chỉnh từ project HonNgimm-MyLove)

function initGallery() {
  const radius = 240;
  const autoRotate = true;
  const rotateSpeed = -60; // seconds per 360 degrees
  const imgWidth = 120;
  const imgHeight = 170;

  const odrag = document.getElementById('drag-container')!;
  const ospin = document.getElementById('spin-container')!;
  const aImg = ospin.getElementsByTagName('img');
  const aEle = [...aImg];

  ospin.style.width = `${imgWidth}px`;
  ospin.style.height = `${imgHeight}px`;

  const ground = document.getElementById('ground')!;
  ground.style.width = `${radius * 3}px`;
  ground.style.height = `${radius * 3}px`;

  function init(delayTime: number) {
    for (let i = 0; i < aEle.length; i++) {
      const ele = aEle[i] as HTMLElement;
      ele.style.transform = `rotateY(${(i * (360 / aEle.length))}deg) translateZ(${radius}px)`;
      ele.style.transition = "transform 1s";
      ele.style.transitionDelay = `${delayTime || (aEle.length - i) / 4}s`;
    }
  }

  setTimeout(() => init(1000), 0);

  let sX: number, sY: number, nX: number, nY: number, desX = 0, desY = 0, tX = 0, tY = 10;
  
  if (autoRotate) {
    const animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
    ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
  }

  function applyTransform(obj: HTMLElement) {
    if (tY > 180) tY = 180;
    if (tY < 0) tY = 0;
    obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
  }
  
let timer: ReturnType<typeof setInterval>;
    document.onpointerdown = function (e) {
    clearInterval(timer);
    e = e || window.event;
    sX = e.clientX;
    sY = e.clientY;

    this.onpointermove = function (e) {
      e = e || window.event;
      nX = e.clientX;
      nY = e.clientY;
      desX = nX - sX;
      desY = nY - sY;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTransform(odrag);
      sX = nX;
      sY = nY;
    };

    this.onpointerup = function () {
      (ospin.style as any).animationPlayState = 'paused';
      timer = setInterval(function () {
        desX *= 0.95;
        desY *= 0.95;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTransform(odrag);

        if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
          clearInterval(timer);
          (ospin.style as any).animationPlayState = 'running';
        }
      }, 17);
      this.onpointermove = this.onpointerup = null;
    };

    return false;
  };
  
  // Initialize WebGL Heart Animation
  initWebGLHeartAnimation();
}


// =================================================================
// =========== PHẦN LOGIC CHO HIỆU ỨNG TRÁI TIM WEBGL ==============
// =================================================================
// (Code được giữ nguyên từ project HonNgimm-MyLove)

function initWebGLHeartAnimation() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.error("Unable to initialize WebGL.");
        return;
    }

    const vertexSource = `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }`;

    const fragmentSource = `
    precision highp float;
    uniform float width;
    uniform float height;
    vec2 resolution = vec2(width, height);
    uniform float time;
    #define POINT_COUNT 8
    vec2 points[POINT_COUNT];
    const float speed = -0.5;
    const float len = 0.25;
    float intensity = 1.3;
    float radius = 0.008;

    float sdBezier(vec2 pos, vec2 A, vec2 B, vec2 C){vec2 a=B-A;vec2 b=A-2.0*B+C;vec2 c=a*2.0;vec2 d=A-pos;float kk=1.0/dot(b,b);float kx=kk*dot(a,b);float ky=kk*(2.0*dot(a,a)+dot(d,b))/3.0;float kz=kk*dot(d,a);float res=0.0;float p=ky-kx*kx;float p3=p*p*p;float q=kx*(2.0*kx*kx-3.0*ky)+kz;float h=q*q+4.0*p3;if(h>=0.0){h=sqrt(h);vec2 x=(vec2(h,-h)-q)/2.0;vec2 uv=sign(x)*pow(abs(x),vec2(1.0/3.0));float t=uv.x+uv.y-kx;t=clamp(t,0.0,1.0);vec2 qos=d+(c+b*t)*t;res=length(qos);}else{float z=sqrt(-p);float v=acos(q/(p*z*2.0))/3.0;float m=cos(v);float n=sin(v)*1.732050808;vec3 t=vec3(m+m,-n-m,n-m)*z-kx;t=clamp(t,0.0,1.0);vec2 qos=d+(c+b*t.x)*t.x;float dis=dot(qos,qos);res=dis;qos=d+(c+b*t.y)*t.y;dis=dot(qos,qos);res=min(res,dis);qos=d+(c+b*t.z)*t.z;dis=dot(qos,qos);res=min(res,dis);res=sqrt(res);}return res;}
    vec2 getHeartPosition(float t){return vec2(16.0*sin(t)*sin(t)*sin(t),-(13.0*cos(t)-5.0*cos(2.0*t)-2.0*cos(3.0*t)-cos(4.0*t)));}
    float getGlow(float dist,float radius,float intensity){return pow(radius/dist,intensity);}
    float getSegment(float t,vec2 pos,float offset,float scale){for(int i=0;i<POINT_COUNT;i++){points[i]=getHeartPosition(offset+float(i)*len+fract(speed*t)*6.28);}vec2 c=(points[0]+points[1])/2.0;vec2 c_prev;float dist=10000.0;for(int i=0;i<POINT_COUNT-1;i++){c_prev=c;c=(points[i]+points[i+1])/2.0;dist=min(dist,sdBezier(pos,scale*c_prev,scale*points[i],scale*c));}return max(0.0,dist);}
    void main(){vec2 uv=gl_FragCoord.xy/resolution.xy;float widthHeightRatio=resolution.x/resolution.y;vec2 centre=vec2(0.5,0.5);vec2 pos=centre-uv;pos.y/=widthHeightRatio;pos.y+=0.02;float scale=0.000015*height;float t=time;float dist=getSegment(t,pos,0.0,scale);float glow=getGlow(dist,radius,intensity);vec3 col=vec3(0.0);col+=10.0*vec3(smoothstep(0.003,0.001,dist));col+=glow*vec3(1.0,0.05,0.3);dist=getSegment(t,pos,3.4,scale);glow=getGlow(dist,radius,intensity);col+=10.0*vec3(smoothstep(0.003,0.001,dist));col+=glow*vec3(0.1,0.4,1.0);col=1.0-exp(-col);col=pow(col,vec3(0.4545));gl_FragColor=vec4(col,1.0);}`;

    function compileShader(shaderSource: string, shaderType: number) {
        const shader = gl!.createShader(shaderType)!;
        gl!.shaderSource(shader, shaderSource);
        gl!.compileShader(shader);
        if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
            throw "Shader compile failed with: " + gl!.getShaderInfoLog(shader);
        }
        return shader;
    }

    const vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertexData = new Float32Array([-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, -1.0]);
    const vertexDataBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

    const positionHandle = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionHandle);
    gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 2 * 4, 0);

    const timeHandle = gl.getUniformLocation(program, 'time');
    const widthHandle = gl.getUniformLocation(program, 'width');
    const heightHandle = gl.getUniformLocation(program, 'height');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl!.viewport(0, 0, canvas.width, canvas.height);
        gl!.uniform1f(widthHandle, canvas.width);
        gl!.uniform1f(heightHandle, canvas.height);
    }
    window.addEventListener('resize', resize, false);
    resize();

    let time = 0.0;
    let lastFrame = Date.now();
    function draw() {
        const thisFrame = Date.now();
        time += (thisFrame - lastFrame) / 1000;
        lastFrame = thisFrame;

        gl!.uniform1f(timeHandle, time);
        gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(draw);
    }
    draw();
}