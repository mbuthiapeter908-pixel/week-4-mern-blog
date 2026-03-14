const API_URL = import.meta.env.VITE_API_URL || 'https://mern-blog-backendhwbt.onrender.com/api';
// Helper to get auth token from Clerk
const getAuthToken = async () => {
  try {
    // Check if Clerk is available and user is signed in
    if (window.Clerk && window.Clerk.session) {
      const token = await window.Clerk.session.getToken();
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper for handling responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Throw error with message from server
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

// Helper for making authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};

// Helper for file uploads with auth
const uploadWithAuth = async (url, formData) => {
  const token = await getAuthToken();
  
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include'
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`Upload Error (${url}):`, error);
    throw error;
  }
};

export const api = {
  // ==================== POSTS ====================
  
  /**
   * Get all posts with optional filters
   * @param {Object} params - Query parameters (page, limit, category, author, tag, status, search, sort)
   */
  getPosts: async (params = {}) => {
    // Remove empty params
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '' && v !== undefined && v !== null)
    );
    
    const queryParams = new URLSearchParams(cleanParams).toString();
    const url = `${API_URL}/posts${queryParams ? `?${queryParams}` : ''}`;
    
    return fetchWithAuth(url);
  },
  
  /**
   * Get single post by slug
   * @param {string} id - Post ID
   */
  getPostById: async (id) => {
    const url = `${API_URL}/posts/id/${id}`;
    return fetchWithAuth(url);
  },

  getPostBySlug: async (slug) => {
    const url = `${API_URL}/posts/slug/${slug}`;
    return fetchWithAuth(url);
  },
  
  /**
   * Create new post
   * @param {Object} postData - Post data
   * @param {File} [postData.featuredImage] - Optional image file
   */
  createPost: async (postData) => {
    const url = `${API_URL}/posts`;
    
    // Check if we have a file to upload
    const hasFile = postData.featuredImage && postData.featuredImage instanceof File;
    
    if (hasFile) {
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.keys(postData).forEach(key => {
        if (key === 'tags' && Array.isArray(postData[key])) {
          // Handle tags array
          postData[key].forEach(tag => {
            formData.append('tags[]', tag);
          });
        } else if (key === 'featuredImage' && postData[key] instanceof File) {
          formData.append('featuredImage', postData[key]);
        } else if (postData[key] !== null && postData[key] !== undefined) {
          formData.append(key, postData[key]);
        }
      });
      
      return uploadWithAuth(url, formData);
    } else {
      // No file, send as JSON
      return fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(postData)
      });
    }
  },
  
  /**
   * Update existing post
   * @param {string} id - Post ID
   * @param {Object} postData - Updated post data
   */
  updatePost: async (id, postData) => {
    const url = `${API_URL}/posts/${id}`;
    
    // Check if we have a file to upload
    const hasFile = postData.featuredImage && postData.featuredImage instanceof File;
    
    if (hasFile) {
      const formData = new FormData();
      
      Object.keys(postData).forEach(key => {
        if (key === 'tags' && Array.isArray(postData[key])) {
          postData[key].forEach(tag => {
            formData.append('tags[]', tag);
          });
        } else if (key === 'featuredImage' && postData[key] instanceof File) {
          formData.append('featuredImage', postData[key]);
        } else if (postData[key] !== null && postData[key] !== undefined) {
          formData.append(key, postData[key]);
        }
      });
      
      return uploadWithAuth(url, formData);
    } else {
      return fetchWithAuth(url, {
        method: 'PUT',
        body: JSON.stringify(postData)
      });
    }
  },
  
  /**
   * Delete post
   * @param {string} id - Post ID
   */
  deletePost: async (id) => {
    const url = `${API_URL}/posts/${id}`;
    return fetchWithAuth(url, {
      method: 'DELETE'
    });
  },
  
  /**
   * Get user's posts
   * @param {string} userId - User ID
   * @param {Object} params - Pagination params
   */
  getUserPosts: async (userId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_URL}/posts/user/${userId}${queryParams ? `?${queryParams}` : ''}`;
    
    return fetchWithAuth(url);
  },

  // ==================== CATEGORIES ====================
  
  /**
   * Get all categories
   */
  getCategories: async () => {
    const url = `${API_URL}/categories`;
    return fetchWithAuth(url);
  },

  /**
   * Get single category by slug
   * @param {string} slug - Category slug
   */
  getCategoryBySlug: async (slug) => {
    const url = `${API_URL}/categories/${slug}`;
    return fetchWithAuth(url);
  },

  /**
   * Create new category (admin only)
   * @param {Object} categoryData - Category data
   */
  createCategory: async (categoryData) => {
    const url = `${API_URL}/categories`;
    return fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  },

  /**
   * Update category (admin only)
   * @param {string} id - Category ID
   * @param {Object} categoryData - Updated category data
   */
  updateCategory: async (id, categoryData) => {
    const url = `${API_URL}/categories/${id}`;
    return fetchWithAuth(url, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  },

  /**
   * Delete category (admin only)
   * @param {string} id - Category ID
   */
  deleteCategory: async (id) => {
    const url = `${API_URL}/categories/${id}`;
    return fetchWithAuth(url, {
      method: 'DELETE'
    });
  },

  // ==================== COMMENTS ====================
  
  /**
   * Get comments for a post
   * @param {string} postId - Post ID
   * @param {Object} params - Pagination params
   */
  getComments: async (postId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_URL}/comments/post/${postId}${queryParams ? `?${queryParams}` : ''}`;
    
    return fetchWithAuth(url);
  },

  /**
   * Get all comments (admin only)
   * @param {Object} filters - Filter options
   */
  getAllComments: async (filters = {}) => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '' && v !== undefined && v !== null)
    );
    
    const queryParams = new URLSearchParams(cleanFilters).toString();
    const url = `${API_URL}/comments/admin/all${queryParams ? `?${queryParams}` : ''}`;
    
    return fetchWithAuth(url);
  },

  /**
   * Create new comment
   * @param {Object} commentData - Comment data
   */
  createComment: async (commentData) => {
    const url = `${API_URL}/comments`;
    return fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  },

  /**
   * Update comment
   * @param {string} id - Comment ID
   * @param {string} content - Updated content
   */
  updateComment: async (id, content) => {
    const url = `${API_URL}/comments/${id}`;
    return fetchWithAuth(url, {
      method: 'PUT',
      body: JSON.stringify({ content })
    });
  },

  /**
   * Delete comment
   * @param {string} id - Comment ID
   */
  deleteComment: async (id) => {
    const url = `${API_URL}/comments/${id}`;
    return fetchWithAuth(url, {
      method: 'DELETE'
    });
  },

  /**
   * Moderate comment (admin only)
   * @param {string} id - Comment ID
   * @param {string} status - New status (approved/rejected/spam)
   */
  moderateComment: async (id, status) => {
    const url = `${API_URL}/comments/${id}/moderate`;
    return fetchWithAuth(url, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  /**
   * Like/unlike comment
   * @param {string} id - Comment ID
   */
  toggleCommentLike: async (id) => {
    const url = `${API_URL}/comments/${id}/like`;
    return fetchWithAuth(url, {
      method: 'POST'
    });
  },

  /**
   * Report comment
   * @param {string} id - Comment ID
   * @param {string} reason - Report reason
   */
  reportComment: async (id, reason) => {
    const url = `${API_URL}/comments/${id}/report`;
    return fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  },

  /**
   * Get user's comments
   * @param {string} userId - User ID
   */
  getUserComments: async (userId) => {
    const url = `${API_URL}/comments/user/${userId}`;
    return fetchWithAuth(url);
  },
  

  // ==================== UPLOADS ====================
  
  /**
   * Upload single file
   * @param {File} file - File to upload
   */
  uploadFile: async (file) => {
    const url = `${API_URL}/uploads/single`;
    const formData = new FormData();
    formData.append('file', file);
    
    return uploadWithAuth(url, formData);
  },

  /**
   * Upload multiple files
   * @param {File[]} files - Array of files to upload
   */
  uploadMultipleFiles: async (files) => {
    const url = `${API_URL}/uploads/multiple`;
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return uploadWithAuth(url, formData);
  },

  /**
   * Delete uploaded file
   * @param {string} filename - Name of file to delete
   */
  deleteFile: async (filename) => {
    const url = `${API_URL}/uploads/${filename}`;
    return fetchWithAuth(url, {
      method: 'DELETE'
    });
  },

  // ==================== UTILITIES ====================
  
  /**
   * Check API health
   */
  checkHealth: async () => {
    const url = `${API_URL}/health`;
    return fetchWithAuth(url);
  },

  /**
   * Test authentication
   */
  testAuth: async () => {
    const url = `${API_URL}/auth/test`;
    return fetchWithAuth(url);
  }
};

// Export a default instance
export default api;