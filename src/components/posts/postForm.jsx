import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useCategories } from '../../hooks/useCategories';
import { useForm } from '../../hooks/useForm';
import { api } from '../../lib/api';

const validatePost = (values) => {
  const errors = {};
  
  if (!values.title?.trim()) {
    errors.title = 'Title is required';
  } else if (values.title.length < 5) {
    errors.title = 'Title must be at least 5 characters';
  } else if (values.title.length > 120) {
    errors.title = 'Title must be less than 120 characters';
  }
  
  if (!values.content?.trim()) {
    errors.content = 'Content is required';
  } else if (values.content.length < 50) {
    errors.content = 'Content must be at least 50 characters';
  }
  
  if (!values.category) {
    errors.category = 'Category is required';
  }
  
  return errors;
};

const PostForm = ({ initialData = null, isEditing = false }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    isValid
  } = useForm(
    initialData || {
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: '',
      status: 'draft'
    },
    validatePost
  );

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
      
      // Store file in form data
      setFieldValue('featuredImage', file);
    }
  };

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValid()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstError}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Convert tags string to array
      const tagsArray = values.tags
        ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const postData = {
        title: values.title,
        content: values.content,
        excerpt: values.excerpt || values.content.substring(0, 150) + '...',
        category: values.category,
        tags: tagsArray,
        status: values.status
      };

      // Add featured image if selected
      if (selectedFile) {
        postData.featuredImage = selectedFile;
      }

      let response;
      if (isEditing && initialData?._id) {
        response = await api.updatePost(initialData._id, postData);
      } else {
        response = await api.createPost(postData);
      }

      if (response.success) {
        // Navigate to the new post
        navigate(`/post/${response.data.slug}`);
      } else {
        throw new Error(response.message || 'Failed to save post');
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setSubmitError(err.message || 'An error occurred while saving the post');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state for categories
  if (categoriesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading categories...</span>
      </div>
    );
  }

  // Show error if categories failed to load
  if (categoriesError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-800 dark:text-red-200 mb-4">
          Failed to load categories: {categoriesError}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{submitError}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 rounded-lg border ${
            touched.title && errors.title
              ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
          placeholder="Enter post title"
          disabled={submitting}
        />
        {touched.title && errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {values.title.length}/120 characters
        </p>
      </div>

      {/* Category - FIXED: Now shows real categories from backend */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={values.category}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 rounded-lg border ${
            touched.category && errors.category
              ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
          disabled={submitting || categoriesLoading}
        >
          <option value="">Select a category</option>
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name} {cat.postCount ? `(${cat.postCount} posts)` : ''}
              </option>
            ))
          ) : (
            <option value="" disabled>No categories available</option>
          )}
        </select>
        {touched.category && errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category}</p>
        )}
        {categories.length === 0 && (
          <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
            No categories found. Please contact an administrator.
          </p>
        )}
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Featured Image
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
          <input
            type="file"
            id="featuredImage"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={submitting}
          />
          <label
            htmlFor="featuredImage"
            className="cursor-pointer block"
          >
            {filePreview ? (
              <div className="space-y-2">
                <img
                  src={filePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg"
                />
                <p className="text-sm text-green-600 dark:text-green-400">
                  Click to change image
                </p>
              </div>
            ) : initialData?.featuredImage?.url ? (
              <div className="space-y-2">
                <img
                  src={initialData.featuredImage.url}
                  alt="Current"
                  className="max-h-48 mx-auto rounded-lg"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current image. Click to change.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  PNG, JPG, WEBP up to 2MB
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Excerpt (optional)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={values.excerpt}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="3"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          placeholder="Brief summary of your post (max 300 characters)"
          disabled={submitting}
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {values.excerpt.length}/300 characters
        </p>
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content *
        </label>
        <textarea
          id="content"
          name="content"
          value={values.content}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="12"
          className={`w-full px-4 py-2 rounded-lg border ${
            touched.content && errors.content
              ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent font-mono`}
          placeholder="Write your post content here..."
          disabled={submitting}
        />
        {touched.content && errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content}</p>
        )}
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {values.content.length} characters (minimum 50)
        </p>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={values.tags}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          placeholder="react, javascript, tutorial"
          disabled={submitting}
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Separate tags with commas
        </p>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <div className="flex gap-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={values.status === 'draft'}
              onChange={handleChange}
              className="mr-2"
              disabled={submitting}
            />
            <span className="text-gray-700 dark:text-gray-300">Draft</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="published"
              checked={values.status === 'published'}
              onChange={handleChange}
              className="mr-2"
              disabled={submitting}
            />
            <span className="text-gray-700 dark:text-gray-300">Publish</span>
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={submitting || categoriesLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          {submitting && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {isEditing ? 'Update Post' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={submitting}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PostForm;