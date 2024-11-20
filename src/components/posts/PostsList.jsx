// src/components/PostsList.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../redux/actions/postActions';
import './postList.css';
import Navbar from '../navbar/navbar';
const PostsList = () => {
    const dispatch = useDispatch();
    // Utilisez `?.` pour éviter les erreurs si l'état est `undefined`
    const { posts, loading, nextPage, accessToken } = useSelector(state => ({
        posts: state.posts?.posts || [],           // Initialise `posts` à un tableau vide par défaut
        loading: state.posts?.loading || false,    // Valeur par défaut de `loading`
        nextPage: state.posts?.nextPage || null,
        accessToken: state.auth?.accessToken,      // Vérifiez que l'accès à `auth` est défini
    }));
    const [scrollPosition, setScrollPosition] = useState(0);
    const { user } = useSelector(state => state.auth); // Récupérer les informations de l'utilisateur

    useEffect(() => {
        if (!accessToken) return;

        const checkFBSDK = setInterval(() => {
            if (window.FB) {
                clearInterval(checkFBSDK);
                window.FB.getLoginStatus((response) => {
                    if (response.status === 'connected') {
                        dispatch(fetchPosts());
                    } else {
                        console.error("L'utilisateur n'est pas connecté.");
                    }
                });
            }
        }, 100);

        return () => clearInterval(checkFBSDK);
    }, [dispatch, accessToken]);

    // Fonction de défilement infini
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200) {
            if (nextPage && !loading) {
                setScrollPosition(window.scrollY);  // Enregistrer la position de défilement avant de charger les données
                dispatch(fetchPosts(nextPage));
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [nextPage, loading]);

    // Restaurer la position de défilement après le chargement
    useEffect(() => {
        if (!loading) {
            window.scrollTo(0, scrollPosition);
        }
    }, [loading, scrollPosition]);

    if (loading && posts.length === 0) return (
        <div className="loading-container">
            <div className="loading-circle"></div>
        </div>
    );
    return (
        <>
        <Navbar/>
        <div className="posts-list">

            <h2>Vos Publications</h2>
            {( posts.length === 0) ? (
               <div className="loading-container">
               <div className="loading-circle"></div>
           </div>
            ) : (
                posts.map(post => {
                    const hasVideo = post.attachments?.data.some(attachment => attachment.type === 'video_autoplay');
                    return (
                        <div key={post.id} className="post">
                            {/* En-tête de la publication */}
                            <div className="post-header">
                                {user.profilePicture && (
                                    <img src={user.profilePicture} alt={`${user.name}'s profile`} style={{ width: '50px', borderRadius: '50%' }} />
                                )}
                                <div>
                                    <h3>{user.name}</h3>

                                </div>
                            </div>

                            {/* Texte de la publication */}
                            <p className="post-message">{post.message}</p>

                            {/* Affiche l'image uniquement s'il n'y a pas de vidéo */}
                            {!hasVideo && post.full_picture && (
                                <img src={post.full_picture} alt="Post" className="post-image" />
                            )}

                            {/* Affichage des pièces jointes */}
                            {post.attachments && post.attachments.data.map((attachment, index) => {
                                if (attachment.type === 'video_autoplay' && attachment.url) {
                                    return (
                                        <div key={index} className="post-video">
                                            <iframe
                                                src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(attachment.url)}&show_text=0&width=500`}
                                                width="750"
                                                height="300"
                                                style={{ border: 'none', overflow: 'hidden' }}

                                                allowFullScreen={true}
                                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                            ></iframe>
                                        </div>
                                    );
                                } 
                                return null;
                            })}
                            
                           
                            {/* Section d'interaction */}
                            <div className="post-actions">
                                <button className="like-button">Like</button>
                                <button className="comment-button">Commenter</button>
                                <button className="share-button">Partager</button>
                            </div>
                        </div>
                    );
                })
            )}
      {loading && posts.length > 0 && (
    <div className="loading-container">
        <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
        
    </div>
)}
        </div>
        </>
    );
};

export default PostsList;
