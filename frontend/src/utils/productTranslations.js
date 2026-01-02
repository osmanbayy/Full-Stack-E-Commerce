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
 * Utility function to get product description based on current language
 * @param {Object} product - Product object
 * @param {string} currentLanguage - Current language code (e.g., 'en', 'tr')
 * @returns {string} - Translated product description
 */
export const getProductDescription = (product, currentLanguage = 'en') => {
  if (!product) return '';
  
  // If product has descriptionEn or descriptionTr, use them
  if (currentLanguage === 'tr' && product.descriptionTr) {
    return product.descriptionTr;
  }
  if (currentLanguage === 'en' && product.descriptionEn) {
    return product.descriptionEn;
  }
  
  // Fallback to description field or descriptionEn/descriptionTr
  return product.description || product.descriptionEn || product.descriptionTr || '';
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
    const descriptionEn = (product.descriptionEn || product.description || '').toLowerCase();
    const descriptionTr = (product.descriptionTr || product.description || '').toLowerCase();
    const description = (product.description || '').toLowerCase();
    
    return (
      nameEn.includes(lowerSearchTerm) ||
      nameTr.includes(lowerSearchTerm) ||
      name.includes(lowerSearchTerm) ||
      descriptionEn.includes(lowerSearchTerm) ||
      descriptionTr.includes(lowerSearchTerm) ||
      description.includes(lowerSearchTerm)
    );
  });
};




