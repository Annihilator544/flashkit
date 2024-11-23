import {create} from 'zustand';
import { persist } from 'zustand/middleware';

export const useYoutubeData = create(
    persist((set) => ({
    data: {},
    setData: (data) => set({data: data})
}),{
    name: 'YoutubeStorage', // required, this is the key used in storage
    storage: localStorage, // optional, defaults to localStorage
    serialize: (state) => JSON.stringify(state), // Convert state to JSON string
    deserialize: (str) => JSON.parse(str), // Parse JSON string back to object
}));