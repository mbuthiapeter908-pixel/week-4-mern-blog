import { usePosts } from '../hooks/usePost'
import PostCard from '../components/posts/postCard'
import PostSkeleton from '../components/posts/postSkeleton'
import PostFilters from '../components/posts/PostFilters'

const HomePage = () => {
  const { posts, loading, error, params, setParams } = usePosts({
    status: 'published'
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome to MERN Blog.
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover amazing stories, tutorials, and insights from our community of Educated writers.
        </p>
      </div>

      {/* Filters */}
      <PostFilters params={params} onParamsChange={setParams} />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <button
            onClick={() => setParams({ ...params })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No posts found. Check back later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HomePage