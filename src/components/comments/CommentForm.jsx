import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'

const CommentForm = ({ onSubmit, submitting, placeholder = "Write a comment..." }) => {
  const { isSignedIn } = useUser()
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError('Comment cannot be empty')
      return
    }

    if (content.length < 5) {
      setError('Comment must be at least 5 characters')
      return
    }

    const result = await onSubmit(content)
    
    if (result?.success) {
      setContent('')
      setError('')
    } else if (result?.error) {
      setError(result.error)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Please sign in to leave a comment.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            setError('')
          }}
          placeholder={placeholder}
          rows="4"
          className={`
            w-full px-4 py-3 rounded-lg border 
            ${error 
              ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
            }
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
            focus:ring-2 focus:border-transparent
            transition-colors
          `}
          disabled={submitting}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {content.length} characters (minimum 5)
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitting && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          Post Comment
        </button>
      </div>
    </form>
  )
}

export default CommentForm