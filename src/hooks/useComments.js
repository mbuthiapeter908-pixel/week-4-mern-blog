import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import { useUser } from '@clerk/clerk-react'

export const useComments = (postId) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useUser()

  const fetchComments = useCallback(async () => {
    if (!postId) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await api.getComments(postId)
      setComments(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const addComment = async (content) => {
    if (!user) {
      return { success: false, error: 'You must be logged in to comment' }
    }

    try {
      setSubmitting(true)
      const response = await api.createComment({
        postId,
        authorId: user.id,
        content
      })
      
      setComments(prev => [response.data, ...prev])
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setSubmitting(false)
    }
  }

  const updateComment = async (commentId, content) => {
    const comment = comments.find(c => c._id === commentId)
    if (!comment) {
      return { success: false, error: 'Comment not found' }
    }

    // Check if user is author
    if (user.id !== comment.authorId) {
      return { success: false, error: 'You can only edit your own comments' }
    }

    try {
      setSubmitting(true)
      const response = await api.updateComment(commentId, content)
      
      setComments(prev => prev.map(c => 
        c._id === commentId ? response.data : c
      ))
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setSubmitting(false)
    }
  }

  const deleteComment = async (commentId) => {
    const comment = comments.find(c => c._id === commentId)
    if (!comment) {
      return { success: false, error: 'Comment not found' }
    }

    // Check if user is author or admin
    const isAuthor = user.id === comment.authorId
    const isAdmin = user?.publicMetadata?.role === 'admin'
    
    if (!isAuthor && !isAdmin) {
      return { success: false, error: 'You can only delete your own comments' }
    }

    try {
      setSubmitting(true)
      await api.deleteComment(commentId)
      
      setComments(prev => prev.filter(c => c._id !== commentId))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setSubmitting(false)
    }
  }

  return {
    comments,
    loading,
    error,
    submitting,
    addComment,
    updateComment,
    deleteComment,
    refetch: fetchComments
  }
}