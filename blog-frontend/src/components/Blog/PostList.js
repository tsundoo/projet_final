import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../services/post.service';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await postService.getPosts();
            setPosts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="post-list">
            <h2>Recent Posts</h2>
            <div className="posts-grid">
                {posts.map(post => (
                    <div key={post._id} className="post-card">
                        {post.image && (
                            <img 
                                src={`http://localhost:8080${post.image}`} 
                                alt={post.title} 
                                className="post-image"
                            />
                        )}
                        <div className="post-content">
                            <h3>{post.title}</h3>
                            <p className="post-author">By {post.author.username}</p>
                            <p className="post-excerpt">
                                {post.content.substring(0, 150)}...
                            </p>
                            <Link to={`/posts/${post._id}`} className="read-more">
                                Read More
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;