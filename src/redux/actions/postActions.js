// Action pour définir les publications
export const setPosts = (posts) => ({
    type: 'SET_POSTS',
    payload: posts,
});

// Action pour mettre à jour l'URL de la prochaine page
export const setNextPage = (nextPage) => ({
    type: 'SET_NEXT_PAGE',
    payload: nextPage,
});

// Action pour récupérer les publications avec pagination et inclure les images
export const fetchPosts = (nextPage = null) => async (dispatch, getState) => {
    dispatch({ type: 'LOADING_POSTS' });
    try {
        const accessToken = getState().auth.accessToken;
       
        if (!accessToken) throw new Error("Access token is missing.");

        // Ajouter les champs message et full_picture pour obtenir les images et messages
        const url = nextPage || `/me/posts?fields=message,full_picture,attachments{media,type,url}&access_token=${accessToken}`;
        
        console.log("Début de la récupération des publications");
        
        window.FB.api(url, (response) => {
            if (response && !response.error) {
                // Ajouter les nouvelles publications
                dispatch(setPosts(response.data));
                console.log("Publications récupérées :", response.data);

                // Gérer la pagination pour la page suivante
                if (response.paging && response.paging.next) {
                    dispatch(setNextPage(response.paging.next));
                } else {
                    dispatch(setNextPage(null));
                }
            } else {
                console.error("Erreur lors de la récupération des publications :", response.error);
            }
        });
    } catch (error) {
        console.error("Erreur dans fetchPosts:", error);
    }
};


