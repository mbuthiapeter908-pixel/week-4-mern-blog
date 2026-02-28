import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useUser } from '@clerk/clerk-react'

const CommentItem = ({ comment, onEdit, onDelete }) => {
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [submitting, setSubmitting] = useState(false)

  const isAuthor = user?.id === comment.authorId
  const isAdmin = user?.publicMetadata?.role === 'admin'
  const canModify = isAuthor || isAdmin

  const handleEdit = async () => {
    if (!editContent.trim() || editContent.length < 5) return
    
    setSubmitting(true)
    const result = await onEdit(comment._id, editContent)
    setSubmitting(false)
    
    if (result?.success) {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditContent(comment.content)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={comment.author.image}
            alt={comment.author.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <span className="font-medium text-gray-900 dark:text-white">
              {comment.author.name}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Actions Menu */}
        {canModify && !isEditing && (
          <div className="flex items-center gap-2">
            {isAuthor && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Edit comment"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            <button
              onClick={() => onDelete(comment._id)}
              className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Delete comment"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Comment Content */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            rows="3"
            disabled={submitting}
          />
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              disabled={submitting || !editContent.trim() || editContent.length < 5}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">
          {comment.content}
        </p>
      )}

      {/* Edited Indicator */}
      {comment.updatedAt !== comment.createdAt && !isEditing && (
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          (edited)
        </p>
      )}
    </div>
  )
}

export default CommentItem