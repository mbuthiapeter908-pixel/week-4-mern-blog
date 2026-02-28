import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCategories } from '../hooks/useCategories'
import { usePosts } from '../hooks/usePost'
import CategoryCard from '../components/categories/CategoryCard'
import CategorySkeleton from '../components/categories/CategorySkeleton'
import PostCard from '../components/posts/postCard'

const CategoriesPage = () => {
  const navigate = useNavigate()
  const { categories, loading } = useCategories()
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  const { posts, loading: postsLoading } = usePosts({
    category: selectedCategory?.slug,
    status: 'published'
  })

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    // Smooth scroll to posts section
    document.getElementById('category-posts')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Categories
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Browse posts by topic and find exactly what you're looking for
        </p>
      </div>

      {/* Categories Grid */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          All Categories
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                onClick={handleCategoryClick}
                isSelected={selectedCategory?._id === category._id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Category Posts */}
      {selectedCategory && (
        <section id="category-posts" className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Posts in {selectedCategory.name}
            </h2>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear filter
            </button>
          </div>

          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 animate-pulse">
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {posts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">
                    No posts in this category yet.
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
        </section>
      )}

      {/* Category Stats */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold">{categories.length}</div>
            <div className="text-sm opacity-90">Categories</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {categories.reduce((acc, cat) => acc + (cat.postCount || 0), 0)}
            </div>
            <div className="text-sm opacity-90">Total Posts</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {Math.max(...categories.map(c => c.postCount || 0))}
            </div>
            <div className="text-sm opacity-90">Most Posts</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {categories.filter(c => c.postCount > 0).length}
            </div>
            <div className="text-sm opacity-90">Active Categories</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CategoriesPage