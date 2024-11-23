import {create} from 'zustand';
import { persist } from 'zustand/middleware';

export const useInstagramData = create(
    persist((set) => ({
    instagramData: {
        posts:[],
        userData: {
            id: '',
            ig_id:'',
            media_count: 0,
            username: '',
            profile_picture_url: '',
            followers_count: 0,
            follows_count: 0,
            biography: '',
            name: ''
        }
    },
    setPostData: (posts) => set((state) => ({ instagramData: { ...state.instagramData, posts : posts } })),
    setUserData: (userData) => set((state) => ({ instagramData: { ...state.instagramData, userData : userData } })),
}),
{
    name: 'InstagramStorage', // required, this is the key used in storage
    storage: localStorage, // optional, defaults to localStorage
    serialize: (state) => JSON.stringify(state), // Convert state to JSON string
    deserialize: (str) => JSON.parse(str), // Parse JSON string back to object
}));