// src/App.js

import React from 'react';
import FacebookLogin from './components/authentification/FacebookLogin'; // Assurez-vous que le chemin est correct
import PostsList from './components/posts/PostsList';
import Addposts from './components/posts/AddPost';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/hero/hero';

const App = () => {
    

    return (
       
        <Router>
            <div>
                <Routes>
                    {/* Route pour la page de connexion Facebook */}
                    <Route path='/' element={<Hero />} />
                    
                    {/* Route pour afficher la liste des publications */}
                    <Route path="postsList" element={<PostsList />} />
                    <Route path="addpost" element={<Addposts />} />
                </Routes>
            </div>
        </Router>
       
    );
};

export default App;
