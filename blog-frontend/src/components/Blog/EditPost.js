import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '../../services/post.service';

const EditPost = () => {
    const [post, setPost] = useState({
        title: '',
        content: '',
        image: null
    });
    const [currentImage, setCurrentImage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchPost = useCallback(async () => {
        try {
            const data = await postService.getPost(id);
            setPost({
                title: data.title,
                content: data.content,
                image: null
            });
            setCurrentImage(data.image);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch post');
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setPost(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await postService.updatePost(id, post);
            navigate(`/posts/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating post');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="edit-post">
            <h2>Edit Post</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Content:</label>
                    <textarea
                        name="content"
                        value={post.content}
                        onChange={handleChange}
                        required
                        rows="10"
                    />
                </div>
                <div className="form-group">
                    <label>Current Image:</label>
                    {currentImage && (
                        <img 
                            src={`http://localhost:8080${currentImage}`} 
                            alt="Current post img" 
                            style={{ maxWidth: '200px' }}
                        />
                    )}
                </div>
                <div className="form-group">
                    <label>Update Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <small>Leave empty to keep current image</small>
                </div>
                <button type="submit">Update Post</button>
            </form>
        </div>
    );
};

export default EditPost;