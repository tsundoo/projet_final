import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { postService } from '../../services/post.service';
import { commentService } from '../../services/comment.service';
import CommentList from '../Comments/CommentList';
import CommentForm from '../Comments/CommentForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const PostDetail = () => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchComments = useCallback(async () => {
        try {
            const commentsData = await commentService.getComments(id);
            setComments(commentsData);
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    }, [id]);

    const fetchPost = useCallback(async () => {
        try {
            const data = await postService.getPost(id);
            setPost(data);
            // Fetch comments after fetching the post
            await fetchComments();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id, fetchComments]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await postService.deletePost(id);
                navigate('/');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleCommentAdded = async (newComment) => {
        // update comments list with the new comment
        setComments(prevComments => [newComment, ...prevComments]);
    };

    const handleCommentDeleted = async () => {
        // update comments list after deleting a comment
        await fetchComments();
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="post-detail">
            <h1>{post.title}</h1>
            <div className="post-meta">
                <span>By {post.author.username}</span>
                <span>Posted on {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            {post.image && (
                <img 
                    src={`http://localhost:8080${post.image}`} 
                    alt={post.title} 
                    className="post-image"
                />
            )}
            <div className="post-content">
                {post.content}
            </div>
            
            {user && (user._id === post.author._id || user.id === post.author._id) && (
                <div className="post-actions">
                    <button onClick={() => navigate(`/edit-post/${post._id}`)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={handleDelete} className="delete-btn">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            )}

            <div className="comments-section">
                <h3>Comments</h3>
                {user ? (
                    <CommentForm 
                    postId={id} 
                    onCommentAdded={handleCommentAdded} 
                />
                ) : (
                    <p>Please login to comment</p>
                )}
                <CommentList 
                    comments={comments} 
                    onCommentDeleted={handleCommentDeleted}
                    currentUser={user} 
                />
            </div>

            <div style={{display: 'none'}}>
                <p>User ID: {user?._id}</p>
                <p>Author ID: {post.author._id}</p>
                <p>Match: {String(user?._id) === String(post.author._id) ? 'Yes' : 'No'}</p>
            </div>
        </div>
    );
};

export default PostDetail;