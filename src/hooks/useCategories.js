import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Real API call to backend
      const response = await api.getCategories();
      
      // The response structure from your backend
      // Assuming it returns { success: true, data: [...] }
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to load categories');
      setCategories([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (categoryData) => {
    try {
      setLoading(true);
      const response = await api.createCategory(categoryData);
      
      if (response.success) {
        // Refresh categories after creation
        await fetchCategories();
        return { success: true, data: response.data };
      }
      return { success: false, error: 'Failed to create category' };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      setLoading(true);
      const response = await api.updateCategory(id, categoryData);
      
      if (response.success) {
        await fetchCategories();
        return { success: true, data: response.data };
      }
      return { success: false, error: 'Failed to update category' };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      const response = await api.deleteCategory(id);
      
      if (response.success) {
        await fetchCategories();
        return { success: true };
      }
      return { success: false, error: 'Failed to delete category' };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { 
    categories, 
    loading, 
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
};

export const useCategory = (slug) => {
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.getCategoryBySlug(slug);
        
        if (response.success) {
          setCategory(response.data.category || response.data);
          setPosts(response.data.posts || []);
        } else {
          throw new Error('Category not found');
        }
      } catch (err) {
        setError(err.message);
        setCategory(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return { category, posts, loading, error };
};