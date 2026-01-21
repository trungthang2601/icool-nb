/**
 * DOM Optimizer - Giảm thiểu reflow/repaint bằng cách batch updates
 * Sử dụng DocumentFragment và requestAnimationFrame để tối ưu performance
 */

class DOMOptimizer {
  constructor() {
    this.updateQueue = [];
    this.rafId = null;
    this.isBatching = false;
  }

  /**
   * Batch multiple DOM updates vào một frame
   * @param {Function} updateFn - Function thực hiện DOM update
   */
  batchUpdate(updateFn) {
    this.updateQueue.push(updateFn);
    
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => {
        this.flushUpdates();
      });
    }
  }

  /**
   * Thực thi tất cả updates trong queue
   */
  flushUpdates() {
    // Tạm thời ẩn container để tránh reflow
    const updates = [...this.updateQueue];
    this.updateQueue = [];
    this.rafId = null;

    // Thực thi tất cả updates
    updates.forEach(updateFn => {
      try {
        updateFn();
      } catch (error) {
        console.error('Error in batched update:', error);
      }
    });
  }

  /**
   * Render HTML vào element sử dụng DocumentFragment (giảm reflow)
   * @param {HTMLElement} container - Element container
   * @param {string} html - HTML string
   * @param {boolean} append - Có append hay replace
   */
  renderHTML(container, html, append = false) {
    if (!container) return;

    this.batchUpdate(() => {
      if (append) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        while (temp.firstChild) {
          container.appendChild(temp.firstChild);
        }
      } else {
        // Sử dụng DocumentFragment để giảm reflow
        const fragment = document.createDocumentFragment();
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        while (temp.firstChild) {
          fragment.appendChild(temp.firstChild);
        }
        
        // Clear và append fragment (chỉ 1 reflow)
        container.innerHTML = '';
        container.appendChild(fragment);
      }
    });
  }

  /**
   * Render table rows hiệu quả với virtual scrolling
   * @param {HTMLElement} tbody - Table body element
   * @param {Array} data - Array of data objects
   * @param {Function} rowRenderer - Function render mỗi row: (item, index) => string
   * @param {Object} options - Options { startIndex, endIndex, emptyMessage }
   */
  renderTableRows(tbody, data, rowRenderer, options = {}) {
    if (!tbody) return;

    const {
      startIndex = 0,
      endIndex = data.length,
      emptyMessage = '<tr><td colspan="100%" class="text-center p-4">Không có dữ liệu.</td></tr>'
    } = options;

    this.batchUpdate(() => {
      if (data.length === 0) {
        tbody.innerHTML = emptyMessage;
        return;
      }

      // Sử dụng DocumentFragment để batch tất cả rows
      const fragment = document.createDocumentFragment();
      const temp = document.createElement('tbody');
      
      for (let i = startIndex; i < Math.min(endIndex, data.length); i++) {
        const rowHTML = rowRenderer(data[i], i);
        const row = document.createElement('tr');
        row.innerHTML = rowHTML;
        fragment.appendChild(row);
      }

      // Single DOM operation
      tbody.innerHTML = '';
      tbody.appendChild(fragment);
    });
  }

  /**
   * Update text content hiệu quả (không trigger reflow nếu không đổi)
   * @param {HTMLElement} element - Element cần update
   * @param {string} text - Text mới
   */
  updateText(element, text) {
    if (!element) return;
    
    if (element.textContent !== text) {
      this.batchUpdate(() => {
        element.textContent = text;
      });
    }
  }

  /**
   * Update attributes hiệu quả
   * @param {HTMLElement} element - Element
   * @param {Object} attributes - Object { attrName: value }
   */
  updateAttributes(element, attributes) {
    if (!element) return;

    this.batchUpdate(() => {
      Object.entries(attributes).forEach(([attr, value]) => {
        if (element.getAttribute(attr) !== String(value)) {
          element.setAttribute(attr, value);
        }
      });
    });
  }

  /**
   * Toggle classes hiệu quả
   * @param {HTMLElement} element - Element
   * @param {Object} classes - Object { className: boolean }
   */
  toggleClasses(element, classes) {
    if (!element) return;

    this.batchUpdate(() => {
      Object.entries(classes).forEach(([className, shouldAdd]) => {
        element.classList.toggle(className, shouldAdd);
      });
    });
  }

  /**
   * Clear element content hiệu quả
   * @param {HTMLElement} element - Element cần clear
   */
  clear(element) {
    if (!element) return;
    
    this.batchUpdate(() => {
      element.innerHTML = '';
    });
  }
}

/**
 * Virtual Scroller - Chỉ render phần visible của list/table
 */
class VirtualScroller {
  constructor(container, itemHeight, renderItem, options = {}) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.renderItem = renderItem;
    this.options = {
      buffer: options.buffer || 5, // Số items render thêm ở trên/dưới viewport
      ...options
    };
    
    this.data = [];
    this.scrollTop = 0;
    this.containerHeight = 0;
    
    this.init();
  }

  init() {
    // Tạo wrapper cho scrollable content
    this.wrapper = document.createElement('div');
    this.wrapper.style.position = 'relative';
    this.wrapper.style.height = '100%';
    this.wrapper.style.overflow = 'auto';
    
    // Spacer trên cùng (cho items phía trên viewport)
    this.topSpacer = document.createElement('div');
    this.topSpacer.style.height = '0px';
    
    // Container cho visible items
    this.itemsContainer = document.createElement('div');
    
    // Spacer dưới cùng (cho items phía dưới viewport)
    this.bottomSpacer = document.createElement('div');
    this.bottomSpacer.style.height = '0px';
    
    this.wrapper.appendChild(this.topSpacer);
    this.wrapper.appendChild(this.itemsContainer);
    this.wrapper.appendChild(this.bottomSpacer);
    
    // Replace container content
    this.container.innerHTML = '';
    this.container.appendChild(this.wrapper);
    
    // Listen to scroll
    this.wrapper.addEventListener('scroll', () => {
      this.handleScroll();
    });
    
    // Initial render
    this.update();
  }

  setData(data) {
    this.data = data;
    this.update();
  }

  handleScroll() {
    this.scrollTop = this.wrapper.scrollTop;
    this.update();
  }

  update() {
    if (!this.data || this.data.length === 0) {
      this.itemsContainer.innerHTML = '';
      return;
    }

    this.containerHeight = this.wrapper.clientHeight;
    const itemsPerView = Math.ceil(this.containerHeight / this.itemHeight);
    
    // Tính toán range cần render
    const startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.options.buffer);
    const endIndex = Math.min(
      this.data.length,
      startIndex + itemsPerView + (this.options.buffer * 2)
    );

    // Update spacers
    this.topSpacer.style.height = `${startIndex * this.itemHeight}px`;
    this.bottomSpacer.style.height = `${(this.data.length - endIndex) * this.itemHeight}px`;

    // Render visible items
    const fragment = document.createDocumentFragment();
    for (let i = startIndex; i < endIndex; i++) {
      const itemHTML = this.renderItem(this.data[i], i);
      const item = document.createElement('div');
      item.innerHTML = itemHTML;
      item.style.height = `${this.itemHeight}px`;
      fragment.appendChild(item);
    }

    this.itemsContainer.innerHTML = '';
    this.itemsContainer.appendChild(fragment);
  }
}

// Export singleton instance
const domOptimizer = new DOMOptimizer();

export { DOMOptimizer, VirtualScroller, domOptimizer };

