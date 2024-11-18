// This function returns an object containing HTTP headers for authentication and content type.
export function authHeader() {
    // Retrieve the user object from local storage.
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Check if the user object has a token property.
    if (user?.token) {
        // If the token exists, return an object with Authorization and Content-Type headers.
        return {
            'Authorization': `Bearer ${user.token}`, // Format the token for Authorization header.
            'Content-Type': 'application/json' // Specify the content type as JSON.
        };
    } else {
        // If the token does not exist, return an object with only Content-Type header.
        return {
            'Content-Type': 'application/json'
        };
    }
} 