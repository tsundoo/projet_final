import React, { useState } from 'react';
import { commentService } from '../../services/comment.service';
import { useAuth } from '../../context/AuthContext';

const CommentForm = ({ postId, onCommentAdded }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Please login to comment');
            return;
        }
        if (!content.trim()) {
            setError('Comment cannot be empty');
            return;
        }
        
        setIsSubmitting(true);
        setError('');
        
        try {
            const newComment = await commentService.createComment({
                content: content.trim(),
                post: postId,
            });
            console.log('New comment created:', newComment);
            setContent('');
            if (onCommentAdded) {
                onCommentAdded(newComment);
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.response?.data?.message || 'Error posting comment');
            console.error('Error details:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="comment-form">
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your comment..."
                    required
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
            </form>
        </div>
    );
};

export default CommentForm;