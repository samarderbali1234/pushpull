// src/redux/reducers/index.js
import { combineReducers } from 'redux';
import authReducer from './authSlice'; // Assurez-vous que le chemin est correct
import postsReducer from './postsReducer';
const rootReducer = combineReducers({
    auth: authReducer,
    posts: postsReducer,
});

export default rootReducer;
