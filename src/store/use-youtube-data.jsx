import {create} from 'zustand';
import { persist } from 'zustand/middleware';

export const useYoutubeData = create(
    persist((set) => ({
    youtubeData: {},
    youtubeCalculatedData: {
        totalViewsThisWeek: 0,
        percentageChangeViews: 0,
        totalWatchTime: 0,
        percentageChangeWatchTime: 0,
        percentageChangeSubscribers: 0
    },
    eqs:{
        eqsPercentage: 0,
        eqsPercentageChange: 0,
    },
    eqsText: "",
    setEQS: (data) => set({eqs: data}),
    setEQSText: (data) => set({eqsText: data}),
    setYoutubeData: (data) => set({youtubeData: data}),
    setYoutubeCalculatedData: (data) => set({youtubeCalculatedData: data})
}),{
    name: 'YoutubeStorage', // required, this is the key used in storage
    storage: localStorage, // optional, defaults to localStorage
    serialize: (state) => JSON.stringify(state), // Convert state to JSON string
    deserialize: (str) => JSON.parse(str), // Parse JSON string back to object
}));