export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
export const SET_USER = 'SET_USER';

export const setAccessToken = (token) => ({
    type: SET_ACCESS_TOKEN,
    payload: token
});

export const setUser = (user) => ({
    type: SET_USER,
    payload: user
});
