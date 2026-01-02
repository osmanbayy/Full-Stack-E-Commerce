/**
 * Utility function to get product name based on current language
 * @param {Object} product - Product object
 * @param {string} currentLanguage - Current language code (e.g., 'en', 'tr')
 * @returns {string} - Translated product name
 */
export const getProductName = (product, currentLanguage = 'en') => {
  if (!product) return '';
  
  // If product has nameEn or nameTr, use them
  if (currentLanguage === 'tr' && product.nameTr) {
    return product.nameTr;
  }
  if (currentLanguage === 'en' && product.nameEn) {
    return product.nameEn;
  }
  
  // Fallback to name field or nameEn/nameTr
  return product.name || product.nameEn || product.nameTr || '';
};

/**
 * Utility function to search products in multiple languages
 * @param {Array} products - Array of products
 * @param {string} searchTerm - Search term
 * @returns {Array} - Filtered products
 */
export const searchProducts = (products, searchTerm) => {
  if (!searchTerm || !products) return products;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return products.filter((product) => {
    const nameEn = (product.nameEn || product.name || '').toLowerCase();
    const nameTr = (product.nameTr || product.name || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    
    return (
      nameEn.includes(lowerSearchTerm) ||
      nameTr.includes(lowerSearchTerm) ||
      name.includes(lowerSearchTerm)
    );
  });
};




