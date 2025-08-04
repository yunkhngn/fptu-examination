/**
 * Sanitizes string content to prevent XSS attacks
 * @param {string} str - String to sanitize
 * @return {string} Sanitized string
 */
function sanitizeString(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Creates DOM elements safely
 * @param {Object} options - Element creation options
 * @return {HTMLElement} Created element
 */
function createSafeElement(options) {
  const { tag, text, className, attributes = {} } = options;
  
  const element = document.createElement(tag);
  
  if (text) {
    element.textContent = text;
  }
  
  if (className) {
    if (Array.isArray(className)) {
      element.classList.add(...className);
    } else {
      element.className = className;
    }
  }
  
  Object.entries(attributes).forEach(([attr, value]) => {
    element.setAttribute(attr, value);
  });
  
  return element;
}

/**
 * Safely appends multiple children to a parent element
 * @param {HTMLElement} parent - Parent element
 * @param {Array<HTMLElement>} children - Child elements
 */
function appendChildren(parent, children) {
  if (!parent || !children) return;
  
  children.forEach(child => {
    if (child) {
      parent.appendChild(child);
    }
  });
}

/**
 * Creates a text node and appends it to the parent
 * @param {HTMLElement} parent - Parent element
 * @param {string} text - Text content
 */
function appendText(parent, text) {
  const textNode = document.createTextNode(text);
  parent.appendChild(textNode);
}

// Export utils for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sanitizeString,
    createSafeElement,
    appendChildren,
    appendText
  };
}
