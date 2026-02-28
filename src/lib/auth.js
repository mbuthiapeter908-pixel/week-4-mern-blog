import { useAuth } from '@clerk/clerk-react';

// Custom hook to get auth token for API calls
export const useAuthToken = () => {
  const { getToken } = useAuth();
  
  const getAuthToken = async () => {
    try {
      const token = await getToken();
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };
  
  return { getAuthToken };
};

// Helper to check if user has required role
export const hasRole = (user, requiredRole) => {
  if (!user) return false;
  
  // You can customize this based on your role structure
  const userRole = user.publicMetadata?.role || 'reader';
  
  if (requiredRole === 'admin') {
    return userRole === 'admin';
  }
  
  if (requiredRole === 'author') {
    return userRole === 'author' || userRole === 'admin';
  }
  
  return true;
};

// Helper to check if user owns a resource
export const isOwner = (user, resourceUserId) => {
  if (!user || !resourceUserId) return false;
  return user.id === resourceUserId;
};

// Helper to check if user can modify a resource
export const canModify = (user, resourceUserId) => {
  if (!user) return false;
  return isOwner(user, resourceUserId) || hasRole(user, 'admin');
};