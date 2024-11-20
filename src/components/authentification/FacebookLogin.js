// src/components/FacebookLogin.js

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAccessToken, setUser } from '../../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';  // Importez useNavigate pour la redirection

const FacebookLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();  // Utilisez useNavigate pour naviguer après la connexion réussie

    useEffect(() => {
        window.fbAsyncInit = () => {
            if (typeof window.FB !== 'undefined') {
                window.FB.init({
                    appId: '531368399851278',
                    autoLogAppEvents: true,
                    xfbml: true,
                    version: 'v16.0'
                });
                console.log("Facebook SDK initialized");
            } else {
                console.error("Facebook SDK not loaded.");
            }
        };

        // Charger le SDK Facebook
        (function(d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/fr_FR/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, []);
    const handleLogin = () => {
        window.FB.login(response => {
            if (response.authResponse) {
                const accessToken = response.authResponse.accessToken;
                dispatch(setAccessToken(accessToken));
    
                // Vérifie si toutes les permissions demandées ont été accordées
                window.FB.api('/me/permissions', (permissionsResponse) => {
                    const declinedPermissions = permissionsResponse.data
                        .filter(perm => perm.status === 'declined')
                        .map(perm => perm.permission);
    
                        if (declinedPermissions.length > 0) {
                            console.warn("Les permissions suivantes ont été refusées :", declinedPermissions.join(', '));
                            console.log("Certaines permissions sont manquantes, l'application pourrait ne pas fonctionner complètement.");
                        } else {
                            console.log("Toutes les permissions demandées sont activées, aucun problème détecté.");
                        }
    
                    window.FB.api('/me?fields=id,name,email,picture', user => {
                        const userData = {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            profilePicture: user.picture.data.url,
                        };
                        
                        dispatch(setUser(userData));
                        console.log('User stored in Redux:', userData);
                        navigate('/postsList');
                    });
                });
    
                console.log("Access Token:", accessToken);
            } else {
                console.error("Facebook login failed", response);
                alert("Échec de la connexion Facebook. Veuillez réessayer.");
            }
        }, { scope: 'public_profile,email,user_likes,user_photos,user_videos,user_friends,user_posts' });
    };
    
    // const handleLogin = () => {
    //     window.FB.login(response => {
    //         if (response.authResponse) {
    //             const accessToken = response.authResponse.accessToken;
    //             dispatch(setAccessToken(accessToken));  // Stocker le token dans Redux

                 


    //             window.FB.api('/me?fields=id,name,email,picture', user => {
    //                 // Inclure l'image de profil dans les données de l'utilisateur
    //                 const userData = {
    //                     id: user.id,
    //                     name: user.name,
    //                     email: user.email,
    //                     profilePicture: user.picture.data.url, // URL de l'image de profil
    //                 };
                    
    //                 dispatch(setUser(userData));  // Stocker les infos de l'utilisateur dans Redux
    //                 console.log('User stored in Redux:', userData);
    //                 navigate('/postsList');  // Redirection vers la page des posts après connexion
    //             });

    //             console.log("Access Token:", accessToken);
    //         } else {
    //             console.error("Facebook login failed", response);
    //         }
    //     }, { scope: 'public_profile,email,user_likes,user_photos,user_videos,user_friends,user_posts ' });
    // };

    return (
        <button className='btn' onClick={handleLogin}>
            Se connecter avec Facebook
        </button>
    );
};

export default FacebookLogin;