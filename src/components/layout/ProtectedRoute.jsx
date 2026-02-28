import { Navigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  return children
}

export default ProtectedRoute