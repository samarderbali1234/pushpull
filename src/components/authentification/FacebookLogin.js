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
 //récupération séquentiel
    const handleLogin = () => {
        window.FB.login((response) => {
            if (response.authResponse) {
                const accessToken = response.authResponse.accessToken;
                dispatch(setAccessToken(accessToken));
    
                // Encapsuler les appels async dans une fonction interne
                const fetchProfileAndPages = async () => {
                    try {
                        // Étape 1 : Récupérer le profil via l'API REST
                        const profileResponse = await fetch(`https://graph.facebook.com/v21.0/me?fields=id,name,email,picture&access_token=${accessToken}`);
                        const profile = await profileResponse.json();
                        const profileData = {
                            id: profile.id,
                            name: profile.name,
                            email: profile.email,
                            profilePicture: profile.picture.data.url,
                        };
    
                        dispatch(setUser(profileData)); // Stocker le profil dans Redux
                        console.log("Profil récupéré :", profileData);
    
                        // Étape 2 : Récupérer les pages via le SDK Facebook
                        const pagesResponse = await new Promise((resolve, reject) => {
                            window.FB.api('/me/accounts?fields=id,name,picture,access_token', (response) => {
                                if (response && !response.error) {
                                    const pagesData = response.data.map(page => ({
                                        id: page.id,
                                        name: page.name,
                                        picture: page.picture.data.url,
                                        accessToken: page.access_token,
                                    }));
                                    resolve(pagesData);
                                } else {
                                    reject(response.error);
                                }
                            });
                        });
    
                        dispatch(setUserPages(pagesResponse)); // Stocker les pages dans Redux
                        console.log("Pages récupérées :", pagesResponse);
    
                        // Redirection vers la liste des posts après le succès
                        navigate('/postsList');
                    } catch (err) {
                        console.error("Erreur lors de la récupération des données :", err);
                    }
                };
    
                // Appeler la fonction async
                fetchProfileAndPages();
            } else {
                console.error("Facebook login failed", response);
                alert("Échec de la connexion Facebook. Veuillez réessayer.");
            }
        }, { scope: 'email,publish_video,pages_show_list,pages_read_engagement,pages_manage_posts,pages_read_user_content' });
    };
   
    return (
        <button className='btn' onClick={handleLogin}>
            Se connecter avec Facebook
        </button>
    );
};

export default FacebookLogin;