import { useParams, Link } from 'react-router-dom'
import { useCategory } from '../hooks/useCategories'
import CategoryBadge from '../components/categories/CategoryBadge'
import PostCard from '../components/posts/postCard'
import PostSkeleton from '../components/posts/postSkeleton'

const SingleCategoryPage = () => {
  const { slug } = useParams()
  const { category, posts, loading, error } = useCategory(slug)

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 max-w-full mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Category Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The category you're looking for doesn't exist.
        </p>
        <Link
          to="/categories"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Browse Categories
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="text-center space-y-4">
        <CategoryBadge category={category} size="lg" linkable={false} />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
        <p className="text-gray-500 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No posts in this category yet.
          </p>
          <Link
            to="/posts/new"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Write the First Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SingleCategoryPage