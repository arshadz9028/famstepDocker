/**
 * Utility functions for text processing
 */

/**
 * Detects URLs in text and makes them clickable
 * @param {string} text - The text to process
 * @returns {string|Array} - The processed text with clickable links
 */
export const makeLinksClickable = (text) => {
  if (!text) return text;
  
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split the text by URLs and map each part
  const parts = text.split(urlRegex);
  
  // If no URLs found, return the original text
  if (parts.length === 1) return text;
  
  // Map through parts and convert URLs to clickable links
  return parts.map((part, index) => {
    // Check if this part is a URL
    if (part.match(urlRegex)) {
      return (
        <a 
          key={`link-${index}`} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#1890ff', textDecoration: 'underline' }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}; 