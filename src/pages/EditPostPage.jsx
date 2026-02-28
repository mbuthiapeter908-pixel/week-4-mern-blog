import { useParams, Navigate } from 'react-router-dom'
import { usePost } from '../hooks/usePost'
import { useUser } from '@clerk/clerk-react'
import PostForm from '../components/posts/postForm'
import PostSkeleton from '../components/posts/postSkeleton'

const EditPostPage = () => {
  const { id } = useParams()
  const { post, loading, error } = usePost(id) // We'll need to modify usePost to accept id
  const { isSignedIn, user } = useUser()

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <PostSkeleton />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Post Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          The post you're trying to edit doesn't exist.
        </p>
      </div>
    )
  }

  // Check if user is author
  if (isSignedIn && user.id !== post.authorId) {
    return <Navigate to={`/post/${post.slug}`} replace />
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Make changes to your post
        </p>
      </div>

      <PostForm initialData={post} isEditing />
    </div>
  )
}

export default EditPostPage