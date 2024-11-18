import api from '../utils/axios.config';

export const postService = {
    async createPost(postData) {
        try {
            const formData = new FormData();
            formData.append('title', postData.title);
            formData.append('content', postData.content);
            formData.append('image', postData.image);

            const response = await api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message || 'Failed to create post';
        }
    },

    async getPosts() {
        const response = await api.get('/posts');
        return response.data;
    },

    async getPost(id) {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    },

    async updatePost(id, postData) {
        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('content', postData.content);
        if (postData.image) {
            formData.append('image', postData.image);
        }

        const response = await api.put(`/posts/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async deletePost(id) {
        const response = await api.delete(`/posts/${id}`);
        return response.data;
    }
};