import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import CommentsSection from '../components/comments/CommentsSection';

const SinglePostPage = () => {
  // ✅ Fixed
  const params = useParams();
  const identifier = params.slug || params.id || Object.values(params)[0];

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fix
  console.log('📄 Page loaded with:', { identifier });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('🔍 Fetching post with identifier:', identifier);
        
        if (!identifier || identifier === 'undefined') {
          throw new Error('Invalid post identifier');
        }

        setLoading(true);
        
        let response;
        
        // Check if the identifier looks like a MongoDB ID (24 characters hex)
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(identifier);
        
        if (isMongoId) {
          // It's an ID, use getPostById
          console.log('📚 Using ID method (identifier looks like MongoDB ID)');
          response = await api.getPostById(identifier);
        } else {
          // It's a slug, use getPostBySlug
          console.log('📚 Using slug method');
          response = await api.getPostBySlug(identifier);
        }
        
        console.log('📥 API Response:', response);
        
        if (response?.success && response?.data) {
          console.log('✅ Post data received:', response.data);
          setPost(response.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('❌ Error fetching post:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Fix
    if (identifier) {
      fetchPost();
    }
  // ✅ Fix
  }, [identifier]);

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
          <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
            Loading post...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error Loading Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {/* ✅ Fix */}
            Attempted to load: {identifier}
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show no post state
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The post you're looking for doesn't exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">

        <button
          onClick={() => window.history.back()}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {post.category && (
          <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            {typeof post.category === 'object' ? post.category.name : post.category}
          </span>
        )}

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title || 'Untitled'}
        </h1>

        <div className="flex items-center gap-4 mb-8">
          {post.author?.image && (
            <img
              src={post.author.image}
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {post.author?.name || 'Unknown Author'}
            </p>
            <time className="text-sm text-gray-500 dark:text-gray-400">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
            </time>
          </div>
        </div>

        {post.featuredImage?.url && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.featuredImage.url}
              alt={post.title}
              className="w-full h-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
              }}
            />
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none">
          {post.content ? (
            post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No content</p>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <section className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Discussion
          </h2>
          
          <CommentsSection postId={post._id} />
        </section>

      </article>
    </div>
  );
};

export default SinglePostPage;