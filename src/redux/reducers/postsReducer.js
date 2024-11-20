// src/redux/reducers/postsReducer.js
// import { SET_POSTS } from '../types';

// const initialState = {
//     items: [],
//     loading: false,
// };

// const postsReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case 'LOADING_POSTS':
//             return {
//                 ...state,
//                 loading: true,
//             };
//         case SET_POSTS:
//             return {
//                 ...state,
//                 items: action.payload,
//                 loading: false,
//             };
//         default:
//             return state;
//     }
// };

// export default postsReducer;
// src/redux/reducers/postReducer.js
// const initialState = {
//     posts: [],
//     loading: false,
//     nextPage: null,
// };

// const postReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case 'LOADING_POSTS':
//             return { ...state, loading: true };
//         case 'SET_POSTS':
//             return { ...state, posts: [...state.posts, ...action.payload], loading: false }; // Ajouter les nouvelles publications
//         case 'SET_NEXT_PAGE':
//             return { ...state, nextPage: action.payload }; // Mettre à jour l'URL de la prochaine page
//         default:
//             return state;
//     }
// };

// export default postReducer;
const initialState = {
    posts: [],
    loading: false,
    nextPage: null,
};

const postsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOADING_POSTS':
            return { ...state, loading: true };
        case 'SET_POSTS':
            const newPosts = action.payload.filter(post => !state.posts.some(p => p.id === post.id)); // Filtre les doublons
            return {
                ...state,
                posts: [...state.posts, ...newPosts],
                loading: false,
            };
        case 'SET_NEXT_PAGE':
            return { ...state, nextPage: action.payload };
        default:
            return state;
    }
};

export default postsReducer;
