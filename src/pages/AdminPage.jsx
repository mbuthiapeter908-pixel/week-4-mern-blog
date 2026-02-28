import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { api } from '../lib/api';
import CategoryManager from '../components/categories/CategoryManager';
import { format } from 'date-fns';

const AdminPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalComments: 0,
    pendingComments: 0,
    totalCategories: 0,
    publishedPosts: 0,
    draftPosts: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin' || 
                  user?.emailAddresses[0]?.emailAddress?.includes('admin');

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all posts
      const postsResponse = await api.getPosts({ status: 'all', limit: 100 });
      const posts = postsResponse.data || [];
      
      // Fetch all comments
      const commentsResponse = await api.getAllComments({ limit: 100 });
      const comments = commentsResponse.data || [];
      
      // Fetch categories
      const categoriesResponse = await api.getCategories();
      const categories = categoriesResponse.data || [];
      
      // Calculate stats
      setStats({
        totalPosts: posts.length,
        publishedPosts: posts.filter(p => p.status === 'published').length,
        draftPosts: posts.filter(p => p.status === 'draft').length,
        totalComments: comments.length,
        pendingComments: comments.filter(c => c.status === 'pending').length,
        totalCategories: categories.length,
        totalUsers: 156 // This would come from a users endpoint
      });

      // Create recent activity feed
      const activity = [
        ...posts.slice(0, 5).map(p => ({
          id: p._id,
          type: 'post',
          action: 'created',
          title: p.title,
          user: p.author?.name || 'Unknown',
          time: p.createdAt,
          status: p.status
        })),
        ...comments.slice(0, 5).map(c => ({
          id: c._id,
          type: 'comment',
          action: 'posted',
          title: c.content.substring(0, 50) + '...',
          user: c.author?.name || 'Unknown',
          time: c.createdAt,
          status: c.status
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
      
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to access the admin panel.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'posts', name: 'Posts', icon: '📝' },
    { id: 'categories', name: 'Categories', icon: '📁' },
    { id: 'comments', name: 'Comments', icon: '💬' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Panel
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back, {user?.firstName || 'Admin'}! Manage your blog content and settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                ${activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'dashboard' && (
          <DashboardTab 
            stats={stats} 
            loading={loading} 
            recentActivity={recentActivity}
            onRefresh={fetchDashboardData}
          />
        )}

        {activeTab === 'posts' && (
          <PostsManagementTab />
        )}

        {activeTab === 'categories' && (
          <CategoryManager />
        )}

        {activeTab === 'comments' && (
          <CommentsManagementTab />
        )}

        {activeTab === 'users' && (
          <UserManagementTab />
        )}

        {activeTab === 'settings' && (
          <SettingsTab />
        )}
      </div>
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ stats, loading, recentActivity, onRefresh }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Posts" 
          value={stats.totalPosts} 
          icon="📝"
          color="blue"
          subtitle={`${stats.publishedPosts} published, ${stats.draftPosts} drafts`}
        />
        <StatCard 
          title="Comments" 
          value={stats.totalComments} 
          icon="💬"
          color="green"
          subtitle={`${stats.pendingComments} pending moderation`}
        />
        <StatCard 
          title="Categories" 
          value={stats.totalCategories} 
          icon="📁"
          color="purple"
        />
        <StatCard 
          title="Users" 
          value={stats.totalUsers} 
          icon="👥"
          color="orange"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <button
            onClick={onRefresh}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            🔄
          </button>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {activity.type === 'post' ? '📝' : '💬'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.user}</span>{' '}
                      {activity.action}{' '}
                      <span className="font-medium">{activity.title}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(activity.time), 'PPp')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activity.status === 'published' || activity.status === 'approved'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, subtitle }) => {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`px-2 py-1 text-xs rounded-full ${colors[color]}`}>
          {subtitle ? 'Active' : 'Total'}
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};

// Posts Management Tab
const PostsManagementTab = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.getPosts({ status: 'all', limit: 50 });
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await api.deletePost(postId);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(p => p.status === filter);

  if (loading) return <div className="text-center py-12">Loading posts...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Manage Posts
        </h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          >
            <option value="all">All Posts</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPosts.map((post) => (
              <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{post.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{post.excerpt?.substring(0, 50)}...</div>
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white">{post.author?.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    post.status === 'published'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {format(new Date(post.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.location.href = `/posts/${post._id}/edit`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Comments Management Tab
const CommentsManagementTab = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.getAllComments({ limit: 50 });
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (commentId, status) => {
    try {
      await api.moderateComment(commentId, status);
      setComments(comments.map(c => 
        c._id === commentId ? { ...c, status } : c
      ));
    } catch (error) {
      console.error('Error moderating comment:', error);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const filteredComments = filter === 'all' 
    ? comments 
    : comments.filter(c => c.status === filter);

  if (loading) return <div className="text-center py-12">Loading comments...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Moderate Comments
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
        >
          <option value="all">All Comments</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="spam">Spam</option>
        </select>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredComments.map((comment) => (
          <div key={comment._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {comment.author?.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    on post #{comment.postId}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    comment.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-800' :
                    comment.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800' :
                    comment.status === 'spam' ? 'bg-gray-100 dark:bg-gray-800 text-gray-800' :
                    'bg-red-100 dark:bg-red-900/30 text-red-800'
                  }`}>
                    {comment.status}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(comment.createdAt), 'PPp')}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                {comment.status !== 'approved' && (
                  <button
                    onClick={() => handleModerate(comment._id, 'approved')}
                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
                {comment.status !== 'rejected' && (
                  <button
                    onClick={() => handleModerate(comment._id, 'rejected')}
                    className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// User Management Tab
const UserManagementTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would come from a users endpoint
    setUsers([
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', posts: 12, joined: '2024-01-15' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'author', posts: 8, joined: '2024-02-01' },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'reader', posts: 0, joined: '2024-02-10' },
    ]);
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center py-12">Loading users...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          User Management
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Posts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  >
                    <option value="reader">Reader</option>
                    <option value="author">Author</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white">{user.posts}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{user.joined}</td>
                <td className="px-6 py-4">
                  <button className="text-red-600 dark:text-red-400 hover:text-red-800">
                    Suspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Settings Tab
const SettingsTab = () => {
  const [settings, setSettings] = useState({
    siteTitle: 'MERN Blog',
    postsPerPage: 10,
    allowComments: true,
    commentModeration: 'manual',
    allowRegistration: true
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Save settings logic here
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Blog Settings
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Site Title
          </label>
          <input
            type="text"
            value={settings.siteTitle}
            onChange={(e) => setSettings({...settings, siteTitle: e.target.value})}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Posts Per Page
          </label>
          <input
            type="number"
            value={settings.postsPerPage}
            onChange={(e) => setSettings({...settings, postsPerPage: parseInt(e.target.value)})}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.allowComments}
            onChange={(e) => setSettings({...settings, allowComments: e.target.checked})}
            className="mr-2"
          />
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Allow comments on posts
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Comment Moderation
          </label>
          <select
            value={settings.commentModeration}
            onChange={(e) => setSettings({...settings, commentModeration: e.target.value})}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          >
            <option value="none">No Moderation</option>
            <option value="manual">Manual Moderation</option>
            <option value="automatic">Automatic</option>
          </select>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default AdminPage;