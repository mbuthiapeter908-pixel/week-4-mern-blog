import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

const DashboardPage = () => {
  const { user } = useUser()
  const [userComments, setUserComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [activeTab, setActiveTab] = useState('posts')

  // Fetch user's comments
  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        setLoading(true)
        // Simulate API call to get user's comments
        await new Promise(resolve => setTimeout(resolve, 800))
        setUserComments([
          {
            _id: 'comment1',
            postId: '1',
            postTitle: 'Getting Started with React and Tailwind CSS',
            postSlug: 'getting-started-with-react-and-tailwind-css',
            content: 'Great article! Really helped me understand React better.',
            createdAt: '2024-01-16T10:30:00Z',
            status: 'approved',
            likes: 5
          },
          {
            _id: 'comment2',
            postId: '1',
            postTitle: 'Getting Started with React and Tailwind CSS',
            postSlug: 'getting-started-with-react-and-tailwind-css',
            content: 'I have a question about the setup. Do I need to install anything else?',
            createdAt: '2024-01-15T14:20:00Z',
            status: 'pending',
            likes: 0
          },
          {
            _id: 'comment3',
            postId: '2',
            postTitle: 'Building a MERN Stack Application from Scratch',
            postSlug: 'building-mern-stack-application',
            content: 'Thanks for this tutorial! Looking forward to more MERN content.',
            createdAt: '2024-01-14T09:15:00Z',
            status: 'approved',
            likes: 2
          },
          {
            _id: 'comment4',
            postId: '3',
            postTitle: '10 Tips for Better UI/UX Design',
            postSlug: 'tips-for-better-ui-ux-design',
            content: 'Tip #5 really opened my eyes. Great insights!',
            createdAt: '2024-01-12T16:45:00Z',
            status: 'approved',
            likes: 3
          }
        ])
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserComments()
    }
  }, [user])

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id)
    setEditContent(comment.content)
  }

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim() || editContent.length < 5) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUserComments(prev => prev.map(c => 
        c._id === commentId 
          ? { ...c, content: editContent, updatedAt: new Date().toISOString() }
          : c
      ))
      setEditingCommentId(null)
      setEditContent('')
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUserComments(prev => prev.filter(c => c._id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditContent('')
  }

  const getStatusBadge = (status) => {
    const badges = {
      approved: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      rejected: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
    }
    return badges[status] || badges.pending
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-blue-100">
          Manage your posts, comments, and profile settings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total Posts
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">12</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            +2 this week
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Published
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">8</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            66% of total
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Drafts
          </h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">4</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Ready to publish
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Comments
          </h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {userComments.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Across all posts
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'posts'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            My Posts
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'comments'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            My Comments
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Profile
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Recent Posts
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Sample Post Title {i}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Last edited: Jan {i}, 2024
                      </span>
                      <span className="text-sm text-green-600 dark:text-green-400">
                        ● Published
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/posts/${i}/edit`}
                      className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    >
                      Edit
                    </Link>
                    <button className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Comments
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : userComments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  You haven't commented on any posts yet.
                </p>
                <Link
                  to="/"
                  className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Browse Posts
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userComments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    {/* Comment Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            to={`/post/${comment.postSlug}`}
                            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {comment.postTitle}
                          </Link>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(comment.status)}`}>
                            {comment.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                          {comment.likes > 0 && (
                            <>
                              <span>•</span>
                              <span>{comment.likes} {comment.likes === 1 ? 'like' : 'likes'}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Comment Content */}
                    {editingCommentId === comment._id ? (
                      <div className="mt-3 space-y-3">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          rows="3"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateComment(comment._id)}
                            disabled={!editContent.trim() || editContent.length < 5}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {editContent.length} characters (minimum 5)
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        {comment.content}
                      </p>
                    )}

                    {/* Actions (only show if not editing) */}
                    {editingCommentId !== comment._id && (
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => handleEditComment(comment)}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-sm text-red-600 dark:text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                        {comment.status === 'pending' && (
                          <span className="text-sm text-yellow-600 dark:text-yellow-400">
                            Awaiting moderation
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Profile Information
            </h2>
            
            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <img
                  src={user?.imageUrl}
                  alt={user?.fullName}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {user?.fullName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Member since {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={user?.firstName || ''}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={user?.lastName || ''}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.primaryEmailAddress?.emailAddress || ''}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Stats Summary */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Activity Summary
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{userComments.length}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Comments</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">45</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Likes</div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => window.open('https://dashboard.clerk.com', '_blank')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Profile on Clerk
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage