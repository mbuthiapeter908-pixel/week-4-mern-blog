import { useState, useEffect } from 'react'
import { useCategories } from '../../hooks/useCategories'

const CategoryManager = () => {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories()
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue'
  })
  const [error, setError] = useState(null)

  const colors = ['blue', 'green', 'purple', 'pink', 'yellow', 'orange', 'red', 'indigo']

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError('Category name is required')
      return
    }

    let result
    if (editingId) {
      result = await updateCategory(editingId, formData)
    } else {
      result = await createCategory(formData)
    }

    if (result.success) {
      setFormData({ name: '', description: '', color: 'blue' })
      setEditingId(null)
    } else {
      setError(result.error)
    }
  }

  const handleEdit = (category) => {
    setEditingId(category._id)
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || 'blue'
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const result = await deleteCategory(id)
      if (!result.success) {
        setError(result.error)
      }
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: '', description: '', color: 'blue' })
    setError(null)
  }

  // Show loading state
  if (loading && categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Development info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          🏷️ You can now create, edit, and delete categories. Categories with posts cannot be deleted.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {editingId ? 'Edit Category' : 'Add New Category'}
        </h3>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Technology"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="2"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of this category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Theme
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`
                    w-8 h-8 rounded-full transition-all
                    bg-${color}-500
                    ${formData.color === color ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-blue-500 scale-110' : 'opacity-70 hover:opacity-100'}
                  `}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingId ? 'Update Category' : 'Add Category'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Categories List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Existing Categories
          </h3>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map(category => (
              <div key={category._id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full bg-${category.color || 'blue'}-500`} />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </h4>
                    {category.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {category.postCount || 0} posts
                  </span>
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={category.postCount > 0}
                    title={category.postCount > 0 ? "Cannot delete category with posts" : ""}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No categories yet. Add your first category above.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryManager