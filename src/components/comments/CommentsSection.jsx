import { useState } from 'react'
import { useComments } from '../../hooks/useComments'
import CommentForm from './CommentForm'
import CommentList from './CommentList'
import CommentStats from './CommentStats'

const CommentsSection = ({ postId }) => {
  const {
    comments,
    loading,
    error,
    submitting,
    addComment,
    updateComment,
    deleteComment,
    refetch
  } = useComments(postId)

  const [showForm, setShowForm] = useState(false)

  const handleAddComment = async (content) => {
    const result = await addComment(content)
    if (result.success) {
      setShowForm(false)
    }
    return result
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(commentId)
    }
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <p className="text-red-800 dark:text-red-200 text-center">
          Failed to load comments: {error}
        </p>
        <button
          onClick={refetch}
          className="mt-4 mx-auto block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <CommentStats count={comments.length} />
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Write a Comment
          </button>
        )}
      </div>

      {/* Comment Form */}
      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Write your comment
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Cancel
            </button>
          </div>
          <CommentForm
            onSubmit={handleAddComment}
            submitting={submitting}
          />
        </div>
      )}

      {/* Comments List */}
      <CommentList
        comments={comments}
        loading={loading}
        onEdit={updateComment}
        onDelete={handleDeleteComment}
      />
    </div>
  )
}

export default CommentsSection