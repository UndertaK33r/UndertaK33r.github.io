/**
 * Anime.js 动画配置文件
 * 现代化页面动画效果集合
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. 页面加载动画时间轴
    const pageLoadTimeline = anime.timeline({
        easing: 'cubicBezier(0.4, 0, 0.2, 1)', // 统一使用记忆中的缓动函数
        autoplay: true
    });
    
    // 2. 标题区域进场动画
    pageLoadTimeline
        .add({
            targets: '.title',
            opacity: [0, 1],
            translateY: [-60, 0],
            scale: [0.8, 1],
            duration: 1200,
            easing: 'spring(1, 80, 10, 0)' // 弹簧效果
        })
        .add({
            targets: '.title_img',
            opacity: [0, 1],
            scale: [0.5, 1],
            rotate: [45, 0],
            duration: 800,
            delay: 200
        }, '-=600') // 与上一个动画重叠600ms
        .add({
            targets: '#site_title',
            opacity: [0, 1],
            translateY: [30, 0],
            letterSpacing: ['0.3em', '0.08em'],
            duration: 1000,
            delay: anime.stagger(50, {direction: 'normal'}) // 字符逐个出现
        }, '-=400');
    
    // 3. 导航菜单动画
    pageLoadTimeline
        .add({
            targets: '.navi .menu-item-link',
            opacity: [0, 1],
            translateX: [-50, 0],
            duration: 600,
            delay: anime.stagger(100), // 菜单项逐个出现
            easing: 'cubicBezier(0.4, 0, 0.2, 1)'
        }, '-=800');
    
    // 4. 主内容区域动画
    pageLoadTimeline
        .add({
            targets: '.main',
            opacity: [0, 1],
            translateY: [40, 0],
            scale: [0.95, 1],
            duration: 1000,
            easing: 'cubicBezier(0.4, 0, 0.2, 1)'
        }, '-=600');
    
    // 5. 文章列表动画（如果存在）
    if (document.querySelectorAll('.index_list').length > 0) {
        pageLoadTimeline
            .add({
                targets: '.index_list',
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                delay: anime.stagger(150),
                easing: 'cubicBezier(0.4, 0, 0.2, 1)'
            }, '-=400');
    }
    
    // 6. 鼠标悬停增强动画
    setupHoverAnimations();
    
    // 7. 滚动触发动画
    setupScrollAnimations();
    
    // 8. 鼠标跟随特效已移除，保持页面简洁
});

/**
 * 设置悬停动画
 */
function setupHoverAnimations() {
    // 标题图片悬停动画
    const titleImg = document.querySelector('.title_img');
    if (titleImg) {
        titleImg.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.1,
                rotate: '1turn',
                duration: 600,
                easing: 'cubicBezier(0.4, 0, 0.2, 1)'
            });
        });
        
        titleImg.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                rotate: 0,
                duration: 400,
                easing: 'cubicBezier(0.4, 0, 0.2, 1)'
            });
        });
    }
    
    // 链接悬停动画增强
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                translateY: -2,
                scale: 1.02,
                duration: 300,
                easing: 'cubicBezier(0.4, 0, 0.2, 1)'
            });
        });
        
        link.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                translateY: 0,
                scale: 1,
                duration: 300,
                easing: 'cubicBezier(0.4, 0, 0.2, 1)'
            });
        });
    });
}

/**
 * 设置滚动触发动画
 */
function setupScrollAnimations() {
    // 创建Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视口时触发动画
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    duration: 800,
                    easing: 'cubicBezier(0.4, 0, 0.2, 1)'
                });
                
                // 移除观察，避免重复动画
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // 观察所有文章内容元素
    document.querySelectorAll('#post_content h1, #post_content h2, #post_content h3, #post_content p, #post_content img, #post_content pre').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/**
 * 文字打字机效果
 */
function typewriterEffect(element, text, speed = 100) {
    element.textContent = '';
    const chars = text.split('');
    
    anime({
        targets: chars,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 200,
        delay: anime.stagger(speed),
        easing: 'cubicBezier(0.4, 0, 0.2, 1)',
        begin: function() {
            chars.forEach((char, index) => {
                setTimeout(() => {
                    element.textContent += char;
                }, index * speed);
            });
        }
    });
}

/**
 * 页面切换动画
 */
function pageTransition() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        z-index: 10000;
        transform: translateX(-100%);
    `;
    document.body.appendChild(overlay);
    
    anime({
        targets: overlay,
        translateX: ['-100%', '0%'],
        duration: 600,
        easing: 'cubicBezier(0.4, 0, 0.2, 1)',
        complete: function() {
            anime({
                targets: overlay,
                translateX: ['0%', '100%'],
                duration: 600,
                delay: 200,
                easing: 'cubicBezier(0.4, 0, 0.2, 1)',
                complete: function() {
                    document.body.removeChild(overlay);
                }
            });
        }
    });
}

// 导出函数供其他脚本使用
window.animeEffects = {
    typewriterEffect,
    pageTransition
};