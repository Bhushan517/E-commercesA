import React, { useState, useEffect } from 'react';
import { productAPI } from '../api/products';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Extract unique categories from products
    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
    setCategories(uniqueCategories);
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.searchProducts(searchTerm);
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    
    if (!category) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getProductsByCategory(category);
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          All Products
        </h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="w-full">
            <div className="flex">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field rounded-r-none flex-grow"
              />
              <button
                type="submit"
                className="btn-primary rounded-l-none px-4 sm:px-6"
              >
                <span className="hidden sm:inline">Search</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Category Filter */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="input-field flex-grow sm:flex-grow-0 sm:min-w-48"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              onClick={clearFilters}
              className="btn-secondary whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCategory) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('')}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={fetchProducts}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-gray-600">
                  Showing {products.length} product{products.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                No products found
                {(searchTerm || selectedCategory) && ' matching your criteria'}
              </p>
              {(searchTerm || selectedCategory) && (
                <button 
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
