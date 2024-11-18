import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PostList from './components/Blog/PostList';
import PostDetail from './components/Blog/PostDetail';
import CreatePost from './components/Blog/CreatePost';
import EditPost from './components/Blog/EditPost';
import PrivateRoute from './components/Common/PrivateRoute';
import Footer from './components/Layout/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route 
            path="/create-post" 
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/edit-post/:id" 
            element={
              <PrivateRoute>
                <EditPost />
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;