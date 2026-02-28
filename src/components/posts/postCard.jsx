import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

const PostCard = ({ post }) => {
  // Guard: post not loaded yet
  if (!post) return null

  // Prefer slug, fallback to _id or id
  const postIdentifier = post.slug || post._id || post.id

  // If still missing, DO NOT render link
  if (!postIdentifier) {
    console.error('Post identifier missing:', post)
    return null
  }

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">

{/* Featured Image */}
<Link to={`/post/${post.slug || post._slug}`}>
  <div className="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
    {post.featuredImage?.url ? (
      <img
        src={post.featuredImage.url.startsWith('http') 
          ? post.featuredImage.url 
          : `http://localhost:5000${post.featuredImage.url}`}
        alt={post.title}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
        }}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
        No image
      </div>
    )}
  </div>
</Link>
      {/* Content */}
      <div className="p-6">

        {/* Category */}
        {post.category && (
          <Link
            to={`/?category=${post.category.slug}`}
            className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4"
          >
            {post.category.name}
          </Link>
        )}

        {/* Title */}
        <Link to={`/posts/${postIdentifier}`}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {post.excerpt || post.content?.substring(0, 150)}...
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {post.author?.image && (
              <img
                src={post.author.image}
                alt={post.author.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {post.author?.name}
            </span>
          </div>

          {post.createdAt && (
            <time className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </time>
          )}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            {post.tags.slice(0, 3).map(tag => (
              <Link
                key={tag}
                to={`/?search=${tag}`}
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default PostCard