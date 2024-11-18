import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { commentService } from '../../services/comment.service';

const CommentList = ({ comments, onCommentDeleted }) => {
    const { user } = useAuth();

    const handleDelete = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await commentService.deleteComment(commentId);
                onCommentDeleted();
            } catch (err) {
                console.error('Error deleting comment:', err);
            }
        }
    };

    return (
        <div className="comments-list">
            {comments.map(comment => (
                <div key={comment._id} className="comment">
                    <div className="comment-header">
                        <span className="comment-author">
                            {comment.author.username}
                        </span>
                        <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                    {user && user._id === comment.author._id && (
                        <button 
                            onClick={() => handleDelete(comment._id)}
                            className="delete-comment"
                        >
                            Delete
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CommentList;