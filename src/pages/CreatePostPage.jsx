import PostForm from '../components/posts/postForm'

const CreatePostPage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Share your knowledge with the community
        </p>
      </div>

      <PostForm />
    </div>
  )
}

export default CreatePostPage