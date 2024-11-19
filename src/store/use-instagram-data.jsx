import {create} from 'zustand';

export const useInstagramData = create((set) => ({
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
}));