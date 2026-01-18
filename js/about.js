let indexs = 0;
let indexs02 = 0;
let startTime;
const flags = {};

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
}

function about_main() {
    startTime = new timer;
    if (w < 500) {
        alert('当前屏幕分辨率过低，可能无法显示全部内容');
    }
    const w1 = window.innerWidth;
    const player = document.querySelector('.yly_music');
    if (player) {
        player.style.display = w1 < 2000 ? 'none' : 'block';
    }
    if (debug) logout('测试');
    
    if (isMobileDevice()) {
        const videos = document.querySelectorAll('.video-background');
        videos.forEach(video => {
            const source = video.querySelector('source');
            if (source) {
                source.src = '';
                video.preload = 'none';
            }
        });
    }
    
    loading();
    lastInfo();
}

function checkPerformance() {
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return {
        isLowEndDevice,
        isMobile,
        shouldReduceEffects: isLowEndDevice || isMobile
    };
}

//加载动画
function loading() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.querySelector('.loading-progress-bar');
    const percentage = document.querySelector('.loading-percentage');
    const particlesContainer = document.getElementById('loadingParticles');
    
    if (!loadingScreen) return;
    
    let progress = 0;
    const totalProgress = 100;
    const duration = 1000;
    const updateInterval = 30;
    const progressPerUpdate = totalProgress / (duration / updateInterval);
    
    const progressIntervalId = setInterval(() => {
        progress += progressPerUpdate;
        if (progress >= totalProgress) {
            progress = totalProgress;
            clearInterval(progressIntervalId);
        }
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (percentage) {
            percentage.textContent = Math.floor(progress) + '%';
        }
    }, updateInterval);
    
    window.loadingProgress = progressIntervalId;
    
    if (particlesContainer) {
        createParticles(particlesContainer);
    }
}

function createParticles(container) {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(particle);
    }
}

//加载完成后运行
function loaddone() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.querySelector('.loading-progress-bar');
    const percentage = document.querySelector('.loading-percentage');
    
    if (window.loadingProgress) {
        clearInterval(window.loadingProgress);
    }
    
    if (progressBar) {
        progressBar.style.width = '100%';
    }
    if (percentage) {
        percentage.textContent = '100%';
    }
    
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        initToggleViewBtn();
        init3DGlassEffect();
        initTimeDisplay();
        
        if (w < 750) {
            cycle_b(false);
        }
        addClick() //绑定按键
        // player.play(0, 0); //自动播放音乐
        
        // 后台预加载其他视频壁纸
        preloadVideos();
        
        // 初始化烟花效果
        const performance = checkPerformance();
        if (!performance.shouldReduceEffects) {
            initFireworks();
            // 初始化鼠标拖尾效果
            initTrail();
        } else {
        }
    }, 500);
}

//初始化烟花效果
function initFireworks() {
    try {
        const canvasEl = document.getElementById('fireworksCanvas');
        if (!canvasEl) {
            console.warn('烟花画布元素未找到');
            return;
        }
        
        const ctx = canvasEl.getContext('2d');
        if (!ctx) {
            console.warn('无法获取 2D 上下文');
            return;
        }
        
        const lightColors = ['102, 167, 221', '62, 131, 225', '33, 78, 194'];
        const darkColors = ['135, 206, 250', '70, 130, 180', '65, 105, 225', '100, 149, 237', '0, 191, 255'];
        const pinkColors = ['252, 146, 174', '202, 180, 190', '207, 198, 255', '233, 179, 237', '255, 182, 193'];
        
        window.fireworksColors = ['100, 149, 237', '65, 105, 225', '138, 43, 226', '75, 85, 211', '0, 191, 255'];
        window.fireworksCircleColor = 'rgb(100, 149, 237)';
        
        const numberOfParticles = 20;
        const orbitRadius = { min: 50, max: 100 };
        const circleRadius = { min: 10, max: 20 };
        const diffuseRadius = { min: 50, max: 100 };
        const animeDuration = { min: 900, max: 1500 };
        
        let pointerX = 0;
        let pointerY = 0;
        
        function setCanvasSize() {
            try {
                canvasEl.width = window.innerWidth;
                canvasEl.height = window.innerHeight;
                canvasEl.style.width = window.innerWidth + 'px';
                canvasEl.style.height = window.innerHeight + 'px';
            } catch (e) {
                console.error('设置画布大小失败:', e);
            }
        }
        
        function updateCoords(e) {
            pointerX = e.clientX;
            pointerY = e.clientY;
        }
        
        function setParticleDirection(p) {
            const angle = (anime.random(0, 360) * Math.PI) / 180;
            const value = anime.random(diffuseRadius.min, diffuseRadius.max);
            const radius = [-1, 1][anime.random(0, 1)] * value;
            return {
                x: p.x + radius * Math.cos(angle),
                y: p.y + radius * Math.sin(angle),
            };
        }
        
        function createParticle(x, y) {
            return {
                x,
                y,
                color: `rgba(${window.fireworksColors[anime.random(0, window.fireworksColors.length - 1)]},${anime.random(0.2, 0.8)})`,
                radius: anime.random(circleRadius.min, circleRadius.max),
                angle: anime.random(0, 360),
                endPos: setParticleDirection({ x, y }),
                draw() {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate((this.angle * Math.PI) / 180);
                    ctx.beginPath();
                    ctx.moveTo(0, -this.radius);
                    ctx.lineTo(this.radius * Math.sin(Math.PI / 3), this.radius * Math.cos(Math.PI / 3));
                    ctx.lineTo(-this.radius * Math.sin(Math.PI / 3), this.radius * Math.cos(Math.PI / 3));
                    ctx.closePath();
                    ctx.fillStyle = this.color;
                    ctx.fill();
                    ctx.restore();
                },
            };
        }
        
        function createCircle(x, y) {
            return {
                x,
                y,
                color: window.fireworksCircleColor,
                radius: 0.1,
                alpha: 0.5,
                lineWidth: 6,
                draw() {
                    ctx.globalAlpha = this.alpha;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
                    ctx.lineWidth = this.lineWidth;
                    ctx.strokeStyle = this.color;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                },
            };
        }
        
        function renderParticle(anim) {
            anim.animatables.forEach(animatable => {
                const target = animatable.target;
                if (typeof target.draw === 'function') {
                    try {
                        target.draw();
                    } catch (e) {
                        console.error('渲染粒子失败:', e);
                    }
                }
            });
        }
        
        function animateParticles(x, y) {
            const circle = createCircle(x, y);
            const particles = Array.from({ length: numberOfParticles }, () => createParticle(x, y));
            
            anime.timeline()
                .add({
                    targets: particles,
                    x(p) { return p.endPos.x; },
                    y(p) { return p.endPos.y; },
                    radius: 0,
                    duration: anime.random(animeDuration.min, animeDuration.max),
                    easing: 'easeOutExpo',
                    update: renderParticle,
                })
                .add({
                    targets: circle,
                    radius: anime.random(orbitRadius.min, orbitRadius.max),
                    lineWidth: 0,
                    alpha: {
                        value: 0,
                        easing: 'linear',
                        duration: anime.random(600, 800),
                    },
                    duration: anime.random(1200, 1800),
                    easing: 'easeOutExpo',
                    update: renderParticle,
                }, 0);
        }
        
        const render = anime({
            duration: Number.POSITIVE_INFINITY,
            update: () => {
                try {
                    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
                } catch (e) {
                    console.error('清除画布失败:', e);
                }
            },
        });
        
        function handleMouseDown(e) {
            try {
                render.play();
                updateCoords(e);
                animateParticles(pointerX, pointerY);
            } catch (err) {
                console.error('烟花动画执行失败:', err);
            }
        }
        
        function handleResize() {
            try {
                setCanvasSize();
            } catch (err) {
                console.error('窗口大小调整失败:', err);
            }
        }
        
        document.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('resize', handleResize);
        setCanvasSize();
    } catch (error) {
        console.error('初始化烟花效果失败:', error);
    }
}

//初始化鼠标拖尾效果
function initTrail() {
    const trailCanvas = document.getElementById('trailCanvas');
    if (!trailCanvas) return;
    
    const trailCtx = trailCanvas.getContext('2d');
    if (!trailCtx) return;
    
    let lastX = 0;
    let lastY = 0;
    let lastMoveTime = 0;
    const throttleDelay = 16;
    
    const particles = [];
    const maxParticles = 100;
    const distanceThreshold = 8;
    const maxParticleCount = 5;
    
    function setTrailCanvasSize() {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
        trailCanvas.style.width = window.innerWidth + 'px';
        trailCanvas.style.height = window.innerHeight + 'px';
    }
    
    function createTrailParticle(x, y) {
        const radius = anime.random(3, 8);
        const angle = anime.random(0, 360);
        const speed = anime.random(0.2, 0.6);
        const speedX = Math.cos(angle * Math.PI / 180) * speed;
        const speedY = Math.sin(angle * Math.PI / 180) * speed;
        
        return {
            x,
            y,
            radius,
            color: `rgba(${window.fireworksColors[anime.random(0, window.fireworksColors.length - 1)]},${anime.random(0.5, 0.9)})`,
            angle,
            rotationSpeed: anime.random(-2, 2),
            speedX,
            speedY,
            life: 1,
            decay: anime.random(0.01, 0.02),
            draw() {
                trailCtx.save();
                trailCtx.translate(this.x, this.y);
                trailCtx.rotate((this.angle * Math.PI) / 180);
                trailCtx.beginPath();
                trailCtx.moveTo(0, -this.radius * 2);
                trailCtx.lineTo(this.radius * Math.sin(Math.PI / 3), this.radius * Math.cos(Math.PI / 3));
                trailCtx.lineTo(-this.radius * Math.sin(Math.PI / 3), this.radius * Math.cos(Math.PI / 3));
                trailCtx.closePath();
                trailCtx.fillStyle = this.color;
                trailCtx.fill();
                trailCtx.restore();
            },
        };
    }
    
    function updateTrail() {
        trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            p.x += p.speedX;
            p.y += p.speedY;
            p.angle += p.rotationSpeed;
            p.life -= p.decay;
            p.radius *= 0.995;
            p.speedX *= 0.99;
            p.speedY *= 0.99;
            
            if (p.life <= 0 || p.radius < 0.3) {
                particles.splice(i, 1);
                continue;
            }
            
            p.draw();
        }
        
        requestAnimationFrame(updateTrail);
    }
    
    function handleMouseMove(e) {
        const currentTime = Date.now();
        if (currentTime - lastMoveTime < throttleDelay) {
            return;
        }
        lastMoveTime = currentTime;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const distance = Math.sqrt(Math.pow(mouseX - lastX, 2) + Math.pow(mouseY - lastY, 2));
        
        if (distance > distanceThreshold) {
            const particleCount = Math.min(Math.floor(distance / distanceThreshold), maxParticleCount);
            for (let i = 0; i < particleCount; i++) {
                if (particles.length < maxParticles) {
                    const t = i / particleCount;
                    const x = lastX + (mouseX - lastX) * t;
                    const y = lastY + (mouseY - lastY) * t;
                    particles.push(createTrailParticle(x, y));
                }
            }
            lastX = mouseX;
            lastY = mouseY;
        }
    }
    
    function handleResize() {
        setTrailCanvasSize();
    }
    
    function cleanup() {
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
    }
    
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    window.addEventListener('beforeunload', cleanup);
    setTrailCanvasSize();
    updateTrail();
}

//后台预加载其他视频壁纸
function preloadVideos() {
    const videos = document.querySelectorAll('.video-background');
    if (videos.length === 0) return;
    
    let currentIndex = 1;
    const preloadDelay = 4000; // 每3秒预加载一个视频
    
    function preloadNextVideo() {
        if (currentIndex >= videos.length) return;
        
        const video = videos[currentIndex];
        const source = video.querySelector('source');
        
        if (source && source.dataset.src) {
            source.src = source.dataset.src;
            delete source.dataset.src;
            video.load();
        }
        
        currentIndex++;
        if (currentIndex < videos.length) {
            setTimeout(preloadNextVideo, preloadDelay);
        }
    }
    
    // 延迟开始预加载，避免影响第一页视频的加载
    setTimeout(preloadNextVideo, 5000);
}

//切换视图按钮功能
function initToggleViewBtn() {
    var toggleBtn = document.getElementById('toggleViewBtn');
    if (!toggleBtn) return;
    
    window.isWallpaperMode = false;
    
    toggleBtn.addEventListener('click', function() {
        window.isWallpaperMode = !window.isWallpaperMode;
        
        if (window.isWallpaperMode) {
            document.body.classList.add('wallpaper-mode');
            arrow.style.bottom = "-50px";
            toggleBtn.classList.add('active');
        } else {
            document.body.classList.remove('wallpaper-mode');
            if (indexs <= 3) {
                arrow.style.bottom = "50px";
            }
            toggleBtn.classList.remove('active');
        }
        
        if (typeof updateTimeWidgetVisibility === 'function') {
            updateTimeWidgetVisibility();
        }
    });
}

//3D玻璃效果
function init3DGlassEffect() {
    var box01Content = document.querySelector('.box01_content');
    var box02Content = document.querySelector('.box02_content');
    var box03Content = document.querySelector('.box03_content');
    var box04Content = document.querySelector('.box04_content');
    
    if (!box01Content && !box02Content && !box03Content && !box04Content) return;
    
    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;
    
    function createGlassEffect(content) {
        if (!content) return;
        
        var currentRotateX = 0;
        var currentRotateY = 0;
        var targetRotateX = 0;
        var targetRotateY = 0;
        var isHovering = false;
        var animationId = null;
        
        function animate() {
            if (!isHovering) {
                targetRotateX = 0;
                targetRotateY = 0;
            }
            
            var ease = 0.1;
            currentRotateX += (targetRotateX - currentRotateX) * ease;
            currentRotateY += (targetRotateY - currentRotateY) * ease;
            
            content.style.transform = 'perspective(1000px) rotateX(' + currentRotateX + 'deg) rotateY(' + currentRotateY + 'deg)';
            
            if (isHovering || Math.abs(currentRotateX) > 0.1 || Math.abs(currentRotateY) > 0.1) {
                animationId = requestAnimationFrame(animate);
            } else {
                animationId = null;
            }
        }
        
        content.addEventListener('mousemove', function(e) {
            var rect = content.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            
            var normalizedX = (x - centerX) / centerX;
            var normalizedY = (y - centerY) / centerY;
            
            var maxRotation = 5;
            
            var smoothX = Math.sign(normalizedX) * Math.pow(Math.abs(normalizedX), 0.5);
            var smoothY = Math.sign(normalizedY) * Math.pow(Math.abs(normalizedY), 0.5);
            
            targetRotateX = smoothY * -maxRotation;
            targetRotateY = smoothX * maxRotation;
            
            content.style.setProperty('--mouse-x', (x / rect.width * 100) + '%');
            content.style.setProperty('--mouse-y', (y / rect.height * 100) + '%');
            
            if (!animationId) {
                animationId = requestAnimationFrame(animate);
            }
        });
        
        content.addEventListener('mouseenter', function() {
            isHovering = true;
            if (!animationId) {
                animationId = requestAnimationFrame(animate);
            }
        });
        
        content.addEventListener('mouseleave', function() {
            isHovering = false;
            if (!animationId) {
                animationId = requestAnimationFrame(animate);
            }
        });
    }
    
    createGlassEffect(box01Content);
    createGlassEffect(box02Content);
    createGlassEffect(box04Content);
}

function initTimeDisplay() {
    var currentTimeEl = document.getElementById('currentTime');
    var currentDateEl = document.getElementById('currentDate');
    var timeWidget = document.getElementById('timeWidget');
    var timeDragHandle = document.getElementById('timeDragHandle');
    
    if (!currentTimeEl || !currentDateEl || !timeWidget || !timeDragHandle) {
        return;
    }
    
    function updateTime() {
        var now = new Date();
        
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        
        var timeString = hours + ':' + minutes + ':' + seconds;
        
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        var weekDay = weekDays[now.getDay()];
        
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        
        var dateString = year + '年' + month + '月' + day + '日 ' + weekDay;
        
        currentTimeEl.textContent = timeString;
        currentDateEl.textContent = dateString;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
    
    makeDraggable(timeWidget, timeDragHandle, {
        onDragEnd: function(x, y) {
        }
    });
    
    updateTimeWidgetVisibility();
    
    var originalBtnChange = btnChange;
    btnChange = function(index, flag, speed) {
        originalBtnChange(index, flag, speed);
        window.updateTimeWidgetVisibility();
    };
}

window.updateTimeWidgetVisibility = function() {
    var timeWidget = document.getElementById('timeWidget');
    if (!timeWidget) return;
    
    if (window.isWallpaperMode) {
        timeWidget.style.opacity = '0';
        timeWidget.style.pointerEvents = 'none';
    } else if (indexs === 0) {
        timeWidget.style.opacity = '1';
        timeWidget.style.pointerEvents = 'auto';
    } else {
        timeWidget.style.opacity = '0';
        timeWidget.style.pointerEvents = 'none';
    }
}

//淡入文字
let indexs01 = 0;
var box01_p = document.getElementById('box01_text').children;
for (var i = 0; i < box01_p.length; i++) {
    box01_p[i].style.opacity = '0';
}
//让2秒后显示不负现在，不负将来
boxOneTimer = setInterval(boxOne, 2000);

function boxOne() {
    if (indexs != 0) {
        //暂无
    } else if (indexs01 < box01_p.length) {
        requestAnimationFrame(function() {
            if (box01_p[indexs01]) {
                box01_p[indexs01].style.opacity = '1';
            }
        });
        indexs01++;
    } else {
        clearInterval(boxOneTimer);
    }
}

//第一屏文字加载
var f_btn = document.getElementById("float_btn").children;
var nav_ul = document.getElementById('nav_ul').children;
var wrapBox = document.getElementById("wrapBox");
var foot = document.getElementById("foot");
var arrow = document.getElementById("arrow_img");
var boxs = document.getElementsByClassName("box");
var process = document.getElementById('bar_container').children; //进度条
var box02_text = document.getElementById('box02_text').children; //第二屏文字
var box02_timer;

function headclick() {
    var ran = RandomNum(-360, 360);
    cycle(ran, 300);
    setTimeout(function() {
        cycle(ran, 200);
    }, 2250);
}

//气泡旋转 a为角度b为轴距
function cycle(a, b) {
    var cycarr = document.getElementsByClassName("cycle_a");
    var aa = a;
    if (b == undefined) b = 200;
    for (var i = 0; i < cycarr.length; i++) {
        aa += 120;
        cycarr[i].style.animation = "unset"
        cycarr[i].style.transform = "rotate(" + (aa - (aa * 2)) + "deg) translateX(+" + b + "px) rotate(" + aa + "deg)";
    }
}
//旧气泡选择?
function cycle2(a, b) {
    var cycarr = document.getElementsByClassName("cycle_a");
    var aa = a;
    if (b == undefined) b = 200;
    for (var i = 0; i < cycarr.length; i++) {
        aa += 120;
        cycarr[i].style.animation = "unset"
        cycarr[i].style.transform = "rotate(" + (aa - (aa * 2)) + "deg) translateX(+" + b + "px) rotate(" + aa + "deg)";
    }
}

//气泡变形
var cycle_b_flag = false;

function cycle_b(b) {
    var cyc = byid("cycle_item");
    if (b != undefined) cycle_b_flag = b;
    if (cycle_b_flag = !cycle_b_flag) {

        cyc.classList.add("cycle_item_b")

    } else {
        cyc.classList.remove("cycle_item_b")
    }
}
// //////////////////////////////////////////////////////////
// 鼠标滚轮滚动事件处理函数
// function handleWheel(event) {
//     event.preventDefault();
//     if (event.deltaY > 0) {
//         // 向下滚动
//         if (indexs < 4) {
//             btnChange(indexs + 1, true, 300);
//         }
//     } else {
//         // 向上滚动
//         if (indexs > 0) {
//             btnChange(indexs - 1, true, 300);
//         }
//     }s
// }

//////////////////////////////////////////////////////////////////////////////
//第二屏动画
function boxTow() {
    if (indexs != 1) {
        //暂无
    } else if (indexs02 >= 0 && indexs02 < box02_text.length) {
        box02_text[indexs02].style.right = '0px';
        indexs02++;
    } else {
        clearInterval(box02_timer);
    }
}

//滚动函数
function divMove(overHeight) {
    var wrapBox = document.getElementById("wrapBox");
    if (overHeight == 4) {
        wrapBox.style.top = (-h * 3 - foot.offsetHeight) + "px";
    } else {
        wrapBox.style.top = -indexs * h + "px";
    }
}

//滚动函数
function btnChange(index, flag, speed) {
    const height = window.innerHeight;
    const fh = foot.offsetHeight;
    
    for (let n = 0; n < f_btn.length; n++) {
        f_btn[n].classList.remove("btn_on");
    }

    for (let n = 0; n < nav_ul.length; n++) {
        nav_ul[n].classList.remove("nav_li_on");
    }

    if (flag) {
        if (index <= 0) {
            indexs = 0;
            f_btn[0].classList.add("btn_on");
            nav_ul[0].classList.add("nav_li_on");
            divMove(indexs);
        } else if (index > 0 && index <= 3) {
            f_btn[index].classList.add("btn_on");
            nav_ul[index].classList.add("nav_li_on");
            divMove(indexs);
        } else if (index == 4) {
            indexs = 4;
            divMove(indexs);
            nav_ul[index].classList.add("nav_li_on");
        } else {
            indexs = 4;
        }
    } else {
        if (index <= 0) {
            indexs = 0;
            f_btn[0].classList.add("btn_on");
            nav_ul[0].classList.add("nav_li_on");
            wrapBox.style.top = "0";
        } else if (index > 0 && index <= 3) {
            f_btn[index].classList.add("btn_on");
            nav_ul[index].classList.add("nav_li_on");
            wrapBox.style.top = (-indexs * 100) + "%";
        } else if (index == 4) {
            indexs = 4;
            wrapBox.style.top = (-height * 3 - fh) + "px";
            nav_ul[index].classList.add("nav_li_on");
        } else {
            indexs = 4;
        }
    }
    if (indexs == 1 && !flags.box02) {
        for (let i = 0; i < process.length; i++) {
            process[i].className += ' active';
        }
        box02_timer = setInterval(boxTow, 1100);
        flags.box02 = true;
        indexs02 = 0;
    } else if (indexs == 2) {
        setTime_li();
    }
    if (window.isWallpaperMode) {
        arrow.style.bottom = "-50px";
    } else if (indexs > 3) {
        arrow.style.bottom = "-50px";
    } else {
        arrow.style.bottom = "50px";
    }
    
    changeVideoBackground(indexs);
    
    if (window.fireworksColors) {
        if (indexs === 0) {
            window.fireworksColors = ['100, 149, 237', '65, 105, 225', '138, 43, 226', '75, 85, 211', '0, 191, 255'];
            window.fireworksCircleColor = 'rgb(100, 149, 237)';
        } else if (indexs === 1) {
            window.fireworksColors = ['135, 206, 250', '70, 130, 180', '65, 105, 225', '100, 149, 237', '0, 191, 255'];
            window.fireworksCircleColor = 'rgb(135, 206, 250)';
        } else if (indexs === 2) {
            window.fireworksColors = ['252, 146, 174', '202, 180, 190', '207, 198, 255', '233, 179, 237', '255, 182, 193'];
            window.fireworksCircleColor = 'rgb(233, 179, 237)';
        } else {
            window.fireworksColors = ['135, 206, 250', '173, 216, 230', '224, 255, 255', '176, 224, 230', '240, 248, 255'];
            window.fireworksCircleColor = 'rgb(135, 206, 250)';
        }
    }
}

//时间轴翻页
var e_li = document.getElementById('timeUl').children;
var li_times = 0;
var left_div = document.getElementById('left_div');
var right_div = document.getElementById('right_div');
left_div.onclick = function () {
    if (li_times > 0) {
        li_times--;
        setTime_li();
    }
}

right_div.onclick = function () {
    if (li_times < e_li.length - 2) {
        li_times++;
        setTime_li();
    }
}

function setTime_li() {
    var ii = e_li.length;
    for (var i = 0; i < e_li.length; i++) {
        e_li[i].style.width = 100 / e_li.length + "%";
    }
    var timeUl = document.getElementById('timeUl');
    timeUl.style.width = e_li.length * 40 + "%";
    var i = e_li[0].offsetWidth * li_times;
    timeUl.style.left = 20 - i + 'px';
}

//触屏手势事件
window.addEventListener('touchstart', touchStart, false);
window.addEventListener('touchmove', touchMove, false);
window.addEventListener('touchend', touchEnd, false);
var touchO = {
    startY: 0,
    endY: 0,
    oldY: 0,
    flag: 0,
    startTop: 0,
}

function touchStart(event) {
    if (touchO.flag == 0) {
        ;
        wrapBox.classList.add("warpBox_tochMoveing");
        touchO.startY = event.touches[0].clientY;
        touchO.startTop = -indexs * 100;
        touchO.flag = 1;
    }
}

function touchMove(event) {
    if (touchO.flag == 1) {
        touchO.endY = event.touches[0].clientY;
        var movesize = touchO.endY - touchO.startY;
        wrapBox.style.top = touchO.startTop + (movesize / h * 100) + "%";
    }
}

function touchEnd(event) {
    if (touchO.flag == 1) {
        touchO.flag = 2;
        wrapBox.classList.remove("warpBox_tochMoveing");
        if (touchO.oldY == touchO.endY) {
            return;
        }
        touchO.oldY = touchO.endY;
        if (touchO.endY - touchO.startY > 100) {
            //向上滑动
            indexs = indexs - 1;
            btnChange(indexs, true, 1);
        } else if (touchO.startY - touchO.endY > 100) {
            //向下滑动
            indexs = indexs + 1;
            btnChange(indexs, true, 1);
        } else {
            btnChange(indexs, true, 1);
        }
        touchO.flag = -1;
        setTimeout(function() {
            touchO.flag = 0;
        }, 900);
    }
}

function addClick() {
    huam = byid("huam")
    //浮动点击事件
    for (var i = 0; i < f_btn.length; i++) {
        f_btn[i].indexs = i;
        f_btn[i].onclick = function () {
            var speed = Math.abs(indexs - this.indexs);
            indexs = this.indexs;
            btnChange(indexs, true, speed);
        }
    }

    //浮动nav事件
    for (var i = 0; i < nav_ul.length; i++) {
        nav_ul[i].indexs = i;
        nav_ul[i].onclick = function () {
            var speed = Math.abs(indexs - this.indexs);
            indexs = this.indexs;
            btnChange(indexs, true, speed);
        }
    }

    //箭头点击事件
    arrow.onclick = function () {
        indexs++
        btnChange(indexs, true, 1);
    }
    var oB = true;

    //鼠标滑动事件
    var scrollFunc = function (e) {
        var direct = 0;
        e = e || window.event;
        if (e.wheelDelta) { //IE/Opera/Chrome
            if (oB == true) {
                //向下滑动
                if (e.wheelDelta >= 120) {
                    oB = false;
                    indexs--;
                    btnChange(indexs, true, 1);
                    setTimeout(function () {
                        oB = true;
                    }, 700);

                } else if (e.wheelDelta <= -120) {
                    oB = false;
                    //向上滑动
                    indexs++;
                    btnChange(indexs, true, 1);
                    setTimeout(function () {
                        oB = true;
                    }, 700);
                }
            }

        } else if (e.detail) { //Firefox
            if (oB) {
                if (e.detail >= 3) {
                    oB = false;
                    indexs++;
                    btnChange(indexs, true, 1);
                    setTimeout(function () {
                        oB = true;
                    }, 700);
                } else if (e.detail <= -3) {
                    oB = false;
                    indexs--;
                    btnChange(indexs, true, 1);
                    setTimeout(function () {
                        oB = true;
                    }, 700);
                }
            }
        }
    }

    /*注册事件*/
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', scrollFunc, { passive: true }); //W3C
    }
    window.addEventListener('mousewheel', scrollFunc, { passive: true }); //IE/Opera/Chrome/Safari

    var iB = true;
    var resizeTimeout;
    //监听窗口改变
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            h = window.innerHeight;
            w = window.innerWidth;
            if (w / h >= 1920 / 1080) {
                iB = true;
            } else {
                iB = false;
            }
            divMove(indexs);
            setTime_li();
        }, 100);
    });
}

/*计时函数
 * 用法
 * var time=new timer
 * time.stop()
 */
function timer() {
    var t = new Date();
    var time = t.getTime();
    this.stop = function () {
        var t = new Date();
        return t - time;
    };
};

function changeVideoBackground(index) {
    const videos = document.querySelectorAll('.video-background');
    if (videos.length === 0) return;
    
    const videoIndex = Math.min(index, videos.length - 1);
    
    videos.forEach((video, i) => {
        if (i === videoIndex) {
            if (!video.classList.contains('active')) {
                video.classList.add('active');
                
                if (!isMobileDevice()) {
                    video.currentTime = 0;
                    
                    const source = video.querySelector('source');
                    if (source && source.dataset.src) {
                        source.src = source.dataset.src;
                        delete source.dataset.src;
                    }
                    
                    if (video.preload !== 'auto') {
                        video.preload = 'auto';
                    }
                    
                    video.load();
                    
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log('视频播放失败:', error);
                        });
                    }
                }
            }
        } else {
            if (video.classList.contains('active')) {
                video.classList.remove('active');
                if (!isMobileDevice()) {
                    video.pause();
                }
            }
        }
    });
}

about_main()