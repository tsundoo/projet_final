import api from '../utils/axios.config';

export const commentService = {
    getComments: async (postId) => {
        try {
            const response = await api.get(`/comments/post/${postId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },

    createComment: async (commentData) => {
        try {
            const response = await api.post('/comments', commentData);
            return response.data;
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error;
        }
    },

    deleteComment: async (commentId) => {
        try {
            const response = await api.delete(`/comments/${commentId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }
};