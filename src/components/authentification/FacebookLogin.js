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
  //récupération paralléle
  const handleLogin = () => {
    window.FB.login((response) => {
        if (response.authResponse) {
            const accessToken = response.authResponse.accessToken;
            dispatch(setAccessToken(accessToken));

            const fetchData = async () => {
                try {
                    // Exécution parallèle des appels avec promise all permet d'exécuter  tâches simultanément
                    const [profileResponse, pagesData] = await Promise.all([
                        // L'appel REST pour récupérer le profil
                        fetch(`https://graph.facebook.com/v21.0/me?fields=id,name,email,picture&access_token=${accessToken}`)
                            .then(res => res.json())
                            .then(profile => ({
                                id: profile.id,
                                name: profile.name,
                                email: profile.email,
                                profilePicture: profile.picture.data.url,
                            })),
                        
                        // L'appel SDK pour récupérer les pages.
                        new Promise((resolve, reject) => {
                            window.FB.api('/me/accounts?fields=id,name,picture,access_token', (pagesResponse) => {
                                if (pagesResponse && !pagesResponse.error) {
                                    const pages = pagesResponse.data.map(page => ({
                                        id: page.id,
                                        name: page.name,
                                        picture: page.picture.data.url,
                                        accessToken: page.access_token,
                                    }));
                                    resolve(pages);
                                } else {
                                    reject(pagesResponse.error);
                                }
                            });
                        }),
                    ]);

                    // Mise à jour des données dans Redux
                    dispatch(setUser(profileResponse));
                    dispatch(setUserPages(pagesData));
                    console.log("Données récupérées :", { profileResponse, pagesData });

                    // Redirection après succès
                    navigate('/postsList');
                } catch (err) {
                    console.error("Erreur lors de la récupération :", err);
                }
            };

            // Exécute la fonction asynchrone pour récupérer les données
            fetchData();
        } else {
            console.error("Facebook login failed", response);
            alert("Échec de la connexion Facebook. Veuillez réessayer.");
        }
    }, { scope: 'email,publish_video,pages_show_list,pages_read_engagement,pages_manage_posts,pages_read_user_content' });
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