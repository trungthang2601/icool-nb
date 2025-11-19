/**
 * DOM Helper Functions - Các hàm tiện ích cho DOM manipulation
 */

import { domOptimizer } from './dom-optimizer.js';

/**
 * Safe HTML escape
 */
export function escapeHtml(text) {
  if (text == null) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Escape regex special characters
 */
export function escapeRegex(text) {
  if (text == null) return '';
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Render HTML vào element với batch update
 */
export function renderHTML(container, html, append = false) {
  domOptimizer.renderHTML(container, html, append);
}

/**
 * Update text content hiệu quả
 */
export function updateText(element, text) {
  domOptimizer.updateText(element, text);
}

/**
 * Clear element content
 */
export function clearElement(element) {
  domOptimizer.clear(element);
}

/**
 * Toggle classes
 */
export function toggleClasses(element, classes) {
  domOptimizer.toggleClasses(element, classes);
}

/**
 * Create element từ HTML string
 */
export function createElementFromHTML(htmlString) {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

/**
 * Create DocumentFragment từ HTML string
 */
export function createFragmentFromHTML(htmlString) {
  const fragment = document.createDocumentFragment();
  const temp = document.createElement('div');
  temp.innerHTML = htmlString;
  
  while (temp.firstChild) {
    fragment.appendChild(temp.firstChild);
  }
  
  return fragment;
}

/**
 * Batch multiple DOM operations
 */
export function batchDOMUpdates(updateFn) {
  domOptimizer.batchUpdate(updateFn);
}

