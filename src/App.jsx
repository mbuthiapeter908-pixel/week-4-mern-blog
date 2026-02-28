import { Routes, Route } from 'react-router-dom'
import { SignIn, SignUp } from '@clerk/clerk-react'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Container from './components/layout/Container'
import ProtectedRoute from './components/layout/ProtectedRoute'
import SingleCategoryPage from './pages/SingleCategoryPage'

// Pages
import HomePage from './pages/HomePage'
import SinglePostPage from './pages/SinglePostPage'
import CategoriesPage from './pages/CategoriesPage'
import CreatePostPage from './pages/CreatePostPage'
import EditPostPage from './pages/EditPostPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Header />
        <main className="flex-grow">
          <Container>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/post/:slug" element={<SinglePostPage />} />
              {/* CRITICAL FIX: Add this route for /posts/:slug */}
              <Route path="/posts/:slug" element={<SinglePostPage />} />
              
              {/* Keep your existing post route */}
              <Route path="/post/:slug" element={<SinglePostPage />} />
              
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:slug" element={<SingleCategoryPage />} />
              <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
              <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/posts/new" element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              } />
              <Route path="/posts/:id/edit" element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App