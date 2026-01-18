/**
 * 通用拖拽组件
 * @param {HTMLElement} element - 需要拖拽的元素
 * @param {HTMLElement} handle - 拖拽手柄元素
 * @param {Object} options - 配置选项
 * @param {Function} options.onDragStart - 拖拽开始回调
 * @param {Function} options.onDrag - 拖拽中回调
 * @param {Function} options.onDragEnd - 拖拽结束回调
 * @param {Object} options.boundary - 边界限制 {minX, maxX, minY, maxY}
 * @returns {Object} 返回包含 destroy 方法的对象
 */
function makeDraggable(element, handle, options = {}) {
    if (!element || !handle) {
        console.error('makeDraggable: element 和 handle 参数不能为空');
        return null;
    }

    const {
        onDragStart = null,
        onDrag = null,
        onDragEnd = null,
        boundary = null
    } = options;

    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let animationFrameId = null;
    let currentX = 0;
    let currentY = 0;

    handle.addEventListener('mousedown', function(e) {
        isDragging = true;
        element.classList.add('dragging');
        const rect = element.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        currentX = rect.left;
        currentY = rect.top;
        e.preventDefault();

        if (typeof onDragStart === 'function') {
            onDragStart(e, currentX, currentY);
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(function() {
            let newX = e.clientX - dragOffsetX;
            let newY = e.clientY - dragOffsetY;

            if (boundary) {
                const maxX = boundary.maxX !== undefined ? boundary.maxX : window.innerWidth - element.offsetWidth;
                const maxY = boundary.maxY !== undefined ? boundary.maxY : window.innerHeight - element.offsetHeight;
                const minX = boundary.minX !== undefined ? boundary.minX : 0;
                const minY = boundary.minY !== undefined ? boundary.minY : 0;

                newX = Math.max(minX, Math.min(newX, maxX));
                newY = Math.max(minY, Math.min(newY, maxY));
            } else {
                const maxX = window.innerWidth - element.offsetWidth;
                const maxY = window.innerHeight - element.offsetHeight;
                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));
            }

            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
            element.style.right = 'auto';

            currentX = newX;
            currentY = newY;

            if (typeof onDrag === 'function') {
                onDrag(e, currentX, currentY);
            }
        });
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            element.classList.remove('dragging');
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }

            if (typeof onDragEnd === 'function') {
                onDragEnd(currentX, currentY);
            }
        }
    });

    return {
        destroy: function() {
            handle.removeEventListener('mousedown', arguments.callee);
            document.removeEventListener('mousemove', arguments.callee);
            document.removeEventListener('mouseup', arguments.callee);
        }
    };
}
