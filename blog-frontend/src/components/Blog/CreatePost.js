import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../services/post.service';

const CreatePost = () => {
    const [post, setPost] = useState({
        title: '',
        content: '',
        image: null
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
            await postService.createPost(post);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating post');
        }
    };

    return (
        <div className="create-post">
            <h2>Create New Post</h2>
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
                    <label>Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                </div>
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePost;