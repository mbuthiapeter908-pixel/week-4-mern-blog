import { Link } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'

const Header = () => {
  const { isSignedIn, user } = useUser()
  const clerk = useClerk()

  const isAdmin =
    user?.publicMetadata?.role === 'admin' ||
    user?.emailAddresses?.[0]?.emailAddress?.includes('admin')

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          MERN Blog 
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link to="/" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Home</Link>
          <Link to="/categories" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Categories</Link>
          {isSignedIn && (
            <>
              <Link to="/posts/new" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">New Post</Link>
              <Link to="/dashboard" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Dashboard</Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" className="px-3 py-2 rounded bg-gray-50 text-white-700 dark:bg-gray-900/30">Admin panel</Link>
          )}

          <div className="ml-4">
            {isSignedIn ? (
              <button
                onClick={() => clerk.signOut()}
                className="px-3 py-2 rounded text-sm bg-gray-100 dark:bg-gray-800 hover:opacity-90"
              >
                Sign out
              </button>
            ) : (
              <Link to="/sign-in" className="px-3 py-2 rounded text-sm bg-blue-600 text-white">Sign in</Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header