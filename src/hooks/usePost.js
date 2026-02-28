import { useState, useEffect } from 'react'
import { api } from '../lib/api'

/**
 * Fetch multiple posts
 */
export const usePosts = (initialParams = {}) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [params, setParams] = useState(initialParams)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.getPosts(params)
      setPosts(response.data)
    } catch (err) {
      setError(err?.message || 'Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [JSON.stringify(params)])

  return {
    posts,
    loading,
    error,
    params,
    setParams,
    refetch: fetchPosts
  }
}

/**
 * Fetch single post by slug
 */
export const usePost = (slug) => {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 🔒 HARD GUARD — THIS IS THE FIX
    if (
      !slug ||
      typeof slug !== 'string' ||
      slug.trim() === '' ||
      slug === 'undefined'
    ) {
      return
    }

    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await api.getPostBySlug(slug)
        setPost(response.data)
      } catch (err) {
        setError(err?.message || 'Post not found')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  return { post, loading, error }
}