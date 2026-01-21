/**
 * Efficient Table Renderer - Render tables với incremental updates
 * Chỉ update những rows thay đổi thay vì re-render toàn bộ
 */

import { domOptimizer } from './dom-optimizer.js';

class TableRenderer {
  constructor(tbody, rowRenderer, options = {}) {
    this.tbody = tbody;
    this.rowRenderer = rowRenderer;
    this.options = {
      keyField: options.keyField || 'id', // Field dùng để identify rows
      emptyMessage: options.emptyMessage || '<tr><td colspan="100%" class="text-center p-4">Không có dữ liệu.</td></tr>',
      ...options
    };
    
    this.currentData = [];
    this.rowElements = new Map(); // Map key -> tr element
  }

  /**
   * Render hoặc update table với data mới
   * @param {Array} newData - Array of data objects
   */
  render(newData) {
    if (!this.tbody) return;

    // So sánh data để chỉ update những gì thay đổi
    const dataMap = new Map();
    newData.forEach((item, index) => {
      const key = this.getKey(item, index);
      dataMap.set(key, { item, index });
    });

    // Remove rows không còn trong data mới
    this.rowElements.forEach((rowEl, key) => {
      if (!dataMap.has(key)) {
        rowEl.remove();
        this.rowElements.delete(key);
      }
    });

    // Update hoặc add rows
    dataMap.forEach(({ item, index }, key) => {
      const existingRow = this.rowElements.get(key);
      
      if (existingRow) {
        // Update existing row nếu cần
        const newHTML = this.rowRenderer(item, index);
        const temp = document.createElement('tr');
        temp.innerHTML = newHTML;
        
        // Chỉ update nếu HTML khác
        if (existingRow.outerHTML !== temp.outerHTML) {
          existingRow.innerHTML = temp.innerHTML;
        }
      } else {
        // Add new row
        const rowHTML = this.rowRenderer(item, index);
        const row = document.createElement('tr');
        row.innerHTML = rowHTML;
        row.dataset.rowKey = key;
        
        // Insert vào đúng vị trí
        this.insertRowAtPosition(row, index);
        this.rowElements.set(key, row);
      }
    });

    // Handle empty state
    if (newData.length === 0 && this.rowElements.size === 0) {
      domOptimizer.renderHTML(this.tbody, this.options.emptyMessage);
    }

    this.currentData = newData;
  }

  /**
   * Insert row vào đúng vị trí trong table
   */
  insertRowAtPosition(newRow, targetIndex) {
    const rows = Array.from(this.tbody.children);
    
    if (targetIndex >= rows.length) {
      this.tbody.appendChild(newRow);
    } else {
      // Tìm row element ở vị trí targetIndex
      let insertBefore = null;
      let currentIndex = 0;
      
      for (const row of rows) {
        if (currentIndex === targetIndex) {
          insertBefore = row;
          break;
        }
        currentIndex++;
      }
      
      if (insertBefore) {
        this.tbody.insertBefore(newRow, insertBefore);
      } else {
        this.tbody.appendChild(newRow);
      }
    }
  }

  /**
   * Get unique key cho row
   */
  getKey(item, index) {
    if (this.options.keyField && item[this.options.keyField]) {
      return String(item[this.options.keyField]);
    }
    return `row-${index}`;
  }

  /**
   * Clear table
   */
  clear() {
    if (this.tbody) {
      this.tbody.innerHTML = '';
    }
    this.rowElements.clear();
    this.currentData = [];
  }

  /**
   * Update single row
   */
  updateRow(key, newItem) {
    const row = this.rowElements.get(key);
    if (row) {
      const index = this.currentData.findIndex(item => this.getKey(item) === key);
      if (index !== -1) {
        const newHTML = this.rowRenderer(newItem, index);
        row.innerHTML = newHTML;
        this.currentData[index] = newItem;
      }
    }
  }

  /**
   * Remove single row
   */
  removeRow(key) {
    const row = this.rowElements.get(key);
    if (row) {
      row.remove();
      this.rowElements.delete(key);
      this.currentData = this.currentData.filter(item => this.getKey(item) !== key);
    }
  }
}

/**
 * Helper function để tạo table renderer
 */
export function createTableRenderer(tbody, rowRenderer, options) {
  return new TableRenderer(tbody, rowRenderer, options);
}

export { TableRenderer };

